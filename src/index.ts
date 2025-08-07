import { ref, computed, watch } from 'vue';

/**
 * Simple i18n loader that:
 * - Dynamically imports remote ES module JS files (e.g. vi.js, en.js)
 * - Merges into dictionaries while preserving functions
 * - Supports nested keys (dot path), interpolation, fallback
 */

const DEFAULT_LOCALE = 'en';
const FALLBACK_LOCALE = 'en';

/** Base URL template for locale modules; replace `{locale}` when loading */
let localeModuleUrlTemplates = ref<Array<any>>([]);

/** In-memory cache of loaded dictionaries */
const dictionaries: any = {}; // e.g. { vi: { ... }, en: { ... } }
const loaded = new Set();

/** Reactive current locale */
const locale = ref(DEFAULT_LOCALE);

/** Set a new base URL template if needed */
export function addLocaleModuleUrlTemplate(template:string) {
  localeModuleUrlTemplates.value.push(template);
  loadLocale(locale.value);
}

/** Deep merge source into target, preserving function values */
function mergeDeep(target:any = {}, source:any = {}) {
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = target[key];

    if (
      srcVal &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      !(srcVal instanceof Function)
    ) {
      target[key] = mergeDeep(tgtVal && typeof tgtVal === 'object' ? tgtVal : {}, srcVal);
    } else {
      // primitive or function or array: overwrite
      target[key] = srcVal;
    }
  }
  return target;
}

/** Utility to get nested value by dot path */
function getNested(obj:any, path:any) {
  if (!obj) return undefined;
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

/** Simple interpolation for strings like "Hello, {name}!" */
function interpolate(str:any, params:any = {}) {
  return String(str).replace(/\{(\w+)\}/g, (_, k) => {
    if (params[k] === undefined) return `{${k}}`;
    return String(params[k]);
  });
}

/** Load locale module from remote URL and merge into dictionary */
export async function loadLocale(localeKey:string) {
  try {
    for (let tem of localeModuleUrlTemplates.value) {
      const url:string = tem.replace('{locale}', encodeURIComponent(localeKey));

      if (loaded.has(url)) {
        continue;
      }
      
      // dynamic import of remote module; requires the remote file to be an ES module and CORS-enabled if cross-origin
      loaded.add(url);
      const module = await import(/* @vite-ignore */ url + '?t=' + (new Date()).getTime());
      const msgs = module.default ?? module;
      if (typeof msgs !== 'object' || msgs === null) {
        throw new Error(`Locale module ${localeKey} did not export an object`);
      }

      dictionaries[localeKey] = mergeDeep(dictionaries[localeKey] || {}, msgs);
    }

    return dictionaries[localeKey];
  } catch (e) {
    if (localeKey !== FALLBACK_LOCALE) {
      // fallback
      return loadLocale(FALLBACK_LOCALE);
    }
    return {};
  }
}

/** Set current locale (async loads if needed) */
export async function setLocale(newLocale:string) {
  locale.value = newLocale;
  await loadLocale(newLocale);
}

/** Get current locale string */
export function getLocale() {
  return locale.value;
}

/** Core translate function */
export function t(key:string, params = {}) {
  // try current locale first
  const primary = dictionaries[locale.value] || {};
  let entry = getNested(primary, key);

  // fallback to fallback locale if missing
  if (entry === undefined && locale.value !== FALLBACK_LOCALE) {
    const fb = dictionaries[FALLBACK_LOCALE] || {};
    entry = getNested(fb, key);
  }

  if (entry === undefined) {
    // missing entirely
    return interpolate(key, params);
  }

  if (typeof entry === 'function') {
    // functions receive params object
    try {
      return entry(params);
    } catch (e) {
      console.warn('i18n function error for key', key, e);
      return '';
    }
  }
  return interpolate(entry, params);
}

/** Composable for Vue components */
export function useI18n() {
  return {
    locale: computed(() => locale.value),
    isLocaleLoaded: (temp: string) => {
      const url = temp.replace('{locale}', encodeURIComponent(locale.value));
      return loaded.has(url);
    },
    setLocale,
    addLocaleModuleUrlTemplate,
    t,
    loadLocale, // expose if you want to prefetch manually
    getLocale,
  };
}

/** Auto fallback: if locale ref changes and its dictionary isn't loaded, load it */
watch(
  locale,
  async (newVal, olVal) => {
    if (olVal !== undefined) {
      await loadLocale(newVal);
    }
  },
  { immediate: true }
);
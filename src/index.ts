import { ref, computed, watch } from 'vue';

/** Base URL template for locale modules; replace `{locale}` when loading */
let localeModuleTemplates = ref<Array<any>>([]);
let fallbackLocale = '';

/** In-memory cache of loaded dictionaries */
const dictionaries = ref<any>({}); // e.g. { vi: { ... }, en: { ... } }
const loaded = ref<any>([]);

/** Reactive current locale */
const locale = ref('');

/** ---------------- IndexedDB Helpers ---------------- */
const DB_NAME = 'i18nDB';
const STORE_NAME = 'locales';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveToDB(key: string, value: any) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadFromDB(key: string) {
  const db = await openDB();
  return new Promise<any>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** --------------------------------------------------- */

/** Set a new base URL template if needed */
function addLocaleModule(template: any) {
  if (Array.isArray(template)) {
    template.forEach((tem) => {
      localeModuleTemplates.value.push(tem);
    });
  } else {
    localeModuleTemplates.value.push(template);
  }

  loadLocale(locale.value);
}

/** Deep merge source into target, preserving function values */
function mergeDeep(target: any = {}, source: any = {}) {
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = target[key];

    if (
      srcVal &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      !(srcVal instanceof Function)
    ) {
      target[key] = mergeDeep(
        tgtVal && typeof tgtVal === 'object' ? tgtVal : {},
        srcVal
      );
    } else {
      target[key] = srcVal;
    }
  }
  return target;
}

/** Utility to get nested value by dot path */
function getNested(obj: any, path: any) {
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
function interpolate(str: any, params: any = {}) {
  return String(str).replace(/\{(\w+)\}/g, (_, k) => {
    if (params[k] === undefined) return `{${k}}`;
    return String(params[k]);
  });
}

async function __save(localeKey: string, name: string, msgs: any){
  if (typeof msgs !== 'object' || msgs === null) {
    throw new Error(`Locale module ${localeKey} did not export an object`);
  }

  dictionaries.value[localeKey] = dictionaries.value[localeKey] || {};
  dictionaries.value[localeKey][name] = mergeDeep(
    dictionaries.value[localeKey]?.[name] || {},
    msgs
  );
  loaded.value.push(name);

  // Lưu vào IndexedDB thay vì localStorage
  await saveToDB('__data_locale_' + name, msgs);
}

async function __load(localeKey: string, name: string, url: string) {
  try {
    if (loaded.value.includes(name)) return;

    const module = await import(/* @vite-ignore */ url + '?t=' + Date.now());
    const msgs = module.default ?? module;
    await __save(localeKey, name, msgs);
  } catch (e) {
    // Lấy từ IndexedDB khi lỗi
    const msgs = await loadFromDB('__data_locale_' + name);
    if (msgs) {
      dictionaries.value[localeKey] = dictionaries.value[localeKey] || {};
      dictionaries.value[localeKey][name] = mergeDeep(
        dictionaries.value[localeKey]?.[name] || {},
        msgs
      );
      loaded.value.push(name);
    }
  }
}

/** Load locale module from remote URL and merge into dictionary */
async function loadLocale(localeKey: string) {
  for (let tem of localeModuleTemplates.value) {
    const url: string = tem.template.replace(
      '{locale}',
      encodeURIComponent(localeKey)
    );
    __load(localeKey, tem.name, url);
  }
}

/** Set current locale (async loads if needed) */
async function setLocale(newLocale: string) {
  locale.value = newLocale;
  await loadLocale(newLocale);
}

function setFallbackLocale(l: string) {
  fallbackLocale = l;
}

/** Get current locale string */
function getLocale() {
  return locale.value;
}

/** Core translate function */
export function useTranslator(name: string) {
  return function (key: string, params = {}) {
    const primary = dictionaries.value[locale.value]?.[name] || {};
    let entry = getNested(primary, key);

    if (entry === undefined && locale.value !== fallbackLocale) {
      const fb = dictionaries.value[fallbackLocale]?.[name] || {};
      entry = getNested(fb, key);
    }

    if (entry === undefined) {
      return interpolate(key, params);
    }

    if (typeof entry === 'function') {
      try {
        return entry(params);
      } catch (e) {
        console.warn('i18n function error for key', key, e);
        return '';
      }
    }
    return interpolate(entry, params);
  };
}

/** Composable for Vue components */
export function useI18n() {
  return {
    locale,
    isLocaleLoaded: (name: string) => loaded.value.includes(name),
    setFallbackLocale,
    setLocale,
    addLocaleModule,
    addMessage: __save,
    getLocale,
  };
}

/** Auto fallback: if locale ref changes and its dictionary isn't loaded, load it */
watch(() => locale.value,
  async (newVal, olVal) => {
    if (olVal !== undefined) {
      await loadLocale(newVal);
    }
  },
  { immediate: true }
);

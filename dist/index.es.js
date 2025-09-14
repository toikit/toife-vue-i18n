import { ref as l, watch as y } from "vue";
let f = l([]), d = "";
const u = l({}), s = l([]), a = l(""), h = "i18nDB", i = "locales";
function _() {
  return new Promise((t, e) => {
    const n = indexedDB.open(h, 1);
    n.onupgradeneeded = () => {
      const o = n.result;
      o.objectStoreNames.contains(i) || o.createObjectStore(i);
    }, n.onsuccess = () => t(n.result), n.onerror = () => e(n.error);
  });
}
async function g(t, e) {
  const n = await _();
  return new Promise((o, r) => {
    const c = n.transaction(i, "readwrite");
    c.objectStore(i).put(e, t), c.oncomplete = () => o(), c.onerror = () => r(c.error);
  });
}
async function j(t) {
  const e = await _();
  return new Promise((n, o) => {
    const c = e.transaction(i, "readonly").objectStore(i).get(t);
    c.onsuccess = () => n(c.result), c.onerror = () => o(c.error);
  });
}
function m(t) {
  Array.isArray(t) ? t.forEach((e) => {
    f.value.push(e);
  }) : f.value.push(t), p(a.value);
}
function v(t = {}, e = {}) {
  for (const n of Object.keys(e)) {
    const o = e[n], r = t[n];
    o && typeof o == "object" && !Array.isArray(o) && !(o instanceof Function) ? t[n] = v(
      r && typeof r == "object" ? r : {},
      o
    ) : t[n] = o;
  }
  return t;
}
function w(t, e) {
  if (!t) return;
  const n = e.split(".");
  let o = t;
  for (const r of n) {
    if (o == null) return;
    o = o[r];
  }
  return o;
}
function b(t, e = {}) {
  return String(t).replace(/\{(\w+)\}/g, (n, o) => e[o] === void 0 ? `{${o}}` : String(e[o]));
}
async function D(t, e, n) {
  try {
    if (s.value.includes(e)) return;
    const o = await import(
      /* @vite-ignore */
      n + "?t=" + Date.now()
    ), r = o.default ?? o;
    if (typeof r != "object" || r === null)
      throw new Error(`Locale module ${t} did not export an object`);
    u.value[t] = u.value[t] || {}, u.value[t][e] = v(
      u.value[t]?.[e] || {},
      r
    ), s.value.push(e), await g("__data_locale_" + e, r);
  } catch {
    const r = await j("__data_locale_" + e);
    r && (u.value[t] = u.value[t] || {}, u.value[t][e] = v(
      u.value[t]?.[e] || {},
      r
    ), s.value.push(e));
  }
}
async function p(t) {
  for (let e of f.value) {
    const n = e.template.replace(
      "{locale}",
      encodeURIComponent(t)
    );
    D(t, e.name, n);
  }
}
async function L(t) {
  a.value = t, await p(t);
}
function S(t) {
  d = t;
}
function x() {
  return a.value;
}
function B(t) {
  return function(e, n = {}) {
    const o = u.value[a.value]?.[t] || {};
    let r = w(o, e);
    if (r === void 0 && a.value !== d) {
      const c = u.value[d]?.[t] || {};
      r = w(c, e);
    }
    if (r === void 0)
      return b(e, n);
    if (typeof r == "function")
      try {
        return r(n);
      } catch (c) {
        return console.warn("i18n function error for key", e, c), "";
      }
    return b(r, n);
  };
}
function E() {
  return {
    locale: a,
    isLocaleLoaded: (t) => s.value.includes(t),
    setFallbackLocale: S,
    setLocale: L,
    addLocaleModule: m,
    getLocale: x
  };
}
y(
  () => a.value,
  async (t, e) => {
    e !== void 0 && await p(t);
  },
  { immediate: !0 }
);
export {
  E as useI18n,
  B as useTranslator
};

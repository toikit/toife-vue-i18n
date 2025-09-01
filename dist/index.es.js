import { ref as l, watch as y, computed as h } from "vue";
let f = l([]), d = "";
const u = l({}), s = l([]), a = l(""), m = "i18nDB", i = "locales";
function _() {
  return new Promise((e, t) => {
    const n = indexedDB.open(m, 1);
    n.onupgradeneeded = () => {
      const o = n.result;
      o.objectStoreNames.contains(i) || o.createObjectStore(i);
    }, n.onsuccess = () => e(n.result), n.onerror = () => t(n.error);
  });
}
async function g(e, t) {
  const n = await _();
  return new Promise((o, r) => {
    const c = n.transaction(i, "readwrite");
    c.objectStore(i).put(t, e), c.oncomplete = () => o(), c.onerror = () => r(c.error);
  });
}
async function j(e) {
  const t = await _();
  return new Promise((n, o) => {
    const c = t.transaction(i, "readonly").objectStore(i).get(e);
    c.onsuccess = () => n(c.result), c.onerror = () => o(c.error);
  });
}
function D(e) {
  Array.isArray(e) ? e.forEach((t) => {
    f.value.push(t);
  }) : f.value.push(e), p(a.value);
}
function v(e = {}, t = {}) {
  for (const n of Object.keys(t)) {
    const o = t[n], r = e[n];
    o && typeof o == "object" && !Array.isArray(o) && !(o instanceof Function) ? e[n] = v(
      r && typeof r == "object" ? r : {},
      o
    ) : e[n] = o;
  }
  return e;
}
function w(e, t) {
  if (!e) return;
  const n = t.split(".");
  let o = e;
  for (const r of n) {
    if (o == null) return;
    o = o[r];
  }
  return o;
}
function b(e, t = {}) {
  return String(e).replace(/\{(\w+)\}/g, (n, o) => t[o] === void 0 ? `{${o}}` : String(t[o]));
}
async function L(e, t, n) {
  try {
    if (s.value.includes(t)) return;
    const o = await import(
      /* @vite-ignore */
      n + "?t=" + Date.now()
    ), r = o.default ?? o;
    if (typeof r != "object" || r === null)
      throw new Error(`Locale module ${e} did not export an object`);
    u.value[e] = u.value[e] || {}, u.value[e][t] = v(
      u.value[e]?.[t] || {},
      r
    ), s.value.push(t), await g("__data_locale_" + t, r);
  } catch {
    const r = await j("__data_locale_" + t);
    r && (u.value[e][t] = v(
      u.value[e]?.[t] || {},
      r
    ), s.value.push(t));
  }
}
async function p(e) {
  for (let t of f.value) {
    const n = t.template.replace(
      "{locale}",
      encodeURIComponent(e)
    );
    L(e, t.name, n);
  }
}
async function S(e) {
  a.value = e, await p(e);
}
function x(e) {
  d = e;
}
function A() {
  return a.value;
}
function E(e) {
  return function(t, n = {}) {
    const o = u.value[a.value]?.[e] || {};
    let r = w(o, t);
    if (r === void 0 && a.value !== d) {
      const c = u.value[d]?.[e] || {};
      r = w(c, t);
    }
    if (r === void 0)
      return b(t, n);
    if (typeof r == "function")
      try {
        return r(n);
      } catch (c) {
        return console.warn("i18n function error for key", t, c), "";
      }
    return b(r, n);
  };
}
function M() {
  return {
    locale: h(() => a.value),
    isLocaleLoaded: (e) => s.value.includes(e),
    setFallbackLocale: x,
    setLocale: S,
    addLocaleModule: D,
    getLocale: A
  };
}
y(
  a,
  async (e, t) => {
    t !== void 0 && await p(e);
  },
  { immediate: !0 }
);
export {
  M as useI18n,
  E as useTranslator
};

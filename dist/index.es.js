import { ref as f, watch as h } from "vue";
let d = f([]), l = "";
const a = f({}), s = f([]), u = f(""), j = "i18nDB", i = "locales";
function b() {
  return new Promise((e, t) => {
    const o = indexedDB.open(j, 1);
    o.onupgradeneeded = () => {
      const n = o.result;
      n.objectStoreNames.contains(i) || n.createObjectStore(i);
    }, o.onsuccess = () => e(o.result), o.onerror = () => t(o.error);
  });
}
async function D(e, t) {
  const o = await b();
  return new Promise((n, r) => {
    const c = o.transaction(i, "readwrite");
    c.objectStore(i).put(t, e), c.oncomplete = () => n(), c.onerror = () => r(c.error);
  });
}
async function L(e) {
  const t = await b();
  return new Promise((o, n) => {
    const c = t.transaction(i, "readonly").objectStore(i).get(e);
    c.onsuccess = () => o(c.result), c.onerror = () => n(c.error);
  });
}
function S(e) {
  Array.isArray(e) ? e.forEach((t) => {
    d.value.push(t);
  }) : d.value.push(e), p(u.value);
}
function v(e = {}, t = {}) {
  for (const o of Object.keys(t)) {
    const n = t[o], r = e[o];
    n && typeof n == "object" && !Array.isArray(n) && !(n instanceof Function) ? e[o] = v(
      r && typeof r == "object" ? r : {},
      n
    ) : e[o] = n;
  }
  return e;
}
function w(e, t) {
  if (!e) return;
  const o = t.split(".");
  let n = e;
  for (const r of o) {
    if (n == null) return;
    n = n[r];
  }
  return n;
}
function _(e, t = {}) {
  return String(e).replace(/\{(\w+)\}/g, (o, n) => t[n] === void 0 ? `{${n}}` : String(t[n]));
}
async function y(e, t, o) {
  if (typeof o != "object" || o === null)
    throw new Error(`Locale module ${e} did not export an object`);
  a.value[e] = a.value[e] || {}, a.value[e][t] = v(
    a.value[e]?.[t] || {},
    o
  ), s.value.push(t), await D("__data_locale_" + t, o);
}
async function x(e, t, o) {
  try {
    if (s.value.includes(t)) return;
    const n = await import(
      /* @vite-ignore */
      o + "?t=" + Date.now()
    ), r = n.default ?? n;
    await y(e, t, r);
  } catch {
    const r = await L("__data_locale_" + t);
    r && (a.value[e] = a.value[e] || {}, a.value[e][t] = v(
      a.value[e]?.[t] || {},
      r
    ), s.value.push(t));
  }
}
async function p(e) {
  for (let t of d.value) {
    const o = t.template.replace(
      "{locale}",
      encodeURIComponent(e)
    );
    x(e, t.name, o);
  }
}
async function A(e) {
  u.value = e, await p(e);
}
function B(e) {
  l = e;
}
function E() {
  return u.value;
}
async function M(e, t) {
  for (let o in t)
    t.hasOwnProperty(o) && await y(o, e, t[o]);
}
function N(e = null) {
  return function(t, o = {}) {
    const n = e ? a.value[u.value]?.[e] : a.value[u.value] || {};
    let r = w(n, t);
    if (r === void 0 && u.value !== l) {
      const c = e ? a.value[l]?.[e] : a.value[l] || {};
      r = w(c, t);
    }
    if (r === void 0)
      return _(t, o);
    if (typeof r == "function")
      try {
        return r(o);
      } catch (c) {
        return console.warn("i18n function error for key", t, c), "";
      }
    return _(r, o);
  };
}
function O() {
  return {
    locale: u,
    isLocaleLoaded: (e) => s.value.includes(e),
    setFallbackLocale: B,
    setLocale: A,
    addLocaleModule: S,
    addMessage: M,
    getLocale: E
  };
}
h(
  () => u.value,
  async (e, t) => {
    t !== void 0 && await p(e);
  },
  { immediate: !0 }
);
export {
  O as useI18n,
  N as useTranslator
};

import { ref as l, watch as h } from "vue";
let f = l([]), d = "";
const a = l({}), s = l([]), u = l(""), j = "i18nDB", i = "locales";
function b() {
  return new Promise((t, e) => {
    const o = indexedDB.open(j, 1);
    o.onupgradeneeded = () => {
      const n = o.result;
      n.objectStoreNames.contains(i) || n.createObjectStore(i);
    }, o.onsuccess = () => t(o.result), o.onerror = () => e(o.error);
  });
}
async function D(t, e) {
  const o = await b();
  return new Promise((n, r) => {
    const c = o.transaction(i, "readwrite");
    c.objectStore(i).put(e, t), c.oncomplete = () => n(), c.onerror = () => r(c.error);
  });
}
async function L(t) {
  const e = await b();
  return new Promise((o, n) => {
    const c = e.transaction(i, "readonly").objectStore(i).get(t);
    c.onsuccess = () => o(c.result), c.onerror = () => n(c.error);
  });
}
function S(t) {
  Array.isArray(t) ? t.forEach((e) => {
    f.value.push(e);
  }) : f.value.push(t), p(u.value);
}
function v(t = {}, e = {}) {
  for (const o of Object.keys(e)) {
    const n = e[o], r = t[o];
    n && typeof n == "object" && !Array.isArray(n) && !(n instanceof Function) ? t[o] = v(
      r && typeof r == "object" ? r : {},
      n
    ) : t[o] = n;
  }
  return t;
}
function w(t, e) {
  if (!t) return;
  const o = e.split(".");
  let n = t;
  for (const r of o) {
    if (n == null) return;
    n = n[r];
  }
  return n;
}
function _(t, e = {}) {
  return String(t).replace(/\{(\w+)\}/g, (o, n) => e[n] === void 0 ? `{${n}}` : String(e[n]));
}
async function y(t, e, o) {
  if (typeof o != "object" || o === null)
    throw new Error(`Locale module ${t} did not export an object`);
  a.value[t] = a.value[t] || {}, a.value[t][e] = v(
    a.value[t]?.[e] || {},
    o
  ), s.value.push(e), await D("__data_locale_" + e, o);
}
async function g(t, e, o) {
  try {
    if (s.value.includes(e)) return;
    const n = await import(
      /* @vite-ignore */
      o + "?t=" + Date.now()
    ), r = n.default ?? n;
    await y(t, e, r);
  } catch {
    const r = await L("__data_locale_" + e);
    r && (a.value[t] = a.value[t] || {}, a.value[t][e] = v(
      a.value[t]?.[e] || {},
      r
    ), s.value.push(e));
  }
}
async function p(t) {
  for (let e of f.value) {
    const o = e.template.replace(
      "{locale}",
      encodeURIComponent(t)
    );
    g(t, e.name, o);
  }
}
async function x(t) {
  u.value = t, await p(t);
}
function A(t) {
  d = t;
}
function B() {
  return u.value;
}
function E(t) {
  return function(e, o = {}) {
    const n = a.value[u.value]?.[t] || {};
    let r = w(n, e);
    if (r === void 0 && u.value !== d) {
      const c = a.value[d]?.[t] || {};
      r = w(c, e);
    }
    if (r === void 0)
      return _(e, o);
    if (typeof r == "function")
      try {
        return r(o);
      } catch (c) {
        return console.warn("i18n function error for key", e, c), "";
      }
    return _(r, o);
  };
}
function M() {
  return {
    locale: u,
    isLocaleLoaded: (t) => s.value.includes(t),
    setFallbackLocale: A,
    setLocale: x,
    addLocaleModule: S,
    addMessage: y,
    getLocale: B
  };
}
h(
  () => u.value,
  async (t, e) => {
    e !== void 0 && await p(t);
  },
  { immediate: !0 }
);
export {
  M as useI18n,
  E as useTranslator
};

import { ref as d, watch as m, computed as L } from "vue";
const w = "en", l = "en";
let p = d([]);
const u = {}, a = /* @__PURE__ */ new Set(), c = d(w);
function y(e) {
  p.value.push(e), i(c.value);
}
function v(e = {}, n = {}) {
  for (const o of Object.keys(n)) {
    const t = n[o], r = e[o];
    t && typeof t == "object" && !Array.isArray(t) && !(t instanceof Function) ? e[o] = v(r && typeof r == "object" ? r : {}, t) : e[o] = t;
  }
  return e;
}
function f(e, n) {
  if (!e) return;
  const o = n.split(".");
  let t = e;
  for (const r of o) {
    if (t == null) return;
    t = t[r];
  }
  return t;
}
function s(e, n = {}) {
  return String(e).replace(/\{(\w+)\}/g, (o, t) => n[t] === void 0 ? `{${t}}` : String(n[t]));
}
async function i(e) {
  try {
    for (let n of p.value) {
      const o = n.replace("{locale}", encodeURIComponent(e));
      if (a.has(o))
        continue;
      const t = await import(
        /* @vite-ignore */
        o + "?t=" + (/* @__PURE__ */ new Date()).getTime()
      ), r = t.default ?? t;
      if (typeof r != "object" || r === null)
        throw new Error(`Locale module ${e} did not export an object`);
      u[e] = v(u[e] || {}, r), a.add(o);
    }
    return u[e];
  } catch {
    return e !== l ? i(l) : {};
  }
}
async function h(e) {
  c.value = e, await i(e);
}
function A() {
  return c.value;
}
function g(e, n = {}) {
  const o = u[c.value] || {};
  let t = f(o, e);
  if (t === void 0 && c.value !== l) {
    const r = u[l] || {};
    t = f(r, e);
  }
  if (t === void 0)
    return s(e, n);
  if (typeof t == "function")
    try {
      return t(n);
    } catch (r) {
      return console.warn("i18n function error for key", e, r), "";
    }
  return s(t, n);
}
function C() {
  return {
    locale: L(() => c.value),
    isLocaleLoaded: (e) => {
      const n = e.replace("{locale}", encodeURIComponent(c.value));
      return a.has(n);
    },
    setLocale: h,
    addLocaleModuleUrlTemplate: y,
    t: g,
    loadLocale: i,
    // expose if you want to prefetch manually
    getLocale: A
  };
}
m(
  c,
  async (e, n) => {
    n !== void 0 && await i(e);
  },
  { immediate: !0 }
);
export {
  y as addLocaleModuleUrlTemplate,
  A as getLocale,
  i as loadLocale,
  h as setLocale,
  g as t,
  C as useI18n
};

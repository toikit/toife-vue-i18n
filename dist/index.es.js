import { ref as s, watch as L, computed as w } from "vue";
const g = "en", a = "en";
let v = s([]);
const c = {}, f = s([]), u = s(g);
function A(e) {
  v.value.push(e), i(u.value);
}
function m(e = {}, t = {}) {
  for (const r of Object.keys(t)) {
    const n = t[r], o = e[r];
    n && typeof n == "object" && !Array.isArray(n) && !(n instanceof Function) ? e[r] = m(o && typeof o == "object" ? o : {}, n) : e[r] = n;
  }
  return e;
}
function d(e, t) {
  if (!e) return;
  const r = t.split(".");
  let n = e;
  for (const o of r) {
    if (n == null) return;
    n = n[o];
  }
  return n;
}
function p(e, t = {}) {
  return String(e).replace(/\{(\w+)\}/g, (r, n) => t[n] === void 0 ? `{${n}}` : String(t[n]));
}
async function i(e) {
  try {
    for (let t of v.value) {
      const r = t.template.replace("{locale}", encodeURIComponent(e));
      if (f.value.includes(t.name))
        continue;
      const n = await import(
        /* @vite-ignore */
        r + "?t=" + (/* @__PURE__ */ new Date()).getTime()
      ), o = n.default ?? n;
      if (typeof o != "object" || o === null)
        throw new Error(`Locale module ${e} did not export an object`);
      c[e] = c[e] || {}, c[e][t.name] = m(c[e]?.[t.name] || {}, o), f.value.push(t.name);
    }
    return c[e];
  } catch {
    return e !== a ? i(a) : {};
  }
}
async function h(e) {
  u.value = e, await i(e);
}
function y() {
  return u.value;
}
function b(e) {
  return function(t, r = {}) {
    const n = c[u.value]?.[e] || {};
    let o = d(n, t);
    if (o === void 0 && u.value !== a) {
      const l = c[a]?.[e] || {};
      o = d(l, t);
    }
    if (o === void 0)
      return p(t, r);
    if (typeof o == "function")
      try {
        return o(r);
      } catch (l) {
        return console.warn("i18n function error for key", t, l), "";
      }
    return p(o, r);
  };
}
function j() {
  return {
    locale: w(() => u.value),
    isLocaleLoaded: (e) => {
      const t = e.replace("{locale}", encodeURIComponent(u.value));
      return f.value.includes(t);
    },
    setLocale: h,
    addLocaleModule: A,
    getTranslator: b,
    loadLocale: i,
    // expose if you want to prefetch manually
    getLocale: y
  };
}
L(
  u,
  async (e, t) => {
    t !== void 0 && await i(e);
  },
  { immediate: !0 }
);
export {
  A as addLocaleModule,
  y as getLocale,
  b as getTranslator,
  i as loadLocale,
  h as setLocale,
  j as useI18n
};

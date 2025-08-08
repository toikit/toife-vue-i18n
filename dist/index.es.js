import { ref as l, watch as w, computed as h } from "vue";
const A = "en", a = "en";
let v = l([]);
const u = {}, m = l([]), s = l([]), c = l(A);
function g(t) {
  v.value.push(t), i(c.value);
}
function L(t = {}, e = {}) {
  for (const r of Object.keys(e)) {
    const n = e[r], o = t[r];
    n && typeof n == "object" && !Array.isArray(n) && !(n instanceof Function) ? t[r] = L(o && typeof o == "object" ? o : {}, n) : t[r] = n;
  }
  return t;
}
function d(t, e) {
  if (!t) return;
  const r = e.split(".");
  let n = t;
  for (const o of r) {
    if (n == null) return;
    n = n[o];
  }
  return n;
}
function p(t, e = {}) {
  return String(t).replace(/\{(\w+)\}/g, (r, n) => e[n] === void 0 ? `{${n}}` : String(e[n]));
}
async function i(t) {
  try {
    for (let e of v.value) {
      const r = e.template.replace("{locale}", encodeURIComponent(t));
      if (s.value.includes(r))
        continue;
      s.value.push(r);
      const n = await import(
        /* @vite-ignore */
        r + "?t=" + (/* @__PURE__ */ new Date()).getTime()
      ), o = n.default ?? n;
      if (typeof o != "object" || o === null)
        throw new Error(`Locale module ${t} did not export an object`);
      u[t] = u[t] || {}, u[t][e.name] = L(u[t]?.[e.name] || {}, o), m.value.push(e.name);
    }
    return u[t];
  } catch {
    return t !== a ? i(a) : {};
  }
}
async function y(t) {
  c.value = t, await i(t);
}
function b() {
  return c.value;
}
function C(t) {
  return function(e, r = {}) {
    const n = u[c.value]?.[t] || {};
    let o = d(n, e);
    if (o === void 0 && c.value !== a) {
      const f = u[a]?.[t] || {};
      o = d(f, e);
    }
    if (o === void 0)
      return p(e, r);
    if (typeof o == "function")
      try {
        return o(r);
      } catch (f) {
        return console.warn("i18n function error for key", e, f), "";
      }
    return p(o, r);
  };
}
function E() {
  return {
    locale: h(() => c.value),
    isLocaleLoaded: (t) => m.value.includes(t),
    setLocale: y,
    addLocaleModule: g,
    loadLocale: i,
    // expose if you want to prefetch manually
    getLocale: b
  };
}
w(
  c,
  async (t, e) => {
    e !== void 0 && await i(t);
  },
  { immediate: !0 }
);
export {
  E as useI18n,
  C as useTranslator
};

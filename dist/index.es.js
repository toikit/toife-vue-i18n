import { ref as a, watch as h, computed as A } from "vue";
const w = "en", i = "en";
let s = a([]);
const u = {}, m = a([]), d = a([]), c = a(w);
function y(e) {
  Array.isArray(e) ? e.forEach((t) => {
    s.value.push(t);
  }) : s.value.push(e), f(c.value);
}
function L(e = {}, t = {}) {
  for (const r of Object.keys(t)) {
    const n = t[r], o = e[r];
    n && typeof n == "object" && !Array.isArray(n) && !(n instanceof Function) ? e[r] = L(o && typeof o == "object" ? o : {}, n) : e[r] = n;
  }
  return e;
}
function p(e, t) {
  if (!e) return;
  const r = t.split(".");
  let n = e;
  for (const o of r) {
    if (n == null) return;
    n = n[o];
  }
  return n;
}
function v(e, t = {}) {
  return String(e).replace(/\{(\w+)\}/g, (r, n) => t[n] === void 0 ? `{${n}}` : String(t[n]));
}
async function f(e) {
  try {
    for (let t of s.value) {
      const r = t.template.replace("{locale}", encodeURIComponent(e));
      if (d.value.includes(r))
        continue;
      d.value.push(r);
      const n = await import(
        /* @vite-ignore */
        r + "?t=" + (/* @__PURE__ */ new Date()).getTime()
      ), o = n.default ?? n;
      if (typeof o != "object" || o === null)
        throw new Error(`Locale module ${e} did not export an object`);
      u[e] = u[e] || {}, u[e][t.name] = L(u[e]?.[t.name] || {}, o), m.value.push(t.name);
    }
    return u[e];
  } catch {
    return e !== i ? f(i) : {};
  }
}
async function g(e) {
  c.value = e, await f(e);
}
function b() {
  return c.value;
}
function j(e) {
  return function(t, r = {}) {
    const n = u[c.value]?.[e] || {};
    let o = p(n, t);
    if (o === void 0 && c.value !== i) {
      const l = u[i]?.[e] || {};
      o = p(l, t);
    }
    if (o === void 0)
      return v(t, r);
    if (typeof o == "function")
      try {
        return o(r);
      } catch (l) {
        return console.warn("i18n function error for key", t, l), "";
      }
    return v(o, r);
  };
}
function C() {
  return {
    locale: A(() => c.value),
    isLocaleLoaded: (e) => m.value.includes(e),
    setLocale: g,
    addLocaleModule: y,
    getLocale: b
  };
}
h(
  c,
  async (e, t) => {
    t !== void 0 && await f(e);
  },
  { immediate: !0 }
);
export {
  C as useI18n,
  j as useTranslator
};

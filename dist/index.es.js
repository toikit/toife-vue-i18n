import { ref as a, watch as L, computed as w } from "vue";
let s = a([]), i = "";
const u = {}, m = a([]), d = a([]), c = a("");
function y(e) {
  Array.isArray(e) ? e.forEach((t) => {
    s.value.push(t);
  }) : s.value.push(e), l(c.value);
}
function h(e = {}, t = {}) {
  for (const r of Object.keys(t)) {
    const n = t[r], o = e[r];
    n && typeof n == "object" && !Array.isArray(n) && !(n instanceof Function) ? e[r] = h(o && typeof o == "object" ? o : {}, n) : e[r] = n;
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
async function l(e) {
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
      u[e] = u[e] || {}, u[e][t.name] = h(u[e]?.[t.name] || {}, o), m.value.push(t.name);
    }
    return u[e];
  } catch {
    return e !== i ? l(i) : {};
  }
}
async function b(e) {
  c.value = e, await l(e);
}
function g(e) {
  i = e;
}
function j() {
  return c.value;
}
function T(e) {
  return function(t, r = {}) {
    const n = u[c.value]?.[e] || {};
    let o = p(n, t);
    if (o === void 0 && c.value !== i) {
      const f = u[i]?.[e] || {};
      o = p(f, t);
    }
    if (o === void 0)
      return v(t, r);
    if (typeof o == "function")
      try {
        return o(r);
      } catch (f) {
        return console.warn("i18n function error for key", t, f), "";
      }
    return v(o, r);
  };
}
function x() {
  return {
    locale: w(() => c.value),
    isLocaleLoaded: (e) => m.value.includes(e),
    setFallbackLocale: g,
    setLocale: b,
    addLocaleModule: y,
    getLocale: j
  };
}
L(
  c,
  async (e, t) => {
    t !== void 0 && await l(e);
  },
  { immediate: !0 }
);
export {
  x as useI18n,
  T as useTranslator
};

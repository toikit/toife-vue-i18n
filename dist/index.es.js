import { ref as a, watch as m, computed as L } from "vue";
let i = a([]), f = "";
const l = a({}), s = a([]), v = a([]), c = a("");
function w(e) {
  Array.isArray(e) ? e.forEach((t) => {
    i.value.push(t);
  }) : i.value.push(e), d(c.value);
}
function h(e = {}, t = {}) {
  for (const o of Object.keys(t)) {
    const n = t[o], r = e[o];
    n && typeof n == "object" && !Array.isArray(n) && !(n instanceof Function) ? e[o] = h(r && typeof r == "object" ? r : {}, n) : e[o] = n;
  }
  return e;
}
function p(e, t) {
  if (!e) return;
  const o = t.split(".");
  let n = e;
  for (const r of o) {
    if (n == null) return;
    n = n[r];
  }
  return n;
}
function y(e, t = {}) {
  return String(e).replace(/\{(\w+)\}/g, (o, n) => t[n] === void 0 ? `{${n}}` : String(t[n]));
}
async function b(e, t, o, n = !1) {
  try {
    const r = await import(
      /* @vite-ignore */
      o + "?t=" + (/* @__PURE__ */ new Date()).getTime()
    ), u = r.default ?? r;
    if (typeof u != "object" || u === null)
      throw new Error(`Locale module ${e} did not export an object`);
    l.value[e] = l.value[e] || {}, l.value[e][t] = h(l.value[e]?.[t] || {}, u), s.value.push(t);
  } catch {
    n || s.value.push(t);
  }
}
async function d(e) {
  for (let t of i.value) {
    const o = t.template.replace("{locale}", encodeURIComponent(e));
    v.value.includes(o) || (v.value.push(o), b(e, t.name, o, t.required));
  }
}
async function g(e) {
  c.value = e, await d(e);
}
function j(e) {
  f = e;
}
function A() {
  return c.value;
}
function _(e) {
  return function(t, o = {}) {
    const n = l.value[c.value]?.[e] || {};
    let r = p(n, t);
    if (r === void 0 && c.value !== f) {
      const u = l.value[f]?.[e] || {};
      r = p(u, t);
    }
    if (r === void 0)
      return y(t, o);
    if (typeof r == "function")
      try {
        return r(o);
      } catch (u) {
        return console.warn("i18n function error for key", t, u), "";
      }
    return y(r, o);
  };
}
function x() {
  return {
    locale: L(() => c.value),
    isLocaleLoaded: (e) => s.value.includes(e),
    setFallbackLocale: j,
    setLocale: g,
    addLocaleModule: w,
    getLocale: A
  };
}
m(
  c,
  async (e, t) => {
    t !== void 0 && await d(e);
  },
  { immediate: !0 }
);
export {
  x as useI18n,
  _ as useTranslator
};

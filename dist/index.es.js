import { ref as a, watch as _, computed as y } from "vue";
let f = a([]), s = "";
const u = a({}), c = a([]), l = a("");
function h(t) {
  Array.isArray(t) ? t.forEach((e) => {
    f.value.push(e);
  }) : f.value.push(t), v(l.value);
}
function d(t = {}, e = {}) {
  for (const r of Object.keys(e)) {
    const o = e[r], n = t[r];
    o && typeof o == "object" && !Array.isArray(o) && !(o instanceof Function) ? t[r] = d(n && typeof n == "object" ? n : {}, o) : t[r] = o;
  }
  return t;
}
function p(t, e) {
  if (!t) return;
  const r = e.split(".");
  let o = t;
  for (const n of r) {
    if (o == null) return;
    o = o[n];
  }
  return o;
}
function g(t, e = {}) {
  return String(t).replace(/\{(\w+)\}/g, (r, o) => e[o] === void 0 ? `{${o}}` : String(e[o]));
}
async function w(t, e, r) {
  try {
    if (c.value.includes(e)) return;
    const o = await import(
      /* @vite-ignore */
      r + "?t=" + (/* @__PURE__ */ new Date()).getTime()
    ), n = o.default ?? o;
    if (typeof n != "object" || n === null)
      throw new Error(`Locale module ${t} did not export an object`);
    u.value[t] = u.value[t] || {}, u.value[t][e] = d(u.value[t]?.[e] || {}, n), c.value.push(e), localStorage.setItem("__data_locale_" + e, JSON.stringify(n));
  } catch {
    let n = localStorage.getItem("__data_locale_" + e);
    n && (u.value[t][e] = d(u.value[t]?.[e] || {}, JSON.parse(n)), c.value.push(e));
  }
}
async function v(t) {
  for (let e of f.value) {
    const r = e.template.replace("{locale}", encodeURIComponent(t));
    w(t, e.name, r);
  }
}
async function L(t) {
  l.value = t, await v(t);
}
function b(t) {
  s = t;
}
function m() {
  return l.value;
}
function j(t) {
  return function(e, r = {}) {
    const o = u.value[l.value]?.[t] || {};
    let n = p(o, e);
    if (n === void 0 && l.value !== s) {
      const i = u.value[s]?.[t] || {};
      n = p(i, e);
    }
    if (n === void 0)
      return g(e, r);
    if (typeof n == "function")
      try {
        return n(r);
      } catch (i) {
        return console.warn("i18n function error for key", e, i), "";
      }
    return g(n, r);
  };
}
function A() {
  return {
    locale: y(() => l.value),
    isLocaleLoaded: (t) => c.value.includes(t),
    setFallbackLocale: b,
    setLocale: L,
    addLocaleModule: h,
    getLocale: m
  };
}
_(
  l,
  async (t, e) => {
    e !== void 0 && await v(t);
  },
  { immediate: !0 }
);
export {
  A as useI18n,
  j as useTranslator
};

import { ref as l, watch as h, computed as L } from "vue";
let i = l([]), f = "";
const c = l({}), y = l([]), d = l([]), u = l("");
function w(e) {
  Array.isArray(e) ? e.forEach((n) => {
    i.value.push(n);
  }) : i.value.push(e), s(u.value);
}
function m(e = {}, n = {}) {
  for (const o of Object.keys(n)) {
    const t = n[o], r = e[o];
    t && typeof t == "object" && !Array.isArray(t) && !(t instanceof Function) ? e[o] = m(r && typeof r == "object" ? r : {}, t) : e[o] = t;
  }
  return e;
}
function v(e, n) {
  if (!e) return;
  const o = n.split(".");
  let t = e;
  for (const r of o) {
    if (t == null) return;
    t = t[r];
  }
  return t;
}
function p(e, n = {}) {
  return String(e).replace(/\{(\w+)\}/g, (o, t) => n[t] === void 0 ? `{${t}}` : String(n[t]));
}
async function b(e, n, o) {
  try {
    const t = await import(
      /* @vite-ignore */
      n + "?t=" + (/* @__PURE__ */ new Date()).getTime()
    ), r = t.default ?? t;
    if (typeof r != "object" || r === null)
      throw new Error(`Locale module ${o} did not export an object`);
    c.value[o] = c.value[o] || {}, c.value[o][e] = m(c.value[o]?.[e] || {}, r);
  } catch (t) {
    console.log(t);
  } finally {
    y.value.push(e);
  }
}
async function s(e) {
  for (let n of i.value) {
    const o = n.template.replace("{locale}", encodeURIComponent(e));
    d.value.includes(o) || (d.value.push(o), b(n.name, o, e));
  }
}
async function g(e) {
  u.value = e, await s(e);
}
function j(e) {
  f = e;
}
function A() {
  return u.value;
}
function _(e) {
  return function(n, o = {}) {
    const t = c.value[u.value]?.[e] || {};
    let r = v(t, n);
    if (r === void 0 && u.value !== f) {
      const a = c.value[f]?.[e] || {};
      r = v(a, n);
    }
    if (r === void 0)
      return p(n, o);
    if (typeof r == "function")
      try {
        return r(o);
      } catch (a) {
        return console.warn("i18n function error for key", n, a), "";
      }
    return p(r, o);
  };
}
function x() {
  return {
    locale: L(() => u.value),
    isLocaleLoaded: (e) => y.value.includes(e),
    setFallbackLocale: j,
    setLocale: g,
    addLocaleModule: w,
    getLocale: A
  };
}
h(
  u,
  async (e, n) => {
    n !== void 0 && await s(e);
  },
  { immediate: !0 }
);
export {
  x as useI18n,
  _ as useTranslator
};

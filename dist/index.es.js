import { ref as i, watch as h, computed as L } from "vue";
let a = i([]), f = "";
const u = {}, y = i([]), d = i([]), c = i("");
function w(e) {
  Array.isArray(e) ? e.forEach((n) => {
    a.value.push(n);
  }) : a.value.push(e), s(c.value);
}
function m(e = {}, n = {}) {
  for (const o of Object.keys(n)) {
    const t = n[o], r = e[o];
    t && typeof t == "object" && !Array.isArray(t) && !(t instanceof Function) ? e[o] = m(r && typeof r == "object" ? r : {}, t) : e[o] = t;
  }
  return e;
}
function p(e, n) {
  if (!e) return;
  const o = n.split(".");
  let t = e;
  for (const r of o) {
    if (t == null) return;
    t = t[r];
  }
  return t;
}
function v(e, n = {}) {
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
    u[o] = u[o] || {}, u[o][e] = m(u[o]?.[e] || {}, r);
  } catch (t) {
    console.log(t);
  } finally {
    y.value.push(e);
  }
}
async function s(e) {
  for (let n of a.value) {
    const o = n.template.replace("{locale}", encodeURIComponent(e));
    d.value.includes(o) || (d.value.push(o), b(n.name, o, e));
  }
}
async function g(e) {
  c.value = e, await s(e);
}
function j(e) {
  f = e;
}
function A() {
  return c.value;
}
function _(e) {
  return function(n, o = {}) {
    const t = u[c.value]?.[e] || {};
    let r = p(t, n);
    if (r === void 0 && c.value !== f) {
      const l = u[f]?.[e] || {};
      r = p(l, n);
    }
    if (r === void 0)
      return v(n, o);
    if (typeof r == "function")
      try {
        return r(o);
      } catch (l) {
        return console.warn("i18n function error for key", n, l), "";
      }
    return v(r, o);
  };
}
function x() {
  return {
    locale: L(() => c.value),
    isLocaleLoaded: (e) => y.value.includes(e),
    setFallbackLocale: j,
    setLocale: g,
    addLocaleModule: w,
    getLocale: A
  };
}
h(
  c,
  async (e, n) => {
    n !== void 0 && await s(e);
  },
  { immediate: !0 }
);
export {
  x as useI18n,
  _ as useTranslator
};

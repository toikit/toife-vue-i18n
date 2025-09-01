/** --------------------------------------------------- */
/** Set a new base URL template if needed */
declare function addLocaleModule(template: any): void;
/** Set current locale (async loads if needed) */
declare function setLocale(newLocale: string): Promise<void>;
declare function setFallbackLocale(l: string): void;
/** Get current locale string */
declare function getLocale(): string;
/** Core translate function */
export declare function useTranslator(name: string): (key: string, params?: {}) => any;
/** Composable for Vue components */
export declare function useI18n(): {
    locale: import('vue').ComputedRef<string>;
    isLocaleLoaded: (name: string) => any;
    setFallbackLocale: typeof setFallbackLocale;
    setLocale: typeof setLocale;
    addLocaleModule: typeof addLocaleModule;
    getLocale: typeof getLocale;
};
export {};

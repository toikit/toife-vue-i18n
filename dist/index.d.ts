/** Set a new base URL template if needed */
declare function addLocaleModule(template: any): void;
/** Load locale module from remote URL and merge into dictionary */
declare function loadLocale(localeKey: string): Promise<any>;
/** Set current locale (async loads if needed) */
declare function setLocale(newLocale: string): Promise<void>;
/** Get current locale string */
declare function getLocale(): string;
/** Core translate function */
export declare function useTranslator(name: string): (key: string, params?: {}) => any;
/** Composable for Vue components */
export declare function useI18n(): {
    locale: import('vue').ComputedRef<string>;
    isLocaleLoaded: (name: string) => any;
    setLocale: typeof setLocale;
    addLocaleModule: typeof addLocaleModule;
    loadLocale: typeof loadLocale;
    getLocale: typeof getLocale;
};
export {};

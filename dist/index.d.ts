/** Set a new base URL template if needed */
export declare function addLocaleModuleUrlTemplate(template: string): void;
/** Load locale module from remote URL and merge into dictionary */
export declare function loadLocale(localeKey: string): Promise<any>;
/** Set current locale (async loads if needed) */
export declare function setLocale(newLocale: string): Promise<void>;
/** Get current locale string */
export declare function getLocale(): string;
/** Core translate function */
export declare function t(key: string, params?: {}): any;
/** Composable for Vue components */
export declare function useI18n(): {
    locale: import('vue').ComputedRef<string>;
    isLocaleLoaded: (temp: string) => boolean;
    setLocale: typeof setLocale;
    addLocaleModuleUrlTemplate: typeof addLocaleModuleUrlTemplate;
    t: typeof t;
    loadLocale: typeof loadLocale;
    getLocale: typeof getLocale;
};

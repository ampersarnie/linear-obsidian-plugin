export interface PluginSettings {
    apiKey: string;
    allowRefresh: boolean;
    [key: string]: any; // to allow for updates.
}

export const INTERVAL = 15;
export const S_IN_MS = 1000;
export const DEFAULT_SETTINGS: Partial<PluginSettings> = {
    apiKey: '',
    allowRefresh: true,
};
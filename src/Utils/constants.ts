export interface PluginSettings {
    LinearToken: {
        access_token: string;
    }
}

export const S_IN_MS = 1000;
export const DEFAULT_SETTINGS: Partial<PluginSettings> = {
    LinearToken: {
        access_token: '',
    },
};
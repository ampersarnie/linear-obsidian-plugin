import React, { useEffect, useState } from "react";

import Item from "./Item";
import Toggle from "./Toggle";
import LinearPlugin from "main";

import "./../../styles/settings.scss";

type Props = {
    plugin: LinearPlugin;
}

const DEFAULT_USER = {
    name: '',
    displayName: '',
    avatarUrl: '',
    email: '',
};

export default ({ plugin }: Props) => {
    const [apiKeyValue, setApiKeyValue] = useState(plugin.settings.apiKey);
    const [user, setUser] = useState(DEFAULT_USER);
    const [settings, setSettings] = useState(plugin.settings);

    const resetSettings = async () => {
        const defaults = await plugin.resetSettings();
        setApiKeyValue('');
        setSettings(defaults);
        setUser(DEFAULT_USER);
    }

    const updateSetting = (action:string) => async (e:any) => {
        let value = e.target.value;

        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        }

        if (action === 'apiKey') {
            value = apiKeyValue;
        }

        const updatedSettings = {
            ...settings,
            [action]: value
        };

        setSettings(updatedSettings);
        plugin.saveSettings(updatedSettings);
    };

    useEffect(() => {
        if (settings?.apiKey) { 
            plugin.Linear.getCurrentUser().then((response) => {
                setUser(response.data.viewer);
            });
        }
    }, [settings]);

    // const assigneeName = name ?? 'Unassigned';
    const id = btoa(`${user.name}-settings`);
    const urlFill = user?.name ? `url(#${id})` : 'var(--background-avatar-default)';

    const UserComponent = (
        <div className="user-display">
            <div className="user-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="50" height="50">
                    {user.avatarUrl ? (
                        <defs>
                            <pattern id={id} patternUnits="userSpaceOnUse" width="50" height="50">
                                <image href={user.avatarUrl} x="0" y="0" width="50" height="50" />
                            </pattern>
                        </defs>
                    ) : ''}
                    <circle cx="25" cy="25" r="25" fill={urlFill} className="avatar" />
                </svg>
            </div>
            <div className="user-name">
                {user.name}
            </div>
            <div className="user-email">
                {user.email}
            </div>
        </div>
    );
    
    return (
        <>
            <h1>Linear Plugin</h1>
            <div className="linear-plugin--settings__user">
                {UserComponent}
                <div className="setting-item">
                    <div className="setting-item-info">
                        <div className="setting-item-name">
                            Linear Personal API Key
                        </div>
                        <div className="setting-item-description">
                            Your personal API Key is required to interact with Linear, this can be created on the <a href="https://linear.app/settings/account/security" target="_blank">Linear Security & Access</a> settings.
                        </div>
                    </div>
                    <div className="setting-item-control">
                        <input type="password" spellCheck="false" placeholder="API Key" value={apiKeyValue} onChange={(e) => setApiKeyValue(e.target.value)} />
                        <button onClick={updateSetting('apiKey')}>Save Key</button>
                    </div>
                </div>
            </div>
            <Item name="General" isHeading />
            <Item
                name="Allow Background Refresh"
                description="Allow the plugin to retrieve issues in the background at a regular interval."
                isToggle
            >
                <Toggle checked={settings.allowRefresh} onChange={updateSetting('allowRefresh')} />
            </Item>
            <Item
                name="Reset All Settings"
                description="Resets all settings back to their default."
            >
                <button onClick={resetSettings}>Reset</button>
            </Item>
        </>
    );
}
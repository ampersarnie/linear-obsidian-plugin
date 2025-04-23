import React, { useEffect, useState } from "react";

import ApiKey from "./ApiKey";
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
    const [allowRefresh, setAllowRefresh] = useState(plugin.settings.allowRefresh);
    const [apiKey, setApiKey] = useState(plugin.settings.apiKey);
    const [keyReset, setKeyReset] = useState(false);
    const [user, setUser] = useState(DEFAULT_USER);

    const updateSetting = (action:string) => async (e:any) => {
        let value;

        console.log(action)

        switch(action) {
            case 'allowRefresh':
                setAllowRefresh((prev) => !prev);
                value = e.target.checked;
                break;
            case 'apiKeyValue':
                setApiKey(e.target.value);
                break;
            case 'apiKey':
                value = apiKey;
                if (!apiKey) setUser(DEFAULT_USER);
                setKeyReset(!apiKey);
                break;
            default:
                value = e.target.value;
                break;
        }

        if (value) {
            await plugin.saveSettings({
                ...plugin.settings,
                [action]: value,
            });
        }
    };

    useEffect(() => {
        plugin.Linear.getCurrentUser().then((response) => {
            setUser(response.data.viewer);
        });
    }, [apiKey]);

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
        <div>
            <h1>Linear Plugin</h1>
            <div className="linear-plugin--settings__user">
                {/* @ts-expect-error */}
                <ApiKey hasKey={!keyReset}>
                    {/* @ts-expect-error */}
                    <ApiKey.Active>
                        {UserComponent}
                        <div className="additional-context">
                            <button onClick={() => setKeyReset(true)}>Change API Key</button>
                        </div>
                    </ApiKey.Active>
                    {/* @ts-expect-error */}
                    <ApiKey.Inactive>
                        {UserComponent}
                        <div className="api-key-input">
                            <div className="setting-item-info">
                                <div className="setting-item-name">
                                    Linear Personal API Key
                                </div>
                                <div className="setting-item-description">
                                    Your personal API Key is required to interact with Linear, this can be created on the <a href="https://linear.app/settings/account/security" target="_blank">Linear Security & Access</a> settings.
                                </div>
                            </div>
                            <input type="password" spellCheck="false" placeholder="API Key" value={apiKey} onChange={updateSetting('apiKeyValue')} />
                            <button onClick={updateSetting('apiKey')}>Save Key</button>
                        </div>
                    </ApiKey.Inactive>
                </ApiKey>
            </div>
            <Item name="General" isHeading />
            <Item
                name="Allow Background Refresh"
                description="Allow the plugin to retrieve issues in the background at a regular interval."
            >
                <Toggle checked={allowRefresh} onChange={updateSetting('allowRefresh')} />
            </Item>
        </div>
    );
}
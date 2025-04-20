import React, { useState } from "react";

import Item from "./Settings/Item";
import Toggle from "./Settings/Toggle";
import LinearPlugin from "main";

type Props = {
    plugin: LinearPlugin;
}

export default ({ plugin }: Props) => {
    const [allowRefresh, setAllowRefresh] = useState(plugin.settings.allowRefresh);
    const updateSetting = async (e:any) => {
        await plugin.saveSettings({
            ...plugin.settings,
            allowRefresh: e.target.checked,
        });
        setAllowRefresh((prev) => !prev);
    };
    
    return (
        <div>
            <h1>Linear Plugin</h1>
            <Item
                name="Authenticate"
                description="Authenticate with Linear.app to allow Obsidian to retrieve your issues."
            >
                <a href="https://linear.app/oauth/authorize?response_type=code&client_id=a8ad4c6932a98da47cbcdb7d24a35016&redirect_uri=obsidian://linear-obsidian&state=SECURE_RANDOM&scope=read">Auth</a>
            </Item>
            <Item name="General" isHeading />
            <Item
                name="Allow Background Refresh"
                description="Allow the plugin to retrieve issues in the background at a regular interval."
            >
                <Toggle checked={allowRefresh} onChange={updateSetting} />
            </Item>
        </div>
    );
}
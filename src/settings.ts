import * as React from "react";
import * as ReactDOM from 'react-dom/client';

import LinearPlugin from './main';
import Settings from './Components/Settings';

import { App, PluginSettingTab, Setting } from 'obsidian';

export class SettingsTab extends PluginSettingTab {
	plugin: LinearPlugin;

  	constructor(app: App, plugin: LinearPlugin) {
		super(app, plugin);
		this.plugin = plugin;
  	}

  	display(): void {
		let { containerEl } = this;
		containerEl.empty();

		const reactElement = React.createElement(Settings, {
			plugin: this.plugin
		});

		const root = ReactDOM.createRoot(containerEl);
		root.render(reactElement);
  	}
}

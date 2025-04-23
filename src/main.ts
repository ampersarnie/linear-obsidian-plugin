import { Plugin } from "obsidian";
import { ViewPlugin } from '@codemirror/view';

import { SettingsTab } from './settings';
import LinearAPI from "Linear/LinearAPI";
import BlockDecoration from "Decorators/BlockDecoration";
import TextDecoration from "Decorators/TextDecoration";

import LinearAuthentication from "ProtocolHandlers/LinearAuthentication";
import markdownPostProcessor from "PostProcessors/markdownPostProcessor";
import { DEFAULT_SETTINGS, INTERVAL, PluginSettings, S_IN_MS } from "Utils/constants";
import cacheIssues from "Utils/cacheIssues"

import { DOMRootNodes } from "../types";

import "./styles/styles.scss"

export default class LinearPlugin extends Plugin {
  	settings: PluginSettings;
  	Linear: LinearAPI;
  	DOMRootNodes: DOMRootNodes = {};

	/**
	 * On plugin load register processors, decorators, protocol handlers.
	 */
  	async onload(): Promise<void> {
		console.log('onload')
		await this.loadSettings();
		this.addSettingTab(new SettingsTab(this.app, this));

		this.Linear = new LinearAPI(this.settings.apiKey)

		this.app.workspace.on('editor-change', async () => {
			// await cacheIssues(this.app, this.Linear);
	  	});

		this.app.workspace.on('layout-change', async () => {
			await cacheIssues(this.app, this.Linear);
	  	});

		this.app.workspace.on('file-open', async () => {
			await cacheIssues(this.app, this.Linear);
	  	});

		this.registerObsidianProtocolHandler('linear-obsidian', LinearAuthentication(this));

		BlockDecoration.Plugin = this;

		this.registerEditorExtension(
			[
				ViewPlugin.fromClass(
					BlockDecoration,
					{
					  decorations: (value: BlockDecoration) => value.decorations,
					}
			  	),
				ViewPlugin.fromClass(
					TextDecoration,
					{
						decorations: (value: TextDecoration) => value.decorations,
					}
				),
			]
		);

		this.registerMarkdownPostProcessor(markdownPostProcessor(this));
	
		this.registerInterval(window.setInterval(() => {
			if (this.settings.allowRefresh) {
				this.Linear.rehydrateIssues();
			}
		}, INTERVAL * S_IN_MS, true));

		cacheIssues(this.app, this.Linear);
  	}

	/**
	 * Load settings with any defaults.
	 */
  	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	/**
	 * Saves the settings from `this` if param not passed, otherwise the
	 * param settings are saved.
	 * 
	 * @param {PluginSetting} settings - Object of settings to save.
	 */
	async saveSettings(settings: PluginSettings | null = null) {
		if (settings) {
			this.settings = settings;
		}

		await this.saveData(settings ?? this.settings);
		await this.loadSettings();
  	}

	async resetSettings() {
		await this.saveData(DEFAULT_SETTINGS);
		await this.loadSettings();
		return this.settings;
	}
}
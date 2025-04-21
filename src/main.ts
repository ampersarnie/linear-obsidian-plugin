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

  	async onload(): Promise<void> {
		await this.loadSettings();
		this.addSettingTab(new SettingsTab(this.app, this));

		if (this.settings.LinearToken?.access_token ) {
	  		this.Linear = new LinearAPI(this.settings.LinearToken?.access_token)
		}

		this.app.workspace.on('editor-change', async () => {
			await cacheIssues(this.app, this.Linear);
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

  	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(settings: PluginSettings | null = null) {
		if (settings) {
			this.settings = settings;
		}

		await this.saveData(settings ?? this.settings);
		await this.loadSettings();
  	}
}
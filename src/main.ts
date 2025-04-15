import { Plugin } from "obsidian";
import { ViewPlugin } from '@codemirror/view';

import { ExampleSettingTab } from './settings';
import LinearAPI from "LinearAPI";
import Cache from "IssueCache";
import WidgetDecoration from "CodeMirror/WidgetDecoration";

import protocolHandler from "protocolHandler";
import markdownPostProcessor from "markdownPostProcessor";
import { DEFAULT_SETTINGS, PluginSettings, S_IN_MS } from "Utils/constants";
import cacheIssues from "Utils/cacheIssues"

import { DOMRootNodes } from "../types";

import "./styles/styles.scss"

export default class LinearPlugin extends Plugin {
  	settings: PluginSettings;
  	Linear: LinearAPI;
  	Cache = new Cache();
  	DOMRootNodes: DOMRootNodes = {};

  	async onload(): Promise<void> {
		await this.loadSettings();
		this.addSettingTab(new ExampleSettingTab(this.app, this));

		if (this.settings.LinearToken?.access_token ) {
	  		this.Linear = new LinearAPI(this.settings.LinearToken?.access_token)
		}

		// When a change is made directly in the edit: e.g typing
		this.app.workspace.on('editor-change', () => {
	  		cacheIssues(this.app, this.Cache, this.Linear);
		});

		this.app.workspace.on('layout-change', () => {
	  		cacheIssues(this.app, this.Cache, this.Linear, true);
		});

		this.registerObsidianProtocolHandler('linear-obsidian', protocolHandler(this));

		this.registerEditorExtension([ViewPlugin.fromClass(
	  		WidgetDecoration,
	  		{
				decorations: (value: WidgetDecoration) => value.decorations,
	  		}
		)]);

		this.registerMarkdownPostProcessor(markdownPostProcessor(this));
	
		this.registerInterval(window.setInterval(() => {
	  	cacheIssues(this.app, this.Cache, this.Linear);
		}, 20 * S_IN_MS, true));

		cacheIssues(this.app, this.Cache, this.Linear);
  	}

  	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
  	}
}
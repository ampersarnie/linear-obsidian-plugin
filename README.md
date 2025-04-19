# Obsidian Linear Plugin

> [!WARNING]
> This plugin is still in **Beta**, so issues may still occur. Use at your own risk - I am not be responsible for loss of content, or damaged vaults.

An unofficial plugin for [Obsidian.md](http://obsidian.md) that allows you to embed your [Linear](https://linear.app) issues and tasks within an Obsidian document.

![](./screenshot.png)

## Quick Start

Authenticate with Linear by going to `Obsidian` > `Settings` > `Linear` and click `Auth`. This will redirect you to Linear and allow you to authorise Obsidian to have access to your issues. Once approved, Linear will then reopen Obsidian.

Issues and tasks can be added by referencing the identifier of an issue and including it in markup, like `[AMP-1]`.

Mark up reacts in different ways depending on how you include it in your document. Current there are two types of presentation;

1. **Card** - Issues are presented as a card if they are the only mark up in a paragraph block or line.
2. **Inline** - Any issues that are surrounded by content, or included on a non-paragraph block such as a line, will be presented as inline to be readable with the content.
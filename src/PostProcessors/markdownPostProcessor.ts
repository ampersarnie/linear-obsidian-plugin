import * as React from "react";
import * as ReactDOM from 'react-dom/client';
import Card from "Components/Card";
import Inline from "Components/Inline";

import findElementByText from "Utils/findElementByText";
import LinearPlugin from "main";
import waitFor from "Utils/waitFor";

const mountIssue = async (Plugin:LinearPlugin, el: HTMLInputElement | null, identifiers: string[]) => {
	if (!el) {
		return;
	}

	// @ts-expect-error
	let html = el.getHTML();

	for(let identifier of identifiers) {
		const isInlineTag = !['P'].includes(el?.tagName || '');

		const Component = isInlineTag ? Inline : Card;

		const reactElement = React.createElement(Component, {
			plugin: Plugin,
			identifier,
		});

		const rand = (Math.random() + 1).toString(36).substring(7);

		let wrap = document.createElement("div");
		wrap.id = `linear-container-${rand}`;
		wrap.dataset.linearInline = isInlineTag.toString();
		wrap.dataset.viewport = 'reader';
		wrap.className = "cm-linear";
		wrap.innerText = identifier;

		html = html.replace(`[${identifier}]`, wrap.outerHTML)!;
		// @ts-expect-error
		el.setHTMLUnsafe(html);

		// Ensure the element is ready
		waitFor(`#${wrap.id}[data-viewport="reader"]`, (node) => {
			if (typeof Plugin.DOMRootNodes[wrap.id] === 'undefined') {
				Plugin.DOMRootNodes[wrap.id] = ReactDOM.createRoot(node);
			}
			
			Plugin.DOMRootNodes[wrap.id].render(reactElement);
		});
	}
}

export default (Plugin:LinearPlugin) => async (element: HTMLElement | Node | null, context: any) => {
	const elements = findElementByText(element, /(?<full>\[(?<ID>[A-Za-z]{1,7}-[0-9]{1,6})\])/);

	
	if (elements.length && elements.length <= 0) {
		return;
	}

	const IDs = [];
	let elm;
	
	for(let i in elements) {
		const el = elements[i];
		
		const { ID }: any = el.match?.groups;
		
		if (!el?.parent) {
			continue;
		}

		IDs.push(ID);
		elm = el.parent;
	}
	
	mountIssue(Plugin, elm as HTMLInputElement, IDs);
}
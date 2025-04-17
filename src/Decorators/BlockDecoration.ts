import { syntaxTree } from '@codemirror/language';
import {
    Range,
    RangeSetBuilder
} from '@codemirror/state';
import {
    Decoration,
    DecorationSet,
    EditorView,
    PluginValue,
    ViewUpdate,
    WidgetType,
} from '@codemirror/view';
import LinearPlugin from 'main';
import { isOnlyStringOnLine } from 'Utils/docLines';
import * as React from "react";
import * as ReactDOM from 'react-dom/client';
import Inline from 'Components/Inline';
import Card from 'Components/Card';

class StartWidget extends WidgetType {
    constructor(
        readonly issue: string,
        readonly inline: Boolean,
        readonly plugin: LinearPlugin
    ) {
        super();
    }
  
    toDOM(): HTMLElement {
        const elementId = `linear-container-${this.issue}`;

        if (document.getElementById(elementId)) {
            return document.getElementById(elementId) as HTMLElement;
        }

        let wrap = document.createElement("div")
        wrap.id = elementId;
        wrap.dataset.linearInline = this.inline.toString();
        wrap.className = "cm-linear";
        wrap.innerText = this.issue;

        const Component = this.inline ? Inline : Card;

        const reactElement = React.createElement(Component, {
            plugin: this.plugin,
            identifier: this.issue,
        });

        const dom = ReactDOM.createRoot(wrap);
        dom.render(reactElement);
        return wrap;
    }
  
    ignoreEvent() { return false }
}

export default class BlockDecoration implements PluginValue {
    public decorations: DecorationSet;
    public static Plugin: LinearPlugin;

    constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view);
    }

	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged) {
			this.decorations = this.buildDecorations(update.view);
		}
	}

	destroy() {}

	buildDecorations(view: EditorView): DecorationSet {
        const widgets: Range<Decoration>[] = [];

		for (const { from, to } of view.visibleRanges) {
			syntaxTree(view.state).iterate({
				from,
				to,
				enter(node) {
                    const text = view.state.sliceDoc(node.from, node.to);

                    if (text !== '[') {
                        return;
                    }

                    let startingPos = node.from;

                    // @ts-expect-error
                    node.next();

                    const issue = view.state.sliceDoc(node.from, node.to);

                    if (!/[A-Za-z]{1,7}-[0-9]{1,7}/.test(issue)) {
                        // @ts-expect-error
                        node.prev();
                        return;
                    }
                    
                    // @ts-expect-error
                    node.next();
                    const ender = view.state.sliceDoc(node.from, node.to);
                    if (ender === ']') {
                        const inline = !isOnlyStringOnLine(view, node.from, issue);
                        let deco = Decoration.widget({
                            widget: new StartWidget(
                                issue,
                                inline,
                                BlockDecoration.Plugin,
                            ),
                            side: 1
                        });

                        widgets.push(deco.range(startingPos));
                    }
                },
			});
		}

		return Decoration.set(widgets);
	}
}
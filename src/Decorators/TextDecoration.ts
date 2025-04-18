import { syntaxTree } from '@codemirror/language';
import { RangeSetBuilder } from '@codemirror/state';
import {
    Decoration,
    DecorationSet,
    EditorView,
    PluginValue,
    ViewUpdate,
} from '@codemirror/view';

export default class TextDecoration implements PluginValue {
	decorations: DecorationSet;

	constructor(view: EditorView) {
		this.decorations = this.buildDecorations(view);
	}

	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged) {
			this.decorations = this.buildDecorations(update.view);
		}
	}

	destroy() { }

	buildDecorations(view: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();
		const ranges: { from: number, to: number }[] = [];

		for (const { from, to } of view.visibleRanges) {
			syntaxTree(view.state).iterate({
				from,
				to,
				enter(node) {
					const text = view.state.sliceDoc(node.from, node.to);

                    if (text !== '[') {
                        return;
                    }

                    const eol = view.state.sliceDoc(node.from, node.to + 1);

					// Fix issue where last character triggers next() infinite loop
                    // where `[` is the last chacter of a line.
                    if (eol.trimEnd() === '[') {
                        return;
                    }

                    let startingPos = node.from;

                    // @ts-expect-error
                    node.next();

                    const issue = view.state.sliceDoc(node.from - 1, node.to + 1);

                    if (!/\[[A-Za-z]{1,7}-[0-9]{1,7}\]/.test(issue)) {
						// @ts-expect-error
						node.prev();
                        return;
                    }

					ranges.push({ from: startingPos, to: node.to + 1 });
				},
			});
		}

		// Add sorted ranges to the builder
		for (const range of ranges) {
			builder.add(
				range.from,
				range.to,
				Decoration.mark({
					class: "linear-code-element",
					tagName: "span",
				})
			);
		}

		return builder.finish();
	}
}

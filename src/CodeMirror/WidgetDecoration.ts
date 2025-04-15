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


class StartWidget extends WidgetType {
    constructor(readonly issue: string) { super() }
  
    toDOM() {
        let wrap = document.createElement("span")
        wrap.id = "linear-container-AMP-39";
        wrap.className = "cm-linear";
        wrap.innerText = this.issue;
        return wrap;
    }
  
    ignoreEvent() { return false }
}

export default class implements PluginValue {
    public decorations: DecorationSet;

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
        const widgets: Range<Decoration>[] = [];
        const ranges: { from: number, to: number, isDelimiter: boolean }[] = [];

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
                        let deco = Decoration.widget({
                          widget: new StartWidget(issue),
                          side: 1
                        })

                        widgets.push(deco.range(startingPos));
                    }
                    
                    // @ts-expect-error
                    node.prev();
                    // @ts-expect-error
                    node.prev();
                },
			});
		}

		return Decoration.set(widgets);
	}
}
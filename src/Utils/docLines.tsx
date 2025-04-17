import { EditorView } from '@codemirror/view';

export const isOnlyStringOnLine = (view: EditorView, pos: number, search: string): Boolean => {
    const currentLine = view.state.doc.lineAt(pos).text.trimStart();
    return (new RegExp(String.raw`^\[${search}\]$`)).test(currentLine);
};

export default {
    isOnlyStringOnLine,
};
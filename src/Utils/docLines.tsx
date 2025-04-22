import { EditorView } from '@codemirror/view';

/**
 * Check whether the given string is the only item on the current line.
 * 
 * @param {EditorView} view - Instance of the Obsidian EditorView class.
 * @param {number} pos - The start position of the current item.
 * @param {string} search - The string to search by - issue identifier.
 * @returns {Boolean}
 */
export const isOnlyStringOnLine = (view: EditorView, pos: number, search: string): Boolean => {
    const currentLine = view.state.doc.lineAt(pos).text.trimStart();
    return (new RegExp(String.raw`^\[${search}\]$`)).test(currentLine);
};

export default {
    isOnlyStringOnLine,
};
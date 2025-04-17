export type FoundElement = {
    match: RegExpMatchArray | null;
    element: Node|null;
    parent: Node|null;
}[];

export default (baseElement:HTMLElement|Node|null, pattern:RegExp): FoundElement => {
    let foundElement: FoundElement = [];

    if (!baseElement?.textContent || typeof baseElement?.textContent !== 'string') {
        return foundElement;
    }

    if (!pattern.test(baseElement?.textContent)) {
        return foundElement;
    }

    if (!baseElement.hasChildNodes()) {
        return foundElement;
    }

    const treeWalker = document.createTreeWalker(baseElement, NodeFilter.SHOW_TEXT);

    while(treeWalker.nextNode()) {
        if (typeof treeWalker?.currentNode?.textContent === 'string' && pattern.test(treeWalker.currentNode.textContent)) {
            foundElement.push({
                match: treeWalker.currentNode.textContent.match(pattern),
                element: treeWalker.currentNode,
                parent: treeWalker.currentNode.parentElement
            });
        }
    }

    return foundElement;
}

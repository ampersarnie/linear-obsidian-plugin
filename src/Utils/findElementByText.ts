export type FoundElement = {
    match: RegExpMatchArray | null;
    element: Node|null;
}

export default (baseElement:HTMLElement|Node|null, pattern:RegExp): FoundElement => {
    let foundElement: FoundElement = {
        match: null,
        element: null
    };

    if (!baseElement?.textContent || typeof baseElement?.textContent !== 'string') {
        return foundElement;
    }

    if (!pattern.test(baseElement?.textContent)) {
        return foundElement;
    }

    if (!baseElement.hasChildNodes()) {
        return foundElement;
    }

    const treeWalker = document.createTreeWalker(baseElement, NodeFilter.SHOW_ALL);

    while(treeWalker.nextNode()) {
        if (treeWalker.currentNode.nodeType !== Node.TEXT_NODE) {
            continue;
        }

        if (typeof treeWalker?.currentNode?.textContent === 'string' && pattern.test(treeWalker.currentNode.textContent)) {
            foundElement = {
                match: treeWalker.currentNode.textContent.match(pattern),
                element: treeWalker.currentNode,
            };
            break;
        }
    }

    return foundElement;
}

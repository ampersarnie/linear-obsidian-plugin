/**
 * Waits for a DOM node to be available before executing the passed
 * callback so you can ensure that a node is available before doing
 * further logic.
 * @param {string} query The DOM query string to be used by querySelector
 * @param {fn} callback The function to call when node is available.
 * @param {bool} disconnect Whether to disconnect the observer when conditions match.
 */
const waitFor = (query: string, callback: (element: Element) => void, disconnect = true) => {
	const initialNode = document.querySelector(query);

	/**
	 * If the node already exists, we don't need to
	 * wait, so execute the callback straight away.
	 */
	if (initialNode) {
		return callback(initialNode);
	}

	const observer = new MutationObserver(() => {
		const node = document.querySelector(query);

		if (node && disconnect) {
			observer.disconnect();
		}

		if (node) {
			return callback(node);
		}
	});

	observer.observe(document.body, {
		attributes: true,
		childList: true,
		subtree: true,
		characterData: false,
	});
};

export default waitFor;
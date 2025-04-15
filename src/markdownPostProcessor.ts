import * as React from "react";
import * as ReactDOM from 'react-dom/client';
import Card from "Components/Card";
import Inline from "Components/Inline";

import findElementByText from "Utils/findElementByText";
import LinearPlugin from "main";

export default (Plugin:LinearPlugin) => async (element: HTMLElement | Node | null, context: any) => {
    const foundElement = findElementByText(element, /(?<full>\[(?<ID>[A-Za-z]{1,7}-[0-9]{1,6})\])/);
    const { element: el } = foundElement;

    if (!el || !foundElement.match?.groups) {
      return;
    }

    const { ID, full } = foundElement.match?.groups;

    const mountIssue = (issue: any) => {
      let Component = Card;

      const isInlineTag = !['P'].includes(el.parentElement?.tagName || '');

      if (isInlineTag) {
        Component = Inline;
      }

      const reactElement = React.createElement(Component, {
        plugin: Plugin,
        issue: issue,
        cache: Plugin.Cache,
        onClick: (event: object) => {
          window.open(issue.url);
        }
      });

      let container = document.getElementById(`linear-container-${issue.identifier}`)!;

      if (!container) {
        if (isInlineTag) {
          // @ts-expect-error
          const html = el.parentElement?.getHTML().replace(full, `<span id="linear-container-${issue.identifier}">${full}</span>`)!;
          // @ts-expect-error
          el.parentElement?.setHTMLUnsafe(html);
          container = document.getElementById(`linear-container-${issue.identifier}`)!;
        } else {
          container = document.createElement('div')!;
          container.id = `linear-container-${issue.identifier}`;
          el.parentElement?.replaceWith(container);
        }

        console.log(container);

        Plugin.DOMRootNodes[issue.id] = ReactDOM.createRoot(container);
      }

      Plugin.DOMRootNodes[issue.id].render(reactElement);
    }

    if (!Plugin.Cache.exists(ID)) {
      Plugin.Cache.whenAvailable(ID, mountIssue);
      return;
    }

    let issue = Plugin.Cache.get(ID);
    mountIssue(issue);
}
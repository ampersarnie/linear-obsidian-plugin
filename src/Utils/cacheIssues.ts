import LinearAPI from "Linear/LinearAPI";

/**
 * Get the current workspace and query all the issues found in the document.
 * 
 * @param {any} app - Instance of Obsidian.
 * @param {LinearAPI} Linear - Instance of the Linear API class.
 * @returns {void}
 */
const cacheIssues = async (
    app: any,
    Linear: LinearAPI
) => {
    const { data = null } = app.workspace?.activeEditor || {};
    
    if (!data) {
        return;
    }

    const issueList: string[] = [];
    const matchedIssues = data.matchAll(/\[(?<ident>[A-Za-z]{1,7}-[0-9]{1,7})\]/gm);
    const docIssues: { groups: { ident: string} }[] = Array.from(matchedIssues);

    for(let i in docIssues) {
        let { ident } = docIssues[i]?.groups;

        issueList.push(ident);
    }

    await Linear.issuesFromIdentifiers(issueList);
};

export default cacheIssues;
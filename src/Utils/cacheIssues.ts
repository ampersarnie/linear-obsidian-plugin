import IssueCache from "IssueCache";
import LinearAPI from "LinearAPI";
import { IssueNode } from "../../types";

export default async (
    app: any,
    Cache: IssueCache,
    Linear: LinearAPI,
    rehydrate = false
) => {
    const { data = null } = app.workspace?.activeEditor || {};

    console.log(app)
    
    if (!data) {
        return;
    }

    const issueList: string[] = [];
    const matchedIssues = data.matchAll(/\[(?<ident>[A-Za-z]{1,7}-[0-9]{1,7})\]/gm);
    const docIssues: { groups: { ident: string} }[] = Array.from(matchedIssues);

    for(let i in docIssues) {
        let { ident } = docIssues[i]?.groups;

        if (Cache.exists(ident) && !rehydrate) {
            continue;
        }

        issueList.push(ident);
    }
    
    if (issueList.length <= 0) {
        return;
    }

    const response = await Linear.issuesFromIdentifiers(issueList);

    response?.data.issues.nodes.forEach((node: IssueNode) => {
        Cache.add(node?.identifier, node);
    });
};

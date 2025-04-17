import { LinearClient, type LinearRawResponse } from "@linear/sdk";
import IssueCache from "./IssueCache";
interface IssueInterface {
    [key: string]: any;
}

type IssueList = {
    teams: string[];
    numbers: number[];
}

export type IdentifierRegexGroup = {
    team: string;
    number: string;
}

export type IdentifierRegexMatch = RegExpMatchArray & {
    groups: IdentifierRegexGroup;
}

export default class LinearAPI {
    protected linear: LinearClient;
    protected cache: IssueCache;

    protected nodeList = `
        id,
        identifier,
        title,
        url,
        assignee {
            name,
            displayName,
            avatarUrl,
        },
        state {
            color,
            name,
            type
        }
    `

    protected REGEX_IDENTIFIER = /(?<team>[A-Za-z]{1,7})-(?<number>[0-9]{1,7})/;

    constructor(accessToken: string) {
        this.linear = new LinearClient({ accessToken: accessToken })
        this.cache = new IssueCache();
    }

    createTeamAndNumberList(identifiers: string[]): IssueList {
        const issueList: IssueList = {
            teams: [],
            numbers: [],
        };

        for(let i in identifiers) {
            const issue = identifiers[i].match(this.REGEX_IDENTIFIER) as IdentifierRegexMatch;
            const { team, number }: IdentifierRegexGroup = issue?.groups;

            issueList.teams.push(team);
            issueList.numbers.push(parseInt(number));
        }

        return issueList;
    }

    async issuesFromIdentifiers(identifiers: string[]) {
        const issues: IssueInterface = {};
        const retrieve = [];

        for(let i in identifiers) {
            const identifier = identifiers[i];

            console.log()

            if (!await this.cache.exists(identifier)) {
                retrieve.push(identifier);
                continue;
            };

            const issue = this.cache.get(identifier);
            issues[identifier] = issue;
        }

        if (retrieve.length <= 0) {
            return issues;
        }

        const { teams, numbers } = this.createTeamAndNumberList(retrieve);

        const response: LinearRawResponse<any> = await this.linear.client.rawRequest(`
            query issues($filter: IssueFilter) {
                issues(filter: $filter) {
                    nodes { ${this.nodeList} },
                }
            }
            `,
            {
                filter: {
                    team: {
                        key: {
                            in: teams
                        }
                    },
                    number: {
                        in: numbers,
                    }
                }
            },
        );

        const nodes = response?.data?.issues?.nodes;

        if (!nodes) {
            return issues;
        }

        for(const i in nodes) {
            const node = nodes[i];
            this.cache.add(node.identifier, node);
            issues[node.identifier] = node;
        }

        return issues;
    }
}
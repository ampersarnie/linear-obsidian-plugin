import Cache from "./Cache";
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
    protected cache: Cache;
    protected apiKey: string;

    protected nodeList = `
        id,
        identifier,
        title,
        url,
        labels {
            nodes {
                name,
                color
            }
        },
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

    constructor(apiKey:string = '') {
        this.apiKey = apiKey;
        this.cache = new Cache();
    }

    setApiKey(apiKey: string): void {
        this.apiKey = apiKey;
    }

    async fetch(query:string, variables: object) {
        if (!this.apiKey) {
            return Promise.reject(new Error('API Key has not been set.'))
        }

        const response = await fetch(
            'https://api.linear.app/graphql',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.apiKey,
                },
                method: 'POST',
                body: JSON.stringify({
                    query: query,
                    variables: variables,
                }),
            }
        );

        return await response.json();
    }

    getCurrentUser() {
        return this.fetch(
            `
            query {
                viewer {
                    id
                    name
                    displayName
                    avatarUrl
                    email
                }
            }
            `,
            {}
        );
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

        issueList.teams = [...new Set(issueList.teams)];
        issueList.numbers = [...new Set(issueList.numbers)];

        return issueList;
    }

    async rehydrateIssues() {
        const issues = await this.cache.expired();
        const identifiers = issues.map(issue => issue.identifier);
        this.issuesFromIdentifiers(identifiers);
    }

    async issuesFromIdentifiers(identifiers: string[], forceCache = false) {
        const issues: IssueInterface = {};
        const retrieve = [];

        for(let i in identifiers) {
            const identifier = identifiers[i];

            if (!await this.cache.exists(identifier, forceCache)) {
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

        const response = await this.fetch(`
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
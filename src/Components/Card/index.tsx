import React, { MouseEventHandler, useEffect, useState } from "react";
import LinearPlugin from "main";
import Title from "../Title";
import Id from "../Id";
import Status from "../Status";
import Assignee from "../Assignee";
import { IssueSchema } from "../../../types";

import "../../styles/card.scss";
import { useInterval } from "usehooks-ts";
import { S_IN_MS } from "Utils/constants";

type Props = {
    plugin: LinearPlugin;
    identifier: string;
}

export default ({plugin, identifier}: Props) => {
    const [issue, setIssue] = useState<IssueSchema|null>(null);

    useEffect(() => {
        plugin.Linear.issuesFromIdentifiers([identifier], true).then(async (issues) => {
            setIssue(await issues[identifier]);
        });
    }, []);

    useInterval(() => {
        plugin.Linear.issuesFromIdentifiers([identifier], true).then(async (issues) => {
            setIssue(await issues[identifier]);
        });
    }, 5 * S_IN_MS);

    if (!issue) {
        return (<span>Loading</span>);
    }

    return (
        <div className="linear-plugin--card" data-issue-state={issue.state.type} onClick={() => window.open(issue.url)}>
            <Status name={issue.state.name} color={issue.state.color} className="grid-item" />
            <Id className="grid-item">{issue?.identifier}</Id>
            <Title className="grid-item">{issue?.title}</Title>
            <Assignee className="grid-item" name={issue.assignee?.name} avatarUrl={issue.assignee?.avatarUrl} />
        </div>
    );
}

function setState(arg0: null): [any, any] {
    throw new Error("Function not implemented.");
}

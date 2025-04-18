import React, { useEffect, useState } from "react";
import LinearPlugin from "main";
import Title from "../Title";
import Id from "../Id";
import Status from "../Status";

import "../../styles/inline.scss";
import { IssueSchema } from "../../../types";

type Props = {
    plugin: LinearPlugin;
    identifier: string;
}

export default ({plugin, identifier}: Props) => {
    const [issue, setIssue] = useState<IssueSchema|null>(null);

    useEffect(() => {
        plugin.Linear.issuesFromIdentifiers([identifier]).then(async (issues) => {
            setIssue(await issues[identifier]);
        });
    }, []);

    if (!issue) {
        return (<span>Loading</span>);
    }

    return (
        <div className="linear-plugin--inline" data-issue-state={issue.state.type}>
            <Id className="grid-item">{issue?.identifier}</Id>
            <Title className="grid-item">{issue?.title}</Title>
            <Status name={issue.state.name} color={issue.state.color} className="grid-item" />
        </div>
    );
}
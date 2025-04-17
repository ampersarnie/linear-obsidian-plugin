import React, { MouseEventHandler, useEffect, useState } from "react";
import LinearPlugin from "main";
import Title from "../Title";
import Id from "../Id";
import Status from "../Status";
import Assignee from "../Assignee";

import "../../styles/card.scss";

type Props = {
    plugin: LinearPlugin;
    identifier: string;
}

export default ({plugin, identifier}: Props) => {
    const [issue, setIssue] = useState(null);

    useEffect(() => {
        plugin.Linear.issuesFromIdentifiers([identifier]).then(async (issues) => {
            setIssue(await issues[identifier]);
        });
    }, []);

    if (!issue) {
        return (<span>Loading</span>);
    }

    return (
        <div className="linear-plugin--card" data-issue-state={issue.state.type}>
            <Status name={issue.state.name} color={issue.state.color} className="grid-item" />
            <Id className="grid-item">{issue?.identifier}</Id>
            <Title className="grid-item">{issue?.title}</Title>
            <Assignee className="grid-item" name={issue.assignee.name} avatarUrl={issue.assignee.avatarUrl} />
        </div>
    );
}

function setState(arg0: null): [any, any] {
    throw new Error("Function not implemented.");
}

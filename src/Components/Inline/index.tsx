import React, { useEffect, useState } from "react";
import LinearPlugin from "main";
import Title from "../Title";
import Id from "../Id";
import Status from "../Status";
import Error from "../Error";
import { IssueSchema } from "../../../types";

import "../../styles/inline.scss";
import { useInterval, useTimeout } from "usehooks-ts";
import { INTERVAL, S_IN_MS } from "Utils/constants";

type Props = {
    plugin: LinearPlugin;
    identifier: string;
}

export default ({plugin, identifier}: Props) => {
    const [issue, setIssue] = useState<IssueSchema|null>(null);
    const [timeout, setTimeout] = useState(false);

    const getIssue = () => {
        plugin.Linear.issuesFromIdentifiers([identifier], true).then(async (issues) => {
            setIssue(await issues[identifier]);
            setTimeout(false);
        });
    }

    useEffect(getIssue, []);

    useInterval(getIssue, INTERVAL * S_IN_MS);

    useTimeout(() => {
        if (!issue) {
            setTimeout(true);
        }
    }, 1 * S_IN_MS);

    if (timeout) {
        return (<Error content="Timeout" />);
    }

    if (!issue) {
        return (<span>Loading</span>);
    }
    

    return (
        <div className="linear-plugin--inline" data-issue-state={issue?.state?.type} onClick={() => window.open(issue.url)}>
            <Id className="grid-item">{issue?.identifier}</Id>
            <Title className="grid-item">{issue?.title}</Title>
            <Status {...issue?.state} className="grid-item" />
        </div>
    );
}
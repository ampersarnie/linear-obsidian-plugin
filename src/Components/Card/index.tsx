import React, { MouseEventHandler } from "react";
import LinearPlugin from "main";
import Title from "../Title";
import Id from "../Id";
import Status from "../Status";
import Assignee from "../Assignee";

import "../../styles/card.scss";
import IssueCache from "IssueCache";
import { CommonProps, IssueNode } from "../../../types";

type Props = CommonProps & {
    plugin: LinearPlugin;
    issue: IssueNode;
    content?: string|null;
    cache?: IssueCache;
    onClick?: MouseEventHandler;
}

export default ({plugin, issue, cache, onClick}: Props) => {
    return (
        <div className="linear-plugin--card" data-issue-state={issue.state.type} onClick={onClick}>
            <Status name={issue.state.name} color={issue.state.color} className="grid-item" />
            <Id className="grid-item">{issue?.identifier}</Id>
            <Title className="grid-item">{issue?.title}</Title>
            <Assignee className="grid-item" name={issue.assignee.name} avatarUrl={issue.assignee.avatarUrl} />
        </div>
    );
}
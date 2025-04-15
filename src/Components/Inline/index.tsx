import React, { MouseEventHandler } from "react";
import LinearPlugin from "main";
import Title from "../Title";
import Id from "../Id";
import Status from "../Status";
import Assignee from "../Assignee";

import "../../styles/inline.scss";
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
        <div className="linear-plugin--inline" data-issue-state={issue.state.type} onClick={onClick}>
            <Id className="grid-item">{issue?.identifier}</Id>
            <Title className="grid-item">{issue?.title}</Title>
            <Status name={issue.state.name} color={issue.state.color} className="grid-item" />
        </div>
    );
}
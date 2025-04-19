import React from "react";

import "../styles/error.scss";

type Props = {
    content: string;
}

export default ({ content }: Props) => {
    return (
        <div className="linear-plugin--error">
            {content}: There was a problem getting the issue.
        </div>
    )
}
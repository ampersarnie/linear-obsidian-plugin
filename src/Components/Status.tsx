import React from "react";
import { CommonProps } from "../../types";

type Props = CommonProps & {
    name: string;
    color: string;
};

export default ({name, color, className}: Props) => {
    const classList = `linear-plugin--issue__status ${className}`;

    const styleProperties = {"--status-background-color": color} as React.CSSProperties;

    return (
        <div style={styleProperties} className={classList}>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="18" height="18">
                <circle cx="9" cy="12" r="6" fill="white" className="status-pill" />
            </svg>
            <span className="status-text">{name}</span>
        </div>
    );
}
import React from "react";
import { CommonProps } from "../../types";

export default ({children, className}: CommonProps) => {
    const classList = `linear-plugin--issue__title ${className}`;
    
    return (
        <div className={classList}>{children}</div>
    );
}
import React from "react";
import { CommonProps } from "../../types";

type Props = CommonProps & {
    name: string;
    color: string;
};

export default ({name, color, className = ''}: Props) => {
    const classList = `linear-plugin--issue__label ${className}`;

    const styles = {
        '--linear-label-color': color,
    } as React.CSSProperties;
    
    return (
        <span style={styles} data-label-name={name} data-label-color={color} className={classList}>{name}</span>
    );
}
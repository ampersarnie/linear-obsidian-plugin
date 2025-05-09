import React from "react";
import Label from './Label';
import { CommonProps, Labels } from "../../types";

type Props = CommonProps & {
    labels: Labels[];
};

export default ({labels, className = ''}: Props) => {
    const classList = `linear-plugin--issue__labels ${className}`;

    if (!Array.isArray(labels) || labels.length <= 0) {
        return;
    }
    
    return (
        <div className={classList}>
            {labels.map((label) => <Label name={label.name} color={label.color} />)}
        </div>
    );
}
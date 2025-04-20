import classNames from "classnames";
import React from "react";

type Props = {
    name: string;
    description?: string;
    isHeading?: boolean;
    children?: any;
}

export default ({ name, description, isHeading = false, children }: Props) => {
    const itemClasses = classNames({
        'setting-item': true,
        'setting-item-heading': isHeading
    });

    return (
        <div className={itemClasses}>
            <div className="setting-item-info">
                <div className="setting-item-name">{name}</div>
                <div className="setting-item-description">{description ?? '' }</div>
            </div>
            <div className="setting-item-control">
                {children}
            </div>
        </div>
    );
}
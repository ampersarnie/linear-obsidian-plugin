import classNames from "classnames";
import React from "react";

type Props = {
    name: string;
    description?: string;
    isHeading?: boolean;
    children?: any;
    isToggle?: boolean;
}

export default ({ name, description, isHeading = false, isToggle = false, children }: Props) => {
    const items = Array.isArray(children) ? children : [children];
    const hasToggle = Boolean(items.find(item => item?.type?.name === 'Toggle'));

    const itemClasses = classNames({
        'setting-item': true,
        'mod-toggle': isToggle || hasToggle,
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
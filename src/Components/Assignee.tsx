import React from 'react';
import { CommonProps } from '../../types';

type Props = CommonProps & {
    name: string;
    displayName?: string;
    avatarUrl: string;
}

export default ({ name, displayName, avatarUrl, className = '' }: Props) => {
    const classList = `linear-plugin--issue__assignee ${className}`;

    const assigneeName = name ?? 'Unassigned';
    const urlFill = `url(#${btoa(name)})`;

    return (
        <div className={classList}>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="20">
                {avatarUrl ? (
                    <defs>
                        <pattern id={btoa(name)} patternUnits="userSpaceOnUse" width="20" height="20">
                            <image href={avatarUrl} x="0" y="0" width="20" height="20" />
                        </pattern>
                    </defs>
                ): ''}
                <circle cx="10" cy="10" r="10" fill={urlFill} className="status-pill" />
            </svg>
            <div className="assignee-text">{assigneeName}</div>
        </div>
    );
}
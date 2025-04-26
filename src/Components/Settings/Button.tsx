import classNames from "classnames";
import React, { MouseEventHandler } from "react"

type Props = {
    onClick: MouseEventHandler;
    children: any
    isWarning?: boolean;
    isCTA?: boolean;
}

const Button = ({ onClick: onClickHandler, isWarning = false, isCTA = false, children}: Props) => {
    const classes = classNames({
        'mod-warning': isWarning,
        'mod-cta': isCTA
    });

    return (
        <>
            <button
                className={classes}
                onClick={onClickHandler}
            >
                {children}
            </button>
        </>
    );
}

export default Button;
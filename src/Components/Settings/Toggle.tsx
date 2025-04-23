import classNames from "classnames";
import React, { ChangeEventHandler } from "react"

type Props = {
    checked: boolean;
    onChange: ChangeEventHandler;
}

const Toggle = ({ checked, onChange: onChangeHandler}: Props) => {
    const classes = classNames({
        'checkbox-container': true,
        'is-enabled': checked
    });

    return (
        <div className={classes}>
            <input type="checkbox" tabIndex={0} onChange={onChangeHandler} checked={checked} />
        </div>
    );
}

export default Toggle;
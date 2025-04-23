import React, { ReactNode } from "react";
import Active from "./Active";
import Inactive from "./Inactive";

type Props = {
    hasKey?: boolean;
    apiKey?: string;
    children: ReactNode[];
}

const ApiKey = ({hasKey = false, apiKey = '', children}: Props) => {
    // @ts-expect-error
    const setChildren = children.map(child => child?.type?.name);

    if (!['Active', 'Inactive'].every(i => setChildren.includes(i))) {
        throw new Error(`Expected ApiKey.Active and ApiKey.Inactive as children.`);
    }

    let Component;

    if (hasKey || apiKey.length > 0) {
        Component = children.filter(child => child?.type?.name === 'Active')[0];
    } else {
        Component = children.filter(child => child?.type?.name === 'Inactive')[0];
    }
    
    return Component;
}

ApiKey.Active = Active;
ApiKey.Inactive = Inactive;

export default ApiKey;
import React, { ReactNode } from "react";

type Props = {
    children: ReactNode[];
}

const Active = ({children}: Props) => {
    return children;
}

export default Active;
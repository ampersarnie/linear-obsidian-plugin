import React, { ReactNode } from "react";

type Props = {
    children: ReactNode[];
}

const Inactive = ({children}: Props) => {
    return children;
}

export default Inactive;
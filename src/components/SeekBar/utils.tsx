import React from "react";
import { btnRadius, dialRadius } from "./consts";

export const polarToCartesian = React.useCallback(
    (angle) => {
        let r = dialRadius;
        let hC = dialRadius + btnRadius;
        let a = ((angle - 90) * Math.PI) / 180.0;

        let x = hC + r * Math.cos(a);
        let y = hC + r * Math.sin(a);
        return { x, y };
    },
    [dialRadius, btnRadius]
);
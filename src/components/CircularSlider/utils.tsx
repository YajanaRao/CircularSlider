import React from "react";
import { thumbRadius, progressBarRadius } from "./consts";

export const polarToCartesian = React.useCallback(
    (angle) => {
        let r = progressBarRadius;
        let hC = progressBarRadius + thumbRadius;
        let a = ((angle - 90) * Math.PI) / 180.0;

        let x = hC + r * Math.cos(a);
        let y = hC + r * Math.sin(a);
        return { x, y };
    },
    [progressBarRadius, thumbRadius]
);
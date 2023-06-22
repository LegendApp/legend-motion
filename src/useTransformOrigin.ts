/* eslint-disable react-hooks/rules-of-hooks */
import { isString } from '@legendapp/tools';
import { useEverHadValue } from '@legendapp/tools/react';
import { useCallback, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { TransformOrigin } from './Interfaces';

function computeOrigin(val: TransformOrigin, size: number) {
    const isStr = isString(val);
    const isPerc = isStr && (val as string).endsWith('%');
    // Chop off a % or px
    let num = isStr ? +(val as string).replace(/%|px/, '') : val;
    // Divide by 100 for percent or by view size if pixels
    const perc = isPerc ? +num / 100 : +num / size;
    // Offset by half of the size
    if (!isNaN(perc)) {
        num = (perc - 0.5) * size;
    } else {
        // Fallback to no origin
        num = 0;
    }

    return num;
}

export const useTransformOrigin = function useTransformOrigin(
    transformOrigin: { x?: TransformOrigin; y?: TransformOrigin },
    transform: any[],
    onLayoutProp: (e: LayoutChangeEvent) => void
) {
    let onLayout = onLayoutProp;
    let needsLayoutX = false;
    let needsLayoutY = false;

    // Compute whether x and y need layout based on input
    if (transformOrigin) {
        let { x, y } = transformOrigin;
        needsLayoutX = x !== undefined && x !== '50%';
        needsLayoutY = y !== undefined && y !== '50%';
    }

    // Compute whether we ever needed layout so we don't remove a hook if the origin is removed
    const everDidLayout = useEverHadValue(!!transformOrigin, true);

    if (everDidLayout) {
        const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
        onLayout = useCallback(
            (e: LayoutChangeEvent) => {
                setSize(e.nativeEvent.layout);
                onLayoutProp?.(e);
            },
            [onLayoutProp]
        );

        if (transformOrigin && transform) {
            let { x, y } = transformOrigin;

            // Compute x and y origins
            x = needsLayoutX ? computeOrigin(x, size.width) : 0;
            y = needsLayoutY ? computeOrigin(y, size.height) : 0;

            // First move the center of the view to the origin
            transform.splice(0, 0, {
                translateY: y,
            });
            transform.splice(0, 0, {
                translateX: x,
            });

            // Restore it back the the original position after transforming
            transform.push({
                translateX: -x,
            });
            transform.push({
                translateY: -y,
            });
        }
    }

    return onLayout;
};

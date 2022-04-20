import { createMotionAnimatedComponent } from './createMotionComponent';
import { isArray } from '@legendapp/tools';
import React, { Component } from 'react';
import type { ViewProps } from 'react-native';

export declare type LinearGradientPoint = {
    x: number;
    y: number;
};

export declare type LinearGradientProps = ViewProps & {
    colors: string[];
    locations?: number[] | null;
    start?: LinearGradientPoint | null;
    end?: LinearGradientPoint | null;
};

let LinearGradient;

function setLinearGradientComponent(linearGradient) {
    LinearGradient = linearGradient;
}

type PropsGradient = Omit<LinearGradientProps, 'colors'> & {
    numColors?: number;
    startX?: number;
    startY?: number;
    endX?: number;
    endY?: number;
};

class GradientHelper extends Component<PropsGradient> {
    render() {
        const { numColors, startX, startY, endX, endY, ...rest } = this.props;

        let start;
        if (startX || startY) {
            start = {
                x: startX,
                y: startY,
            };
        }
        let end;
        if (endX || endY) {
            end = {
                x: endX,
                y: endY,
            };
        }

        const colors: string[] = [];
        for (let i = 0; i < numColors; i++) {
            colors.push(rest['color' + i]);
            delete rest['color' + i];
        }

        return <LinearGradient colors={colors} start={start} end={end} {...rest} />;
    }
}

const AnimatedGradientHelper = createMotionAnimatedComponent(GradientHelper);

export class MotionLinearGradient extends Component<LinearGradientProps> {
    render() {
        const { colors, start, end, ...rest } = this.props;

        const props: PropsGradient = {};
        colors?.forEach((color, i) => (props['color' + i] = color));

        if (start) {
            props.startX = isArray(start) ? start[0] : (start as any).x;
            props.startY = isArray(start) ? start[1] : (start as any).y;
        }
        if (end) {
            props.endX = isArray(end) ? end[0] : (end as any).x;
            props.endY = isArray(end) ? end[1] : (end as any).y;
        }

        return <AnimatedGradientHelper numColors={colors?.length || 0} animateProps={props} {...rest} />;
    }
}

export { setLinearGradientComponent };

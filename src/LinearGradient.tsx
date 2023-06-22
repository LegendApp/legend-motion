import { isArray } from '@legendapp/tools';
import { MemoFnComponent } from '@legendapp/tools/react';
import React, { Component, ComponentClass } from 'react';
import type { ViewProps, ViewStyle } from 'react-native';
import { createMotionAnimatedComponent } from './createMotionComponent';
import type { MotionComponentProps } from './Interfaces';

export type LinearGradientPoint = {
    x: number;
    y: number;
};

export type LinearGradientProps = ViewProps & {
    colors?: string[];
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

        // Combine startX, startY, endX, endY back into start,end
        let start;
        if (startX !== undefined || startY !== undefined) {
            start = {
                x: startX,
                y: startY,
            };
        }
        let end;
        if (endX !== undefined || endY !== undefined) {
            end = {
                x: endX,
                y: endY,
            };
        }

        // Combine individual color props back into a colors array
        const colors: string[] = [];
        for (let i = 0; i < numColors; i++) {
            colors.push(rest['color' + i]);
            delete rest['color' + i];
        }

        return <LinearGradient colors={colors} start={start} end={end} {...rest} />;
    }
}

const AnimatedGradientHelper = createMotionAnimatedComponent(GradientHelper);

function pointToXY(props: PropsGradient, point: LinearGradientPoint, name: string) {
    if (point) {
        props[name + 'X'] = isArray(point) ? point[0] : point.x;
        props[name + 'Y'] = isArray(point) ? point[1] : point.y;
    }
}

// Create MotionLinearGradient with the same API as other Motion components, but it's more complicated because it needs to
// transform to a different set of props into the AnimatedGradientHelper.
const MotionLinearGradient = MemoFnComponent(function <
    TAnimate,
    TAnimateProps extends Partial<Omit<LinearGradientProps, 'locations' | 'style'>>
>(
    props: MotionComponentProps<
        ComponentClass<Omit<LinearGradientProps, 'locations'>>,
        ViewStyle,
        TAnimate,
        TAnimateProps,
        Omit<LinearGradientProps, 'locations' | 'style'>
    > &
        LinearGradientProps
) {
    const { colors, animateProps, start, end, initialProps, ...propsOut } = props;
    const { colors: colorsAnimate, start: startAnimate, end: endAnimate, ...animatePropsOut } = animateProps as LinearGradientProps;

    // Split colors array out into individual props so they can be animated
    colors?.forEach((color, i) => (propsOut['color' + i] = color));
    colorsAnimate?.forEach((color, i) => (animatePropsOut['color' + i] = color));

    // Split start/end objects out into individual props so they can be animated
    pointToXY(propsOut, start, 'start');
    pointToXY(propsOut, end, 'end');

    pointToXY(animatePropsOut, startAnimate, 'start');
    pointToXY(animatePropsOut, endAnimate, 'end');

    let numColors = colors?.length || colorsAnimate?.length || 0;

    // Split initialProps too if it exists
    const initialPropsOut: Partial<LinearGradientProps> = {};
    if (initialProps) {
        const { colors: colorsInitial, start: startInitial, end: endInitial } = animateProps as LinearGradientProps;
        colorsInitial?.forEach((color, i) => (initialPropsOut['color' + i] = color));
        pointToXY(initialPropsOut, startInitial, 'start');
        pointToXY(initialPropsOut, endInitial, 'end');

        if (colorsInitial) {
            numColors = colorsInitial.length;
        }
    }

    // @ts-ignore Ignore this because it won't conform to the customized props
    return <AnimatedGradientHelper numColors={numColors} {...propsOut} initialProps={initialPropsOut} animateProps={animatePropsOut} />;
});

export { setLinearGradientComponent, MotionLinearGradient };

import type { ComponentProps, ComponentType, JSXElementConstructor, ReactNode } from 'react';
import type { LayoutChangeEvent, StyleProp } from 'react-native';

export type ComponentStyle<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
    ComponentProps<T>['style'] extends StyleProp<infer P> ? P : ComponentProps<T>['style'];

export type EaseFunction =
    | 'linear'
    | 'easeIn'
    | 'easeOut'
    | 'easeInOut'
    | 'circIn'
    | 'circOut'
    | 'circInOut'
    | 'backIn'
    | 'backOut'
    | 'backInOut';

export interface MotionTransitionTween {
    type?: 'tween' | 'timing' | undefined;
    ease?: EaseFunction | ((value: number) => number) | undefined;
    easing?: EaseFunction | ((value: number) => number) | undefined;
    duration: number | undefined;
    delay?: number | undefined;
}
export interface MotionTransitionSpring {
    type: 'spring';
    friction?: number;
    tension?: number;
    speed?: number;
    bounciness?: number;
    stiffness?: number;
    damping?: number;
    mass?: number;
    overshootClamping?: boolean | undefined;
    restDisplacementThreshold?: number | undefined;
    restSpeedThreshold?: number | undefined;
    velocity?: number | { x: number; y: number } | undefined;
}

export type MotionTransition = MotionTransitionTween | MotionTransitionSpring;

export type MotionTransitionRecord<T> = {
    [key in keyof T]: MotionTransition;
};
export type TransformOrigin = `${number}%` | number | `${number}px`;

export interface MotionComponentProps<
    T extends ComponentType<any>,
    TStyle extends ComponentStyle<T>,
    TAnimate,
    TAnimateProps,
    TExtraProps = unknown
> {
    style?: ComponentProps<T>['style'];
    animate?: TAnimate | TStyle | PropsTransforms;
    animateProps?: TAnimateProps | (Omit<ComponentProps<T>, 'style'> & TExtraProps);
    initial?: TStyle | PropsTransforms;
    initialProps?: Omit<ComponentProps<T>, 'style'> & TExtraProps;
    transition?: MotionTransition | MotionTransitionRecord<TAnimate | (TAnimateProps & TExtraProps)>;
    children?: ReactNode;
    onLayout?: (event: LayoutChangeEvent) => void;
    transformOrigin?: { x?: TransformOrigin; y?: TransformOrigin };
    whileTap?: TAnimate | TStyle | PropsTransforms;
    whileHover?: TAnimate | TStyle | PropsTransforms;
}
export interface PropsTransforms {
    x?: number;
    y?: number;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    skewX?: number;
    skewY?: number;
    perspective?: number;
    rotate?: number;
    rotateY?: number;
    rotateZ?: number;
    matrix?: number[];
}
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export interface MotionConfig {
    timing: 'ms' | 's';
}

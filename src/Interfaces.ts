import type { ComponentProps, ComponentType, JSXElementConstructor, ReactNode } from 'react';
import type { LayoutChangeEvent, StyleProp } from 'react-native';

export type ComponentStyle<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
    ComponentProps<T>['style'] extends StyleProp<infer P> ? P : ComponentProps<T>['style'];

export interface TransitionTween {
    type: 'tween';
    easing?: ((value: number) => number) | undefined;
    duration?: number | undefined;
    delay?: number | undefined;
}
export interface TransitionSpring {
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

export type Transition = TransitionTween | TransitionSpring;

type TransitionRecord<T> = {
    [key in keyof T]: Transition;
};
export type TransformOrigin = `${number}%` | number | `${number}px`;

export interface MotionComponentProps<T extends ComponentType<any>, TStyle extends ComponentStyle<T>, TAnimate, TAnimateProps> {
    style?: ComponentProps<T>['style'];
    animate?: TAnimate | TStyle | PropsTransforms;
    animateProps?: TAnimateProps | ComponentProps<T>;
    initial?: TStyle | PropsTransforms;
    initialProps?: ComponentProps<T>;
    transition?: Transition | TransitionRecord<TAnimate | TAnimateProps>;
    children?: ReactNode;
    onLayout?: (event: LayoutChangeEvent) => void;
    transformOrigin?: { x?: TransformOrigin; y?: TransformOrigin };
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

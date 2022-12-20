import type {
    ComponentClass,
    ComponentProps,
    ComponentType,
    FunctionComponent,
    JSXElementConstructor,
    PropsWithChildren,
    ReactNode,
} from 'react';
import type { ImageStyle, LayoutChangeEvent, StyleProp, TextStyle, ViewStyle } from 'react-native';

export type ComponentStyle<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
    ComponentProps<T>['style'] extends StyleProp<infer P> ? P : ComponentProps<T>['style'];

export type StyledProps<P> = PropsWithChildren<
    P & {
        className?: string;
        inheritedClassName?: string;
        nthChild?: number;
        tw?: string;
        style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
    }
>;

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

interface Loopable {
  loop?: number;
}

export interface MotionTransitionTween extends Loopable {
    type?: 'tween' | 'timing' | undefined;
    ease?: EaseFunction | ((value: number) => number) | undefined;
    easing?: EaseFunction | ((value: number) => number) | undefined;
    duration: number | undefined;
    delay?: number | undefined;
}
export interface MotionTransitionSpring extends Loopable {
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
    transition?: MotionTransition | MotionTransitionRecord<TAnimate | (TAnimateProps & TExtraProps) | { default: '' }>;
    children?: ReactNode;
    onLayout?: (event: LayoutChangeEvent) => void;
    transformOrigin?: { x?: TransformOrigin; y?: TransformOrigin };
    whileTap?: TAnimate | TStyle | PropsTransforms;
    whileHover?: TAnimate | TStyle | PropsTransforms;
    exit?: TAnimate | TStyle | PropsTransforms;
    onAnimationComplete?: (key: string) => void;
}
export interface PropsTransforms {
    x?: number;
    y?: number;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    skewX?: `${number}deg` | `${number}rad`;
    skewY?: `${number}deg` | `${number}rad`;
    perspective?: number;
    rotate?: `${number}deg` | `${number}rad`;
    rotateX?: `${number}deg` | `${number}rad`;
    rotateY?: `${number}deg` | `${number}rad`;
    rotateZ?: `${number}deg` | `${number}rad`;
    matrix?: number[];
}
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
declare type Component<P> = string | FunctionComponent<P> | ComponentClass<P>;
export interface MotionConfig {
    timing?: 'ms' | 's';
    styled?: <P>(Component: Component<P>) => FunctionComponent<StyledProps<P>>;
}

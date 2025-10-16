import type { ForwardRefExoticComponent } from 'react';
import { Motion as BaseMotion } from './AnimatedComponents';

export type StyledProps = {
    className?: string;
};

type WithStyledProps<P> = P extends object ? P & StyledProps : P;

type WithClassName<T> = T extends ForwardRefExoticComponent<infer P>
    ? T & ForwardRefExoticComponent<WithStyledProps<P>>
    : T extends (props: infer P) => infer R
    ? T & ((props: WithStyledProps<P>) => R)
    : T;

type MotionWithClassName = {
    [K in keyof typeof BaseMotion]: WithClassName<(typeof BaseMotion)[K]>;
};

export const Motion = BaseMotion as MotionWithClassName;

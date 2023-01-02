import { isArray, isNumber, isString } from '@legendapp/tools';
import React, { ComponentPropsWithRef, ComponentType, forwardRef, ReactElement, Ref, useContext, useMemo, useRef } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, TransformsStyle } from 'react-native';
import { config } from './configureMotion';
import { DefaultTransitionTime } from './Constants';
import type {
    ComponentStyle,
    EaseFunction,
    MotionComponentProps,
    MotionTransition,
    MotionTransitionTween,
    PropsTransforms,
    UnionToIntersection,
} from './Interfaces';
import { ContextPressable } from './MotionPressable';
import { useTransformOrigin } from './useTransformOrigin';

interface AnimInfo {
    animValue: Animated.Value;
    value: any;
    valueInterp?: number;
    interpolation?: any;
}

const TransformKeys: Record<keyof PropsTransforms, keyof UnionToIntersection<TransformsStyle['transform'][number]>> = {
    x: 'translateX',
    y: 'translateY',
    scale: 'scale',
    scaleX: 'scaleX',
    scaleY: 'scaleY',
    skewX: 'skewX',
    skewY: 'skewY',
    perspective: 'perspective',
    rotate: 'rotate',
    rotateX: 'rotateX',
    rotateY: 'rotateY',
    rotateZ: 'rotateZ',
    matrix: 'matrix',
};

const OtherNativeKeys = {
    opacity: 'opacity',
} as const;

const DefaultValues: Record<keyof PropsTransforms | keyof typeof OtherNativeKeys, any> = {
    x: 0,
    y: 0,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    skewX: '0deg',
    skewY: '0deg',
    perspective: 0,
    rotate: '0deg',
    rotateX: '0deg',
    rotateY: '0deg',
    rotateZ: '0deg',
    matrix: [],
    opacity: 1,
};

const DefaultTransition: MotionTransition = { type: 'tween', duration: DefaultTransitionTime };
const Eases: Record<EaseFunction, (value: number) => number> = {
    linear: Easing.linear,
    easeIn: Easing.ease,
    easeInOut: Easing.inOut(Easing.ease),
    easeOut: Easing.out(Easing.ease),
    circIn: Easing.circle,
    circInOut: Easing.inOut(Easing.circle),
    circOut: Easing.out(Easing.circle),
    backIn: Easing.back(2),
    backInOut: Easing.inOut(Easing.back(2)),
    backOut: Easing.out(Easing.back(2)),
};

function addKeysToSet(...objs: Record<string, any>[]) {
    const set = new Set<string>();
    for (let i = 0; i < objs.length; i++) {
        const obj = objs[i];
        if (obj) {
            const keys = Object.keys(obj);
            for (let i = 0; i < keys.length; i++) {
                set.add(keys[i]);
            }
        }
    }
    return set;
}

export function createMotionComponent<T extends ComponentType<any>, TExtraProps = {}>(Component: Animated.AnimatedComponent<T> | T) {
    return forwardRef(function MotionComponent<TAnimate, TAnimateProps>(
        {
            animate,
            animateProps,
            initial,
            initialProps,
            exit,
            transition,
            transformOrigin,
            style: styleProp,
            onLayout: onLayoutProp,
            whileTap,
            whileHover,
            onAnimationComplete,
            ...rest
        }: Animated.AnimatedProps<ComponentPropsWithRef<T & TExtraProps>> &
            MotionComponentProps<T, ComponentStyle<T>, TAnimate, TAnimateProps>,
        // @ts-ignore
        ref: Ref<InstanceType<T>>
    ) {
        const refAnims = useRef<Partial<Record<string, AnimInfo>>>({});

        // Generate the arrays of keys and values for transitioning. These are used as deps of useMemo
        // so that it will update whenever a key or value changes.
        const animKeysSet = addKeysToSet(initial, animate, animateProps, whileTap, whileHover, exit);
        const values = Object.assign({}, animate);

        if (animateProps) {
            addKeysToSet(animKeysSet, animateProps);
            Object.assign(values, animateProps);
        }

        if (whileTap || whileHover) {
            const { pressed, hovered } = useContext(ContextPressable);

            if (whileHover) {
                addKeysToSet(animKeysSet, whileHover);
                if (hovered) {
                    Object.assign(values, whileHover);
                }
            }
            if (whileTap) {
                addKeysToSet(animKeysSet, whileTap);
                if (pressed) {
                    Object.assign(values, whileTap);
                }
            }
        }

        if (exit) {
            addKeysToSet(animKeysSet, exit);
        }

        const animKeys = [...animKeysSet];
        const animValues = animKeys.map((key) => values[key]);

        const update = () => {
            const anims = refAnims.current;

            const useNativeDriver = !animateProps && animKeys.every((key) => !!OtherNativeKeys[key] || !!TransformKeys[key]);

            for (let i = 0; i < animKeys.length; i++) {
                const key = animKeys[i];
                const isProp = animateProps?.[key] !== undefined;
                let value = values[key];
                const valueInitial = (isProp ? initialProps?.[key] : initial?.[key]) ?? value ?? DefaultValues[key];
                if (value === undefined) {
                    value = valueInitial ?? DefaultValues[key];
                }

                if (!anims[key] || anims[key].value !== value) {
                    const isStr = isString(valueInitial);
                    const isArr = isArray(valueInitial);

                    // If this is the first run or it's a new key, create the Animated.Value
                    if (!anims[key]) {
                        const startValue = isStr || isArr ? 1 : (valueInitial as number);
                        const animValue = new Animated.Value(startValue);
                        anims[key] = {
                            value: valueInitial,
                            animValue,
                            valueInterp: isStr ? 1 : undefined,
                        };
                    }

                    let toValue: number;
                    // If string or array it needs to interpolate, so toggle back and forth between 0 and 1,
                    // interpolating from current value to target value
                    if (isStr || isArr) {
                        const fromInterp = anims[key].valueInterp;
                        const from = anims[key].value;
                        anims[key].interpolation = anims[key].animValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: fromInterp === 1 ? [value, from] : [from, value],
                        });
                        anims[key].valueInterp = toValue = 1 - fromInterp;
                        anims[key].value = value;
                    } else {
                        anims[key].value = toValue = value as number;
                    }

                    // Get the transition for this key, the 'default' key, the root transition, or default transition if no transition prop
                    const transitionForKey: MotionTransition =
                        transition?.[key] || transition?.['default'] || transition || DefaultTransition;

                    if (
                        config.timing === 's' &&
                        transitionForKey !== DefaultTransition &&
                        isNumber((transitionForKey as MotionTransitionTween).duration)
                    ) {
                        (transitionForKey as MotionTransitionTween).duration *= 1000;
                    }

                    if (isString((transitionForKey as MotionTransitionTween).easing)) {
                        (transitionForKey as MotionTransitionTween).easing =
                            Eases[(transitionForKey as MotionTransitionTween).easing as unknown as EaseFunction];
                    }
                    if (isString((transitionForKey as MotionTransitionTween).ease)) {
                        (transitionForKey as MotionTransitionTween).ease =
                            Eases[(transitionForKey as MotionTransitionTween).ease as unknown as EaseFunction];
                    }

                    const animOptions = Object.assign(
                        {
                            toValue,
                            useNativeDriver,
                        },
                        transitionForKey
                    );

                    // This typeof check is to make it work when rendered server-side like in Next.js
                    if (typeof requestAnimationFrame !== 'undefined') {
                        requestAnimationFrame(() => {
                            const callback = onAnimationComplete ? () => onAnimationComplete(key) : undefined;
                            const { loop, type } = transitionForKey;

                            let animation: Animated.CompositeAnimation;

                            // Spring or timing based on the transition prop
                            if (type === 'spring') {
                                animation = Animated.spring(anims[key].animValue, animOptions);
                            } else {
                                animation = Animated.timing(anims[key].animValue, animOptions as Animated.TimingAnimationConfig);
                            }

                            // Loop based on the transition prop
                            if (loop !== undefined) {
                                animation = Animated.loop(animation, { iterations: loop });
                            }

                            animation.start(callback);
                        });
                    }
                }
            }
        };

        useMemo(update, animValues); // eslint-disable-line react-hooks/exhaustive-deps

        // Apply the animations to the style object
        const style: StyleProp<any> = {};
        const animProps = {};
        const transforms: { key: string; value: AnimInfo }[] = [];
        Object.entries(refAnims.current).forEach(([key, value]) => {
            if (animateProps?.[key] !== undefined) {
                animProps[key] = value.interpolation || value.animValue;
            } else if (TransformKeys[key]) {
                transforms.push({ key, value });
            } else {
                style[key] = value.interpolation || value.animValue;
            }
        });

        // Map the transforms into an Animated transforms array
        if (transforms.length) {
            style.transform = transforms.map(({ key, value }) => ({
                [TransformKeys[key]]: value.interpolation || value.animValue,
            }));
        }

        const onLayout = transformOrigin ? useTransformOrigin(transformOrigin, style.transform, onLayoutProp) : onLayoutProp;

        // @ts-ignore
        return <Component style={StyleSheet.compose(styleProp, style)} onLayout={onLayout} {...rest} {...animProps} ref={ref} />;
    }) as <TAnimate, TAnimateProps>(
        p: Animated.AnimatedProps<ComponentPropsWithRef<T>> &
            TExtraProps &
            MotionComponentProps<T, ComponentStyle<T>, TAnimate, TAnimateProps>,
        // @ts-ignore
        ref: Ref<InstanceType<T>>
    ) => ReactElement;
}
export function createMotionAnimatedComponent<T extends ComponentType<any>>(component: T) {
    return createMotionComponent(Animated.createAnimatedComponent(component));
}

import { isArray, isString, useMakeRef } from '@legendapp/tools';
import React, { ComponentType, useCallback, useMemo, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, TransformsStyle } from 'react-native';
import type { ComponentStyle, MotionComponentProps, PropsTransforms, MotionTransition, UnionToIntersection } from './Interfaces';
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
    rotateY: 'rotateY',
    rotateZ: 'rotateZ',
    matrix: 'matrix',
};

const DefaultTransition: MotionTransition = { type: 'tween', duration: 300 };

export function createMotionComponent<T extends ComponentType<any>>(Component: Animated.AnimatedComponent<T> | T) {
    return function MotionComponent<TAnimate, TAnimateProps>({
        animate: _animate,
        animateProps: _animateProps,
        initial,
        initialProps,
        transition: _transition,
        transformOrigin,
        style: styleProp,
        onLayout: onLayoutProp,
        ...rest
    }: Animated.AnimatedProps<React.ComponentPropsWithRef<T>> & MotionComponentProps<T, ComponentStyle<T>, TAnimate, TAnimateProps>) {
        const refAnims = useRef<Partial<Record<string, AnimInfo>>>({});
        const _animKeys = _animate ? (Object.keys(_animate) as string[]) : [];
        const _animValues = _animate ? (Object.values(_animate) as any[]) : [];
        const refState = useMakeRef({
            animKeys: _animKeys,
            animate: _animate,
            animateProps: _animateProps,
            transition: _transition,
        });

        if (_animateProps) {
            _animKeys.push(...Object.keys(_animateProps));
            _animValues.push(...Object.values(_animateProps));
        }

        const update = useCallback(() => {
            if (typeof __DEV__ !== 'undefined' && __DEV__) {
                var isNativeAnimation;
            }
            const anims = refAnims.current;
            const { animKeys, animate, animateProps, transition } = refState.current;
            const isTransitionOnRoot = transition && !!(transition as any).type;

            for (let i = 0; i < animKeys.length; i++) {
                const key = animKeys[i];
                const isProp = animateProps?.[key] !== undefined;
                const value = isProp ? animateProps[key] : animate?.[key];
                const valueInitial = (isProp ? initialProps?.[key] : initial?.[key]) ?? value;
                const isStr = isString(valueInitial);
                const isArr = isArray(valueInitial);
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
                // If string it needs to interpolate, so toggle back and forth between 0 and 1,
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

                const transitionForKey: MotionTransition =
                    (isTransitionOnRoot ? transition : transition?.[key || 'default']) || DefaultTransition;

                const useNativeDriver = !isProp && !!TransformKeys[key];
                if (typeof __DEV__ !== 'undefined' && __DEV__ && isNativeAnimation !== undefined && useNativeDriver !== isNativeAnimation) {
                    console.warn('Cannot mix native and non-native animations');
                    isNativeAnimation = useNativeDriver;
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
                        // Spring or timing based on the transition prop
                        if (transitionForKey.type === 'spring') {
                            Animated.spring(anims[key].animValue, animOptions).start();
                        } else {
                            Animated.timing(anims[key].animValue, animOptions).start();
                        }
                    });
                }
            }
        }, []); // eslint-disable-line react-hooks/exhaustive-deps

        useMemo(update, [_animKeys, _animValues]); // eslint-disable-line react-hooks/exhaustive-deps

        // Apply the animations
        const style: StyleProp<any> = {};
        const animProps = {};
        const transforms: { key: string; value: AnimInfo }[] = [];
        Object.entries(refAnims.current).forEach(([key, value]) => {
            if (_animateProps?.[key] !== undefined) {
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
                [TransformKeys[key]]: value.animValue,
            }));
        }

        const layoutProps: any = {};
        if (transformOrigin) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            layoutProps.onLayout = useTransformOrigin(transformOrigin, style.transform, onLayoutProp);
        }

        return <Component style={StyleSheet.compose(styleProp, style)} {...layoutProps} {...rest} {...animProps} />;
    };
}
export function createMotionAnimatedComponent<T extends ComponentType<any>>(component: T) {
    return createMotionComponent(Animated.createAnimatedComponent(component));
}

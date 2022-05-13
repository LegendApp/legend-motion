import { useMakeRef } from '@legendapp/tools';
import React, { ReactNode, useCallback, useRef } from 'react';
import { Platform, Pressable } from 'react-native';

interface Props {
    whileTap: any;
    whileHover: any;
    setAnimsFromPress: (a: any) => void;
    children: ReactNode;
}
export function MotionPressable({ whileTap, whileHover, setAnimsFromPress, children }: Props) {
    const refWhileTap = useMakeRef({ whileTap, whileHover });
    const refState = useRef({ pressed: false, hovered: false });

    const update = useCallback((pressed: boolean, hovered: boolean) => {
        if (pressed !== undefined) {
            refState.current.pressed = pressed;
        }
        if (hovered !== undefined) {
            refState.current.hovered = hovered;
        }
        const { whileTap, whileHover } = refWhileTap.current;
        setAnimsFromPress(
            Object.assign({}, refState.current.pressed ? whileTap : undefined, refState.current.hovered ? whileHover : undefined)
        );
    }, []);

    return (
        <Pressable
            onPressIn={whileTap ? () => update(true, undefined) : undefined}
            onPressOut={whileTap ? () => update(false, undefined) : undefined}
            // @ts-ignore
            onMouseEnter={whileHover && Platform.OS === 'web' ? (e) => update(undefined, true) : undefined}
            // @ts-ignore
            onMouseLeave={whileHover && Platform.OS === 'web' ? (e) => update(undefined, false) : undefined}
        >
            {children}
        </Pressable>
    );
}

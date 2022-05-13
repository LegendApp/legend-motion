import { useMakeRef } from '@legendapp/tools';
import React, { ReactNode, useCallback, useRef } from 'react';
import { Pressable } from 'react-native';

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
            onPressIn={() => update(true, undefined)}
            onPressOut={() => update(false, undefined)}
            // @ts-ignore
            onMouseEnter={(e) => update(undefined, true)}
            // @ts-ignore
            onMouseLeave={(e) => update(undefined, false)}
        >
            {children}
        </Pressable>
    );
}

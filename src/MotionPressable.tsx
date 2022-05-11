import { useMakeRef } from '@legendapp/tools';
import React, { ReactNode, useCallback } from 'react';
import { Pressable } from 'react-native';

interface Props {
    whileTap: any;
    setAnimsFromPress: (a: any) => void;
    children: ReactNode;
}
export function MotionPressable({ whileTap, setAnimsFromPress, children }: Props) {
    const refWhileTap = useMakeRef(whileTap);

    const update = useCallback((isPressed: boolean) => {
        setAnimsFromPress(isPressed ? refWhileTap.current : undefined);
    }, []);

    return (
        <Pressable onPressIn={() => update(true)} onPressOut={() => update(false)}>
            {children}
        </Pressable>
    );
}

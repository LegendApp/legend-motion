import React, { createContext, useCallback, useState } from 'react';
import { Platform, Pressable, PressableProps } from 'react-native';

export const ContextPressable = createContext({ pressed: false, hovered: false });

export function MotionPressable(props: PressableProps) {
    // @ts-ignore Web props cause errors
    const { onPressIn, onPressOut, onMouseEnter, onMouseLeave, children, ...rest } = props;

    const [state, setState] = useState({ pressed: false, hovered: false });

    const update = useCallback((pressed: boolean, hovered: boolean) => {
        setState((cur) => ({
            pressed: pressed ?? cur.pressed,
            hovered: hovered ?? cur.hovered,
        }));
    }, []);

    return (
        <Pressable
            onPressIn={(e) => {
                update(true, undefined);
                onPressIn?.(e);
            }}
            onPressOut={(e) => {
                update(false, undefined);
                onPressOut?.(e);
            }}
            // @ts-ignore
            onMouseEnter={
                Platform.OS === 'web'
                    ? (e) => {
                          update(undefined, true);
                          onMouseEnter?.(e);
                      }
                    : undefined
            }
            // @ts-ignore
            onMouseLeave={
                Platform.OS === 'web'
                    ? (e) => {
                          update(undefined, false);
                          onMouseLeave?.(e);
                      }
                    : undefined
            }
            {...rest}
        >
            <ContextPressable.Provider value={state}>{children}</ContextPressable.Provider>
        </Pressable>
    );
}

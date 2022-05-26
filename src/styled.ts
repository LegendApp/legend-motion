import type { ComponentType } from 'react';
import { Animated, FlatListProps, ImageProps, ScrollViewProps, SectionListProps, TextProps, ViewProps } from 'react-native';
// @ts-ignore
import { styled } from 'tailwindcss-react-native';
import { createMotionComponent } from './createMotionComponent';

interface StyledProps {
    className?: string;
    tw?: string;
}

export namespace Motion {
    export const View = createMotionComponent<ComponentType<ViewProps & StyledProps>>(styled(Animated.View));
    export const Text = createMotionComponent<ComponentType<TextProps & StyledProps>>(styled(Animated.Text));
    export const FlatList = createMotionComponent<ComponentType<FlatListProps<unknown> & StyledProps>>(styled(Animated.FlatList));
    export const Image = createMotionComponent<ComponentType<ImageProps & StyledProps>>(styled(Animated.Image));
    export const ScrollView = createMotionComponent<ComponentType<ScrollViewProps & StyledProps>>(styled(Animated.ScrollView));
    export const SectionList = createMotionComponent<ComponentType<SectionListProps<unknown, unknown> & StyledProps>>(
        styled(Animated.SectionList)
    );
}

import type { ComponentType } from 'react';
import {
    Animated,
    FlatList as RNFlatList,
    Image as RNImage,
    ScrollView as RNScrollView,
    SectionList as RNSectionList,
    Text as RNText,
    View as RNView,
} from 'react-native';
// @ts-ignore
import { styled } from 'tailwindcss-react-native';
import { createMotionComponent } from './createMotionComponent';

interface StyledProps {
    className?: string;
    tw?: string;
}

export namespace Motion {
    export const View = createMotionComponent<typeof RNView & ComponentType<StyledProps>>(styled(Animated.View));
    export const Text = createMotionComponent<typeof RNText & ComponentType<StyledProps>>(styled(Animated.Text));
    export const FlatList = createMotionComponent<typeof RNFlatList & ComponentType<StyledProps>>(styled(Animated.FlatList));
    export const Image = createMotionComponent<typeof RNImage & ComponentType<StyledProps>>(styled(Animated.Image));
    export const ScrollView = createMotionComponent<typeof RNScrollView & ComponentType<StyledProps>>(styled(Animated.ScrollView));
    export const SectionList = createMotionComponent<typeof RNSectionList & ComponentType<StyledProps>>(styled(Animated.SectionList));
}

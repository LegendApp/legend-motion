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
    export const View = createMotionComponent<typeof RNView, StyledProps>(styled(Animated.View));
    export const Text = createMotionComponent<typeof RNText, StyledProps>(styled(Animated.Text));
    export const FlatList = createMotionComponent<typeof RNFlatList, StyledProps>(styled(Animated.FlatList));
    export const Image = createMotionComponent<typeof RNImage, StyledProps>(styled(Animated.Image));
    export const ScrollView = createMotionComponent<typeof RNScrollView, StyledProps>(styled(Animated.ScrollView));
    export const SectionList = createMotionComponent<typeof RNSectionList, StyledProps>(styled(Animated.SectionList));
}

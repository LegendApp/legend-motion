import {
    Animated,
    FlatList as RNFlatList,
    Image as RNImage,
    PressableProps,
    ScrollView as RNScrollView,
    SectionList as RNSectionList,
    Text as RNText,
    View as RNView,
} from 'react-native';
import { MotionPressable } from './MotionPressable';
import { styled } from 'nativewind';
import { createMotionComponent } from './createMotionComponent';

export declare type StyledProps = {
    className?: string;
    tw?: string;
    baseClassName?: string;
    baseTw?: string;
};

export namespace Motion {
    export const View = createMotionComponent<typeof RNView, StyledProps>(styled(Animated.View));
    export const Text = createMotionComponent<typeof RNText, StyledProps>(styled(Animated.Text));
    export const FlatList = createMotionComponent<typeof RNFlatList, StyledProps>(
        styled(Animated.FlatList) as unknown as typeof RNFlatList
    );
    export const Image = createMotionComponent<typeof RNImage, StyledProps>(styled(Animated.Image));
    export const ScrollView = createMotionComponent<typeof RNScrollView, StyledProps>(styled(Animated.ScrollView));
    export const SectionList = createMotionComponent<typeof RNSectionList, StyledProps>(
        styled(Animated.SectionList) as unknown as typeof RNSectionList
    );
    export const Pressable = styled(MotionPressable) as (props: PressableProps & StyledProps) => JSX.Element;
}

import { Animated } from 'react-native';
// @ts-ignore
import { styled } from 'tailwindcss-react-native';
import { createMotionComponent } from './createMotionComponent';

export namespace Motion {
    export const View = createMotionComponent(styled(Animated.View));
    export const Text = createMotionComponent(styled(Animated.Text));
    export const FlatList = createMotionComponent(styled(Animated.FlatList));
    export const Image = createMotionComponent(styled(Animated.Image));
    export const ScrollView = createMotionComponent(styled(Animated.ScrollView));
    export const SectionList = createMotionComponent(styled(Animated.SectionList));
}

import { Animated } from 'react-native';
import { createMotionComponent } from './createMotionComponent';
import { MotionPressable } from './MotionPressable';

export namespace Motion {
    export const View = createMotionComponent(Animated.View);
    export const Text = createMotionComponent(Animated.Text);
    export const FlatList = createMotionComponent(Animated.FlatList);
    export const Image = createMotionComponent(Animated.Image);
    export const ScrollView = createMotionComponent(Animated.ScrollView);
    export const SectionList = createMotionComponent(Animated.SectionList);
    export const Pressable = MotionPressable;
}

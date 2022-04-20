import * as RNSvg from 'react-native-svg';
import { createMotionAnimatedComponent } from './createMotionComponent';

export namespace MotionSvg {
    export const Svg = createMotionAnimatedComponent(RNSvg.Svg);
    export const Polygon = createMotionAnimatedComponent(RNSvg.Polygon);
    export const Rect = createMotionAnimatedComponent(RNSvg.Rect);
    export const Circle = createMotionAnimatedComponent(RNSvg.Circle);
    export const Ellipse = createMotionAnimatedComponent(RNSvg.Ellipse);
    export const Line = createMotionAnimatedComponent(RNSvg.Line);
    export const Polyline = createMotionAnimatedComponent(RNSvg.Polyline);
    export const Path = createMotionAnimatedComponent(RNSvg.Path);
    export const Text = createMotionAnimatedComponent(RNSvg.Text);
    export const TSpan = createMotionAnimatedComponent(RNSvg.TSpan);
    export const TextPath = createMotionAnimatedComponent(RNSvg.TextPath);
    export const G = createMotionAnimatedComponent(RNSvg.G);
    export const ClipPath = createMotionAnimatedComponent(RNSvg.ClipPath);
    export const LinearGradient = createMotionAnimatedComponent(RNSvg.LinearGradient);
    export const RadialGradient = createMotionAnimatedComponent(RNSvg.RadialGradient);
}

## 2.1.6
- Feature: Added Pressable export to /styled

## 2.1.5
- Fix: Types of styled components were not correct

## 2.1.4
- Fix: forwardRef had removed the generic typing so transition was not autocompleting

## 2.1.3
- Fix: ref was not forwarding through to component

## 2.1.2
- Fix: `onLayout` prop was not passing through to component

## 2.1.1
- Fix: "default" transition was not working correctly

## 2.1.0
- Feature: Added `exit` prop along with `AnimatePresence`.  See [the example](https://www.legendapp.com/dev/motion/animate-presence).

## 2.0.0
- Breaking: `whileTap` and `whileHover` props now require a `Motion.Pressable` ancestor, which is uses for tracking whether it is hovered or pressed. See [the example](https://www.legendapp.com/dev/motion/overview/#gestures).

## 1.4.2
- Fix: whileHover was not working without whileTap

## 1.4.1
- Fix: ordering of gesture state so `whileTap` overrides `whileHover`

## 1.4.0
- Feature: Added styled components using [tailwindcss-react-native](https://github.com/marklawlor/tailwindcss-react-native). Import from `@legendapp/motion/styled`. See https://legendapp.com/dev/motion/tailwind-css/ for more info.

## 1.3.0
- Feature: Added `whileHover` prop

## 1.2.0
- Feature: Added `whileTap` prop

## 1.1.0
- Feature: Added `configureMotion` to be able to set timing to seconds to match Framer Motion
- Feature: Added named easing functions

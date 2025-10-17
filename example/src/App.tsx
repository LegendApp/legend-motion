/* eslint-disable react-native/no-inline-styles */
import '../global.css';
import { AnimatePresence, Motion } from '@legendapp/motion';
import { MotionLinearGradient } from '@legendapp/motion/linear-gradient-expo';
import { Motion as MotionStyled } from '@legendapp/motion/styled';
import { MotionSvg } from '@legendapp/motion/svg';
import React, { type FC, useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';

interface Props {
    value: number;
}

function useInterval(cb: () => void, ms: number) {
    useEffect(() => {
        const int = setInterval(() => {
            cb();
        }, ms);

        return () => clearInterval(int);
    }, [ms, cb]);
}

const Examples: Record<string, { code: string; Component: FC<any>; disableValue?: boolean }> = {
    Simple: {
        code: `
<Motion.View
    animate={{
        x: value * 100
    }}
/>`,
        Component: ({ value }: Props) => <Motion.View animate={{ x: value * 100 }} style={styles.box} />,
    },
    Transition: {
        code: `
<Motion.View
    animate={{
        x: value * 100
    }}
    transition={{
        type: 'spring',
        damping: 20,
        stiffness: 400
    }}
/>`,
        Component: ({ value }: Props) => (
            <Motion.View style={styles.box} animate={{ x: value * 100 }} transition={{ type: 'spring', damping: 20, stiffness: 400 }} />
        ),
    },
    'Transitions Custom': {
        code: `
<Motion.View
    animate={{
        x: value * 100,
        opacity: value ? 1 : 0.2,
        scale: value ? 1 : 0.5
    }}
    transition={{
        default: {
            type: "spring",
            damping: 20,
            stiffness: 300
        }
        x: {
            type: "spring",
            damping: 24,
            stiffness: 500
        },
        opacity: {
            type: "tween",
            duration: 1000
        }
    }}
/>`,
        Component: ({ value }: Props) => (
            <Motion.View
                style={styles.box}
                animate={{
                    x: value * 100,
                    opacity: value ? 1 : 0.2,
                    scale: value ? 1 : 0.5,
                }}
                transition={{
                    default: {
                        type: 'spring',
                        damping: 20,
                        stiffness: 300,
                    },
                    x: {
                        type: 'spring',
                        damping: 24,
                        stiffness: 500,
                    },
                    opacity: {
                        type: 'tween',
                        duration: 1000,
                    },
                }}
            />
        ),
    },
    Timing: {
        code: `
<Motion.View
    animate={{
        x: value * 100,
    }}
    transition={{
        type: 'tween',
        duration: 1000
    }}
/>`,
        Component: ({ value }: Props) => (
            <Motion.View
                style={styles.box}
                animate={{
                    x: value * 100,
                }}
                transition={{
                    type: 'tween',
                    duration: 1000,
                }}
            />
        ),
    },
    Easing: {
        code: `
<Motion.View
    animate={{
        x: value * 100,
    }}
    transition={{
        type: 'tween',
        duration: 1000,
        easing: 'easeOut'
    }}
/>`,
        Component: ({ value }: Props) => (
            <Motion.View
                style={styles.box}
                animate={{
                    x: value * 100,
                }}
                transition={{
                    type: 'tween',
                    duration: 1000,
                    easing: 'easeOut',
                }}
            />
        ),
    },
    Initial: {
        code: `
<Motion.View
    initial={{ x: 0 }}
    animate={{ x: 100 }}
/>`,
        Component: () => <Motion.View style={styles.box} initial={{ x: 0 }} animate={{ x: 100 }} />,
    },
    Color: {
        code: `
<Motion.View
    animate={{
        backgroundColor:
            value ? '#F81FEC' : '#59B0F8'
    }}
/>`,
        Component: ({ value }: Props) => (
            <Motion.View
                style={[styles.box, { marginLeft: 0 }]}
                animate={{
                    backgroundColor: value ? '#F81FEC' : '#59B0F8',
                }}
            />
        ),
    },
    Text: {
        code: `
<Motion.Text
    animate={{
        color: value ? '#F81FEC' : '#59B0F8',
        fontSize: value ? 48 : 24
    }}
>
    Text
</Motion.Text>`,
        Component: ({ value }: Props) => (
            <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
                <Motion.Text
                    animate={{
                        color: value ? '#F81FEC' : '#59B0F8',
                        fontSize: value ? 48 : 24,
                    }}
                >
                    Text
                </Motion.Text>
            </View>
        ),
    },
    'Linear Gradient': {
        code: `
<MotionLinearGradient
    animateProps={{
        colors: [
            value ? '#F81FEC' : 'blue',
            value ? '#59B0F8' : 'yellow'
        ],
        start: { x: 0, y: 0 },
        end: { x: value ? 1 : 0, y: 1 },
    }}
/>
`,
        Component: ({ value }: Props) => (
            <MotionLinearGradient
                style={[styles.box, { marginLeft: 0 }]}
                animateProps={{
                    colors: [value ? '#F81FEC' : 'blue', value ? '#59B0F8' : 'yellow'],
                    start: { x: 0, y: 0 },
                    end: { x: value ? 1 : 0, y: 1 },
                }}
            />
        ),
    },
    Svg: {
        code: `
<MotionSvg.Svg height="150" width="300">
    <MotionSvg.Polygon
        stroke="purple"
        animateProps={{
            points: value === 1 ? '40,50 70,90 50,95' : '40,5 70,80 25,95',
            fill: value === 1 ? 'pink' : 'lime',
            strokeWidth: value ? '1' : '3',
        }}
        transition={{
            points: {
                type: 'spring',
                damping: 20,
                stiffness: 300,
            },
        }}
    />
    <MotionSvg.Rect
        fill="rgba(255, 0, 0, 0.5)"
        stroke="purple"
        strokeWidth="1"
        animateProps={{
            fill: value ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 0, 0.5)',
            x: value ? '100' : '180',
            y: value ? '20' : '40',
            width: value ? '50' : '100',
            height: value ? '50' : '100',
        }}
        transition={{
            type: 'spring',
            damping: 20,
            stiffness: 300,
        }}
    />
</MotionSvg.Svg>`,
        Component: ({ value }: Props) => (
            <MotionSvg.Svg height="150" width="300">
                <MotionSvg.Polygon
                    stroke="purple"
                    animateProps={{
                        points: value === 1 ? '40,50 70,90 50,95' : '40,5 70,80 25,95',
                        fill: value === 1 ? 'pink' : 'lime',
                        strokeWidth: value ? '1' : '3',
                    }}
                    transition={{
                        points: {
                            type: 'spring',
                            damping: 20,
                            stiffness: 300,
                        },
                    }}
                />
                <MotionSvg.Rect
                    fill="rgba(255, 0, 0, 0.5)"
                    stroke="purple"
                    strokeWidth="1"
                    animateProps={{
                        fill: value ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 0, 0.5)',
                        x: value ? '100' : '180',
                        y: value ? '20' : '40',
                        width: value ? '50' : '100',
                        height: value ? '50' : '100',
                    }}
                    transition={{
                        type: 'spring',
                        damping: 20,
                        stiffness: 300,
                    }}
                />
            </MotionSvg.Svg>
        ),
    },
    whileTap: {
        code: `
<MotionPressable>
    <Motion.View
        whileHover={{ scale: 1.1 }}
        whileTap={{ y: 10 }}
    >
        <Text>
            Press me
        </Text>
    </Motion.View>
</MotionPressable>
`,
        Component: () => (
            <Motion.Pressable>
                <Motion.View
                    style={[styles.box, { marginLeft: 0, justifyContent: 'center', alignItems: 'center' }]}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ y: 10 }}
                    transition={{
                        type: 'spring',
                        damping: 20,
                        stiffness: 400,
                    }}
                >
                    <Text style={{ color: 'white' }}>Press me</Text>
                </Motion.View>
            </Motion.Pressable>
        ),
    },
    Styled: {
        code: `
<Motion.View
    className="w-32 h-32 bg-blue-500 rounded-xl"
    animate={{ x: value * 100 }}
    transition={{
        type: 'spring',
        damping: 20,
        stiffness: 400,
    }}
/>
`,
        Component: ({ value }: Props) => (
            <MotionStyled.View
                style={{ marginLeft: -100 }}
                className="w-32 h-32 bg-blue-500 rounded-xl"
                animate={{ x: value * 100 }}
                transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 400,
                }}
            />
        ),
    },
    Presence: {
        code: `
<AnimatePresence>
    {value ? (
        <MotionStyled.View
            key="A"
            style={{ marginLeft: -100 }}
            initial={{ opacity: 0.5, x: 0 }}
            animate={{ opacity: 1, x: 100 }}
            exit={{ opacity: 0.1, x: 0, y: 20 }}
            transition={{
                default: {
                    type: 'spring',
                },
                opacity: {
                    type: 'timing',
                },
            }}
        />
    ) : null}
</AnimatePresence>
`,
        Component: ({ value }: Props) => (
            <View style={{ height: 150 }}>
                <AnimatePresence>
                    {value ? (
                        <Motion.View
                            key="A"
                            style={[styles.box, { marginLeft: -100 }]}
                            initial={{ opacity: 0.5, x: 0 }}
                            animate={{ opacity: 1, x: 100 }}
                            exit={{ opacity: 0.1, x: 0, y: 10 }}
                            transition={{
                                default: {
                                    type: 'spring',
                                    damping: 20,
                                    stiffness: 400,
                                },
                                opacity: {
                                    type: 'timing',
                                    duration: 300,
                                },
                            }}
                        />
                    ) : null}
                </AnimatePresence>
            </View>
        ),
    },
    Loop: {
        code: `
<Motion.View
    initial={{
        x: 0
    }}
    animate={{
        x: 100
    }}
    transition={{
        type: 'timing',
        duration: 1500,
        loop: -1
    }}
/>`,
        Component: () => (
            <Motion.View
                initial={{ x: 0 }}
                animate={{ x: 100 }}
                transition={{ type: 'timing', duration: 1500, loop: -1 }}
                style={styles.box}
            />
        ),
        disableValue: true,
    },
};

export default function App() {
    const [selected, setSelected] = useState<keyof typeof Examples>('Simple');
    const [value, setValue] = useState(0);

    useInterval(
        useCallback(() => {
            setValue((v) => (v === 0 ? 1 : 0));
        }, []),
        1800
    );

    const { code, Component, disableValue } = Examples[selected];
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.topBarText}>{selected}</Text>
            </View>
            <View style={styles.main}>
                <Component value={value} />
                <Text style={styles.text}>{disableValue ? '' : `value: ${value}`}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <SyntaxHighlighter highlighter="prism" language="jsx" PreTag={ScrollView} CodeTag={ScrollView}>
                    {code}
                </SyntaxHighlighter>
            </View>
            <View style={styles.bottom}>
                {Object.keys(Examples).map((ex: keyof typeof Examples) => (
                    <TouchableHighlight key={ex} onPress={() => setSelected(ex)} underlayColor="#fafafa" style={styles.button}>
                        <Text style={[styles.buttonText, selected === ex && styles.buttonTextSelected]}>{ex}</Text>
                    </TouchableHighlight>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBar: {
        alignItems: 'center',
    },
    topBarText: {
        fontWeight: 'bold',
        lineHeight: 40,
    },
    main: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 190,
        maxHeight: 190,
    },
    bottom: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
    box: {
        backgroundColor: '#666768',
        width: 150,
        height: 150,
        borderRadius: 24,
        marginLeft: -100,
    },
    text: {
        marginTop: 16,
        fontSize: 16,
        minWidth: 68,
        color: '#0099dd',
        fontWeight: 'bold',
    },
    button: {
        height: 36,
        paddingHorizontal: 14,
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#323334',
    },
    buttonTextSelected: {
        fontWeight: 'bold',
        color: '#09d',
    },
});

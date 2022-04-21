import { Motion } from '@legendapp/motion';
import { MotionLinearGradient } from '@legendapp/motion/linear-gradient-expo';
import { MotionSvg } from '@legendapp/motion/svg';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
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

const Examples = {
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
                style={[styles.box, { marginLeft: 0 }] }
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
};

export default function App() {
    const [selected, setSelected] = useState<keyof typeof Examples>('Simple');
    const [value, setValue] = useState(0);

    useInterval(
        useCallback(() => {
            setValue((v) => (v === 0 ? 1 : 0));
        }, []),
        1500
    );

    const { code, Component } = Examples[selected];
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.topBarText}>{selected}</Text>
            </View>
            <View style={styles.main}>
                <Component value={value} />
                <Text style={styles.text}>value: {value}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <SyntaxHighlighter highlighter="prism" language="jsx">
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
        borderRadius: 16,
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
        height: 30,
        paddingHorizontal: 8,
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        textAlign: 'center',
    },
    buttonTextSelected: {
        fontWeight: 'bold',
        color: 'blue',
    },
});

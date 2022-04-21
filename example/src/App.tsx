import { Motion } from '@legendapp/motion';
import { MotionLinearGradient } from '@legendapp/motion/linear-gradient-expo';
import { MotionSvg } from '@legendapp/motion/svg';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

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

const ExampleView = ({ value }: Props) => {
    return (
        <Motion.View
            transformOrigin={{ x: '0%', y: '0%' }}
            animate={{ scale: value ? 1 : 0.75 }}
            style={styles.box}
            transition={{
                scale: {
                    type: 'spring',
                    damping: 20,
                    stiffness: 500,
                },
            }}
        />
    );
};

const ExampleGradient = ({ value }: Props) => {
    return (
        <MotionLinearGradient
            style={styles.box}
            locations={[0, 1]}
            animateProps={{
                colors: [value === 1 ? 'red' : 'blue', value === 1 ? 'pink' : 'yellow'],
                start: { x: 0, y: 0 },
                end: value ? { x: 1, y: 0 } : { x: 1, y: 1 },
            }}
        />
    );
};

const ExampleSvg = ({ value }: Props) => {
    return (
        <MotionSvg.Svg height="200" width="300">
            <MotionSvg.Polygon
                stroke="purple"
                animateProps={{
                    points: value === 1 ? `40,50 70,90 50,95` : `40,5 70,80 25,95`,
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
                    x: value ? '100' : '140',
                    y: value ? '10' : '40',
                    width: value ? '50' : '150',
                    height: value ? '50' : '150',
                }}
                transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 300,
                }}
            />
        </MotionSvg.Svg>
    );
};

const Examples = {
    'View': ExampleView,
    'Linear Gradient': ExampleGradient,
    'Svg': ExampleSvg,
};

export default function App() {
    const [selected, setSelected] = useState<keyof typeof Examples>('Linear Gradient');
    const [value, setValue] = useState(0);

    useInterval(
        useCallback(() => {
            setValue((v) => (v === 0 ? 1 : 0));
        }, []),
        1500
    );

    const Component = Examples[selected];
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.topBarText}>{selected}</Text>
            </View>
            <View style={styles.main}>
                <Component value={value} />
                <Text style={styles.text}>Value: {value}</Text>
            </View>
            <ScrollView style={styles.scroller}>
                {Object.keys(Examples).map((ex: keyof typeof Examples) => (
                    <TouchableHighlight key={ex} onPress={() => setSelected(ex)} underlayColor="#fafafa" style={styles.button}>
                        <Text style={[styles.buttonText, selected === ex && styles.buttonTextSelected]}>{ex}</Text>
                    </TouchableHighlight>
                ))}
            </ScrollView>
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
        flex: 1,
        minHeight: 240,
    },
    scroller: {
        flex: 0,
        minHeight: 20,
        margin: 0,
        paddingTop: 16,
        borderTopColor: '#ccc',
        borderTopWidth: 1,
        borderStyle: 'solid',
    },
    box: {
        backgroundColor: '#666768',
        width: 200,
        height: 200,
    },
    text: {
        marginTop: 16,
        fontSize: 18,
        minWidth: 68,
    },
    button: {
        height: 40,
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

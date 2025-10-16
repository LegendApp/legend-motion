import { arrayRemove, isString } from '@legendapp/tools';
import { useForceRender, usePrevious } from '@legendapp/tools/react';
import React, { Children, cloneElement, isValidElement, Key, ReactElement, ReactNode, useRef } from 'react';

interface Props {
    children: ReactNode;
}

type MotionChildProps = {
    exit?: Record<string, any>;
    animate?: Record<string, any>;
    onAnimationComplete?: (key: string) => void;
} & Record<string, any>;

function exitableByKey(children: ReactNode[]) {
    const map = new Map<Key, ReactElement<MotionChildProps>>();
    Children.forEach(children, (child) => {
        if (isValidElement(child)) {
            const motionChild = child as ReactElement<MotionChildProps>;
            if (motionChild.key && motionChild.props?.exit && isString(motionChild.key)) {
                map.set(motionChild.key, motionChild);
            }
        }
    });
    return map;
}

export function AnimatePresence({ children }: Props) {
    const fr = useForceRender();
    const childArr = Children.toArray(children);
    const childrenPrevious = usePrevious(childArr);

    // Map children and previous children to { key: child }
    const childrenByKey = exitableByKey(childArr);
    const childrenByKeyPrevious = usePrevious(childrenByKey);

    // Add newly exited elements to the exiting map
    const exiting = useRef(new Map<Key, ReactElement<MotionChildProps>>());
    if (childrenByKeyPrevious) {
        childrenByKeyPrevious.forEach((prevChild, key) => {
            if (!childrenByKey.get(key)) {
                exiting.current.set(key, prevChild);
            }
        });
    }

    // Render exiting elements into the position they were previously
    let childrenToRender = [...childArr];
    exiting.current.forEach((child, key) => {
        if (childrenByKey.get(key)) {
            exiting.current.delete(key);
        } else {
            const index = childrenPrevious.indexOf(child);
            childrenToRender.splice(index, 0, child);
        }
    });

    return (
        <>
            {childrenToRender.map((child) => {
                if (isValidElement(child)) {
                    const motionChild = child as ReactElement<MotionChildProps>;
                    const { exit: motionExit } = motionChild.props;
                    if (motionExit) {
                        const key = motionChild.key;
                        const animKeys = Object.keys(motionExit);
                        // Remove the child when all exit animations end
                        return key && exiting.current.get(key) && animKeys
                            ? cloneElement(motionChild, {
                                  animate: motionExit,
                                  onAnimationComplete: (animKey) => {
                                      if (exiting.current.has(key)) {
                                          arrayRemove(animKeys, animKey);
                                          if (animKeys.length === 0) {
                                              exiting.current.delete(key);
                                              fr();
                                          }
                                      }
                                  },
                              })
                            : motionChild;
                    }
                }
                return child;
            })}
        </>
    );
}

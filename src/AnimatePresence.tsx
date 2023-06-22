import { arrayRemove, isString } from '@legendapp/tools';
import { useForceRender, usePrevious } from '@legendapp/tools/react';
import React, { Children, cloneElement, Key, ReactElement, ReactNode, useRef } from 'react';

interface Props {
    children: ReactNode;
}

function exitableByKey(children: ReactNode[]) {
    const map = new Map<Key, ReactElement>();
    Children.forEach(children, (child: ReactElement) => {
        if (child.key && child.props?.exit && isString(child.key)) {
            map.set(child.key, child);
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
    const exiting = useRef(new Map<Key, ReactElement>());
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
            {childrenToRender.map((child: ReactElement) => {
                if (child && child.props.exit) {
                    const key = child.key;
                    const animKeys = Object.keys(child.props.exit);
                    // Remove the child when all exit animations end
                    return key && exiting.current.get(key) && animKeys
                        ? cloneElement(child, {
                              animate: child.props.exit,
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
                        : child;
                }
                return child;
            })}
        </>
    );
}

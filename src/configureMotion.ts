import type { MotionConfig } from 'src/Interfaces';

export const config: MotionConfig = {
    timing: 'ms',
};

export const configureMotion = function configureMotion(configuration: MotionConfig) {
    Object.assign(config, configuration);
};

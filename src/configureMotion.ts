import type { MotionConfig } from 'src/Interfaces';

export const config: MotionConfig = {
    times: 'ms',
};

export const configureMotion = function configureMotion(configuration: MotionConfig) {
    Object.assign(config, configuration);
};

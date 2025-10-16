const path = require('path');
const escape = require('escape-string-regexp');
const exclusionList = require('metro-config/private/defaults/exclusionList');
const { getDefaultConfig } = require('expo/metro-config');
const pak = require('../package.json');
const { withNativeWind } = require('nativewind/metro');

const root = path.resolve(__dirname, '..');
const defaultConfig = getDefaultConfig(__dirname);

const modules = Object.keys({
    ...pak.peerDependencies,
});

module.exports = withNativeWind(
    {
        ...defaultConfig,
        projectRoot: __dirname,
        watchFolders: Array.from(new Set([...(defaultConfig.watchFolders ?? []), root])),
        // Ensure Metro resolves assets using React Native's AssetRegistry
        resolver: {
            ...defaultConfig.resolver,
            assetRegistryPath: path.join(__dirname, 'node_modules/react-native/Libraries/Image/AssetRegistry'),
            blacklistRE: exclusionList(modules.map((m) => new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`))),
            extraNodeModules: modules.reduce((acc, name) => {
                acc[name] = path.join(__dirname, 'node_modules', name);
                return acc;
            }, {}),
        },
        transformer: {
            ...defaultConfig.transformer,
            getTransformOptions: async () => ({
                transform: {
                    experimentalImportSupport: false,
                    inlineRequires: true,
                },
            }),
        },
    },
    { input: './global.css' }
);

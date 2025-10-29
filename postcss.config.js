export default {
	plugins: {
		'postcss-preset-env': {
			features: {
				'oklab-function': { preserve: true },
				'relative-color-syntax': { preserve: true },
			},
		},
		cssnano: { preset: ['default'] },
	},
};

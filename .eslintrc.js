module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es2021": true,
		"node": true,
		"shared-node-browser": true,
	},
	"extends": [
		"eslint:recommended",
		"plugin:node/recommended",
	],
	"overrides": [
	],
	"parserOptions": {
		"ecmaVersion": "latest",
	},
	"plugins": [
		"node",
	],
	"rules": {
		"comma-dangle": [
			"error",
			"always-multiline",
		],
		"indent": [
			"error",
			"tab",
		],
		"linebreak-style": [
			"error",
			"unix",
		],
		"quotes": [
			"error",
			"double",
		],
		"semi": [
			"error",
			"never",
		],
		"node/exports-style": [
			"error",
			"module.exports",
		],
	},
}

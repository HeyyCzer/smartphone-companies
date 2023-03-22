module.exports = {
	parserPreset: {
		parserOpts: {
			headerPattern: /^(?<type>((?::\w+:|(?:\ud83c[\udf00-\udfff])|(?:\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]))?\s?\w*)(?:\((?<scope>.*)\))?!?:\s(?<subject>(?:(?!#).)*(?:(?!\s).))(?:\s\(?(?<ticket>#\d*)\)?)?$/,
			headerCorrespondence: ["type", "scope", "subject", "ticket"],
		},
	},
	extends: [
		"@commitlint/config-conventional",
		"gitmoji"
	],
	rules: {
		["type-enum"]: [0]
	}
};
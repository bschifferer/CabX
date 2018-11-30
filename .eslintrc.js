module.exports = {
    "extends": "google",
    "env": {
        "es6": true
    },
    "parserOptions": {
        "ecmaVersion": 2017
    },
    rules: {
        "no-var": 0,
        "no-tabs": 0,
        "indent": 0,
        "prefer-const": 0,
	"no-unused-vars": 'error',
	"no-empty": 'error',
        'no-constant-condition': ['error', { checkLoops: false }],
    'no-alert': 'warn',
    'array-callback-return': 'error',
    'no-caller': 'error',
    'no-else-return': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-implied-eval': 'error',
    'no-iterator': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-multi-str': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-proto': 'error',
    'no-return-await': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-useless-call': 'error',
    'no-useless-return': 'error',
    'no-with': 'error',
    'no-use-before-define': 'error',
    }
};

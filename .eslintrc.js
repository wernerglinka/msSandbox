module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [2, 4],
        "linebreak-style": [2, "unix"],
        "quotes": [2, "double", "avoid-escape"],
        "semi": [2,"always"],
        "no-console": 0,
        "no-extra-semi": "warn"
    },
    "globals": {
        "jQuery": true,
        "$": true
    }
};
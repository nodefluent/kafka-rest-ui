module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "node": true,
        "jest": true,
    },
    "plugins": ["flowtype"],
    "rules":{
      "camelcase": 0,
      "react/jsx-filename-extension": 0,
      "react/no-array-index-key": 0,
      "react/jsx-no-bind": 0,
      "react/prop-types": 0,
      "max-len": ["error", 120],
    }
};

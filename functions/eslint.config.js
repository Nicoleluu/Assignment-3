module.exports = [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: { console: "readonly" }
        },
        rules: {
            "no-unused-vars": "error",
            "no-undef": "error"
        }
    }
];

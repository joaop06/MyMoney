module.exports = {
    lastLoggedInUser: {
        type: "string",
        defaultValue: "",
    },
    isLoggedIn: {
        type: "boolean",
        defaultValue: false,
    },
    username: {
        type: "string",
        defaultValue: "João",
    },
    totalBalance: {
        type: "number",
        defaultValue: 0.00,
    },
    spending: {
        type: "object",
        subType: "array",
        defaultValue: [],
    },
    rents: {
        type: "object",
        subType: "array",
        defaultValue: [],
    },
}

import { getTotalExpense, addExpense } from "./expense";
import { addPocketMoney } from "./pocketMoney";

export const tools = {
    getTotalExpense,
    addExpense,
    pocketMoney: addPocketMoney,
};

export const toolDefinitions = [
    {
        type: "function" as const,
        function: {
            name: "getTotalExpense",
            description: "Get total expenses for a specific date range",
            parameters: {
                type: "object",
                properties: {
                    from: {
                        type: "string",
                        description: "Start date in YYYY-MM-DD format",
                    },
                    to: {
                        type: "string",
                        description: "End date in YYYY-MM-DD format",
                    },
                },
                required: ["from", "to"],
            },
        },
    },
    {
        type: "function" as const,
        function: {
            name: "addExpense",
            description: "Add new expense entry to the database",
            parameters: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                        description:
                            "Name of the expense (e.g., 'Bought a bike')",
                    },
                    amount: {
                        type: "string",
                        description: "Amount of the expense",
                    },
                },
                required: ["name", "amount"],
            },
        },
    },
    {
        type: "function" as const,
        function: {
            name: "pocketMoney",
            description: "Add pocket money to the database",
            parameters: {
                type: "object",
                properties: {
                    amount: {
                        type: "string",
                        description: "Amount of pocket money to add",
                    },
                },
                required: ["amount"],
            },
        },
    },
];

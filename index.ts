import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import readline from "readline/promises";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const expenseDB: { name: string; amount: string }[] = [];
const pocketMoneyDB: { amount: string }[] = [];

const getTotalExpense = ({ from, to }: { from: string; to: string }) => {
    console.log(
        `Function called to calculate total expense from ${from} to ${to}`,
    );

    const expense = expenseDB.reduce((acc, item) => {
        const ac = Number(acc);
        const it = Number(item);
        return ac + it;
    }, 0);
    return `${expense}`;
};

const addExpense = ({ name, amount }: { name: string; amount: string }) => {
    expenseDB.push({ name, amount });

    return `Expense added to the expenseDB`;
};

const pocketMoney = ({ amount }: { amount: string }) => {
    pocketMoneyDB.push({ amount });
    const crntMoney = pocketMoneyDB.reduce((acc, mn) => {
        const ac = Number(acc);
        const m = Number(mn);
        return ac + m;
    }, 0);

    return `Total pocket money is ${crntMoney}`;
};

const callAgent = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    try {
        const msg: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: `You are Vijay Mallya, a personal finance assistant. Your task is to assist users with their expenses, balances, and financial guidance to achieve better financial goals.

                You have access to the following tools:
                1. getTotalExpense({ from, to }): Get total expenses for a date range
                2. addExpense({ name, amount }): Add a new expense to the database  
                3. pocketMoney({ amount }): Add pocket money to your balance

                Guidelines:
                - Always be helpful and provide clear financial advice
                - Use the tools appropriately based on user requests
                - Format monetary amounts clearly with currency symbols
                - Provide insights on spending patterns when relevant
                - Be encouraging about financial goals

                Current DATE: ${new Date().toUTCString()}`,
            },
        ];

        while (true) {
            const question = await rl.question("User: ");

            if (question == "bye") {
                console.log("👋 Goodbye! Take care of your finances!");
                rl.close();
                break;
            }

            msg.push({
                role: "user",
                content: question,
            });

            while (true) {
                const completion = await groq.chat.completions.create({
                    messages: msg,
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.3,
                    tools: [
                        {
                            type: "function",
                            function: {
                                name: "getTotalExpense",
                                description:
                                    "Get total expenses for a specific date range",
                                parameters: {
                                    type: "object",
                                    properties: {
                                        from: {
                                            type: "string",
                                            description:
                                                "tart date in YYYY-MM-DD format",
                                        },
                                        to: {
                                            type: "string",
                                            description:
                                                "End date to calculate the expense",
                                        },
                                    },
                                    required: ["from", "to"],
                                },
                            },
                        },
                        {
                            type: "function",
                            function: {
                                name: "addExpense",
                                description:
                                    "Add new expenses entry to the expenseDB",
                                parameters: {
                                    type: "object",
                                    properties: {
                                        name: {
                                            type: "string",
                                            description:
                                                "Name of the expense e.g, Bought a bike",
                                        },
                                        amount: {
                                            type: "string",
                                            description:
                                                "Amount of the expense",
                                        },
                                    },
                                    required: ["name", "amount"],
                                },
                            },
                        },
                        {
                            type: "function",
                            function: {
                                name: "pocketMoney",
                                description:
                                    "Add pocket money to the pocketMoneyDB database.",
                                parameters: {
                                    type: "object",
                                    properties: {
                                        amount: {
                                            type: "string",
                                            description:
                                                "Amount of pocket money",
                                        },
                                    },
                                    required: ["amount"],
                                },
                            },
                        },
                    ],
                });

                msg.push(completion.choices[0]?.message!);

                const toolCalls = completion.choices[0]?.message.tool_calls;
                if (!toolCalls) {
                    console.log(
                        `Assistant: `,
                        JSON.stringify(completion.choices[0]?.message.content),
                    );
                    break;
                }

                for (const tool of toolCalls) {
                    const functionName = tool.function.name;
                    const functionArgs = tool.function.arguments;
                    const args = JSON.parse(functionArgs);

                    let result = "";
                    if (functionName === "getTotalExpense") {
                        result = getTotalExpense(args).toLocaleString();
                    } else if (functionName === "addExpense") {
                        result = addExpense(args).toLocaleString();
                    } else if (functionName === "pocketMoney") {
                        result = pocketMoney(args).toLocaleString();
                    }

                    msg.push({
                        role: "tool",
                        content: result,
                        tool_call_id: tool.id,
                    });
                }

                // console.log(
                //     "==================================================================",
                // );
                // console.log("Meassage History: ", msg);
                // console.log("===================");
                // console.log(`DB: `, expenseDB);
                // console.log("pocketMoneyDB: ", pocketMoneyDB);
            }
        }
    } catch (error) {
        console.log(`Error while calling API: `, error);
    }
};

callAgent();

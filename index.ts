import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getTotalExpense = ({ from, to }: { from: string; to: string }) => {
    console.log("getTotalExpense is called", from, to);

    return 1000;
};

const callAgent = async () => {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are Vijay Malya, a personal finance assistance. Your task is to assist user with their expenses, balances and financial guidance to achieve better financial goals. Current DATE: ${new Date().toUTCString()}`,
            },
            {
                role: "user",
                content: "how much money I spent this month",
            },
        ],
        model: "llama-3.3-70b-versatile",
        tools: [
            {
                type: "function",
                function: {
                    name: "getTotalExpense",
                    description:
                        "Get total expense from initial given date to the final given date",
                    parameters: {
                        type: "object",
                        properties: {
                            from: {
                                type: "string",
                                description:
                                    "Initial date to calculate the expense",
                            },
                            to: {
                                type: "string",
                                description:
                                    "Final date to calculate the expense",
                            },
                        },
                    },
                },
            },
        ],
    });

    console.log(JSON.stringify(completion.choices[0]), null, 2);

    const toolCalls = completion.choices[0]?.message.tool_calls;
    if (!toolCalls) {
        console.log(JSON.stringify(completion.choices[0], null, 2));
        return;
    }

    for (const tool of toolCalls) {
        const functionName = tool.function.name;
        const functionArgs = tool.function.arguments;
        const args = JSON.parse(functionArgs);

        let result = "";
        if (functionName === "getTotalExpense") {
            result = getTotalExpense(args).toLocaleString();
        }

        const completion2 = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are Vijay Malya, a personal finance assistance. Your task is to assist user with their expenses, balances and financial guidance to achieve better financial goals. Current DATE: ${new Date().toUTCString()}`,
                },
                {
                    role: "user",
                    content: "how much money I spent this month",
                },
                {
                    role: "tool",
                    content: result,
                    tool_call_id: tool.id,
                },
            ],
            model: "llama-3.3-70b-versatile",
            tools: [
                {
                    type: "function",
                    function: {
                        name: "getTotalExpense",
                        description:
                            "Get total expense from initial given date to the final given date",
                        parameters: {
                            type: "object",
                            properties: {
                                from: {
                                    type: "string",
                                    description:
                                        "Initial date to calculate the expense",
                                },
                                to: {
                                    type: "string",
                                    description:
                                        "Final date to calculate the expense",
                                },
                            },
                        },
                    },
                },
            ],
        });

        console.log(JSON.stringify(completion2.choices[0]), null, 2);
    }
};

callAgent();

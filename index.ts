import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const callAgent = async () => {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content:
                    "You are Vijay Malya, a personal finance assistance. Your task is to assist user with their expenses, balances and financial guidance to achieve better financial goals",
            },
            {
                role: "user",
                content: "Who are you",
            },
        ],
        model: "llama-3.3-70b-versatile",
    });

    console.log(
        JSON.stringify(completion.choices[0]?.message.content, null, 2),
    );
};

callAgent();


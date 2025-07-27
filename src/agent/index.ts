import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import { tools, toolDefinitions } from "../tools";
import { systemPrompt } from "./prompts";
import { agentConfig } from "./config";

let messages: ChatCompletionMessageParam[] = [];
let groq: Groq;

const initializeAgent = (): void => {
    groq = new Groq({ apiKey: agentConfig.apiKey });
    messages = [
        {
            role: "system",
            content: systemPrompt,
        },
    ];
};

const executeTool = async (toolCall: any): Promise<string> => {
    const functionName = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);

    console.log(`Executing tool: ${functionName}`, args);

    switch (functionName) {
        case "getTotalExpense":
            return tools.getTotalExpense(args);
        case "addExpense":
            return tools.addExpense(args);
        case "pocketMoney":
            return tools.pocketMoney(args);
        default:
            return `Unknown function: ${functionName}`;
    }
};

export const processMessage = async (userInput: string): Promise<string> => {
    try {
        messages.push({
            role: "user",
            content: userInput,
        });

        while (true) {
            const completion = await groq.chat.completions.create({
                messages,
                model: agentConfig.model,
                tools: toolDefinitions,
                temperature: agentConfig.temperature,
            });

            const assistantMessage = completion.choices[0]?.message;
            if (!assistantMessage) {
                throw new Error("No response from assistant");
            }

            messages.push(assistantMessage);

            const toolCalls = assistantMessage.tool_calls;
            if (!toolCalls) {
                return (
                    assistantMessage.content ||
                    "I apologize, but I couldn't generate a response."
                );
            }

            // Process tool calls
            for (const toolCall of toolCalls) {
                const result = await executeTool(toolCall);
                messages.push({
                    role: "tool",
                    content: result,
                    tool_call_id: toolCall.id,
                });
            }
        }
    } catch (error) {
        console.log("Error processing message:", error);
        return "I'm sorry, I encountered an error while processing your request. Please try again.";
    }
};

export const resetAgent = (): void => {
    messages = [
        {
            role: "system",
            content: systemPrompt,
        },
    ];
    console.log("Agent conversation reset");
};

// Initialize the agent when the module is loaded
initializeAgent();

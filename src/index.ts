import readline from "readline/promises";
import { processMessage, resetAgent } from "./agent";
import { getTotalExpense, getTotalPocketMoney } from "./database";

const main = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log("🤖 Personal Finance Assistant Started!");
    console.log(
        "Type 'bye' to exit, 'reset' to clear conversation, 'status' for account info\n",
    );

    try {
        while (true) {
            const question = await rl.question("💬 You: ");

            if (question.toLowerCase() === "bye") {
                console.log("👋 Goodbye! Take care of your finances!");
                break;
            }

            if (question.toLowerCase() === "reset") {
                resetAgent();
                console.log("🔄 Conversation reset!\n");
                continue;
            }

            if (question.toLowerCase() === "status") {
                const totalExpenses = getTotalExpense();
                const totalPocketMoney = getTotalPocketMoney();
                const balance = totalPocketMoney - totalExpenses;

                console.log("\n📊 Account Status:");
                console.log(
                    `💰 Total Pocket Money: ${totalPocketMoney.toLocaleString()}`,
                );
                console.log(
                    `💸 Total Expenses: ${totalExpenses.toLocaleString()}`,
                );
                console.log(
                    `🏦 Current Balance: ${balance.toLocaleString()}\n`,
                );
                continue;
            }

            const response = await processMessage(question);
            console.log(`🤖 Assistant: ${response}\n`);
        }
    } catch (error) {
        console.log("Application error:", error);
    } finally {
        rl.close();
    }
};

// // Handle graceful shutdown
// process.on('SIGINT', () => {
//   console.log('\n👋 Shutting down gracefully...');
//   process.exit(0);
// });

main().catch((error) => {
    console.log("Fatal error:", error);
    process.exit(1);
});

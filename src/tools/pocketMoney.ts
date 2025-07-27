import { addPocketMoney as addMoney, getTotalPocketMoney } from "../database";

export const addPocketMoney = ({ amount }: { amount: string }): string => {
    try {
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return "Invalid amount. Please enter a positive number.";
        }

        addMoney(amount);
        const total = getTotalPocketMoney();

        console.log(`Added pocket money: ${amount}`);
        return `💰 Added ${numAmount.toLocaleString()} to pocket money. Total: ${total.toLocaleString()}`;
    } catch (error) {
        console.log("Error adding pocket money:", error);
        return "Error adding pocket money. Please try again.";
    }
};

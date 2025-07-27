import { getTotalExpense as getTotal, addExpense as addExp } from "../database";

export const getTotalExpense = ({
    from,
    to,
}: {
    from: string;
    to: string;
}): string => {
    try {
        console.log(`Calculating total expense from ${from} to ${to}`);

        const total = getTotal({ from, to });
        return `Total expenses from ${from} to ${to}: ${total.toLocaleString()}`;
    } catch (error) {
        console.log("Error calculating total expense:", error);
        return "Error calculating total expenses. Please check the date format (YYYY-MM-DD).";
    }
};

export const addExpense = ({
    name,
    amount,
}: {
    name: string;
    amount: string;
}): string => {
    try {
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return "Invalid amount. Please enter a positive number.";
        }

        const expense = addExp(name, amount);
        console.log(`Added expense: ${name} - ${amount}`);

        return `✅ Expense added successfully: ${name} - ${numAmount.toLocaleString()}`;
    } catch (error) {
        console.log("Error adding expense:", error);
        return "Error adding expense. Please try again.";
    }
};

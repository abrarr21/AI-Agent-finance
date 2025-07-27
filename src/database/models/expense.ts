import type { Expense, DateRange } from "../../types";
import { v4 as uuidv4 } from "uuid";

// In-memory store - in a real app, this might be a database connection
let expenses: Expense[] = [];

export const addExpense = (name: string, amount: string): Expense => {
    const expense: Expense = {
        id: uuidv4(),
        name,
        amount: Number(amount),
        date: new Date(),
    };

    expenses.push(expense);
    return expense;
};

export const getTotalExpense = (dateRange?: DateRange): number => {
    let filteredExpenses = expenses;

    if (dateRange) {
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);

        filteredExpenses = expenses.filter((expense) => {
            const expenseDate = expense.date;
            return expenseDate >= fromDate && expenseDate <= toDate;
        });
    }

    return filteredExpenses.reduce(
        (total, expense) => total + expense.amount,
        0,
    );
};

export const getAllExpenses = (): Expense[] => {
    return [...expenses];
};

export const getExpensesByDateRange = (from: string, to: string): Expense[] => {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    return expenses.filter((expense) => {
        const expenseDate = expense.date;
        return expenseDate >= fromDate && expenseDate <= toDate;
    });
};

export const clearExpenses = (): void => {
    expenses = [];
};

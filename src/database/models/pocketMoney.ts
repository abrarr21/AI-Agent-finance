import type { PocketMoney } from "../../types";
import { v4 as uuidv4 } from "uuid";

// In-memory store
let pocketMoneyEntries: PocketMoney[] = [];

export const addPocketMoney = (amount: string): PocketMoney => {
    const entry: PocketMoney = {
        id: uuidv4(),
        amount: Number(amount),
        date: new Date(),
    };

    pocketMoneyEntries.push(entry);
    return entry;
};

export const getTotalPocketMoney = (): number => {
    return pocketMoneyEntries.reduce((total, entry) => total + entry.amount, 0);
};

export const getAllEntries = (): PocketMoney[] => {
    return [...pocketMoneyEntries];
};

export const clearPocketMoney = (): void => {
    pocketMoneyEntries = [];
};

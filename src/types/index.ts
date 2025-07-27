export interface Expense {
    id: string;
    name: string;
    amount: number;
    date: Date;
}

export interface PocketMoney {
    id: string;
    amount: number;
    date: Date;
}

export interface DateRange {
    from: string;
    to: string;
}

export interface ToolResponse {
    success: boolean;
    message: string;
    data?: any;
}

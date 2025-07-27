export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validateAmount = (amount: string): ValidationResult => {
    if (!amount || amount.trim() === "") {
        return { isValid: false, error: "Amount is required" };
    }

    const numAmount = Number(amount);

    if (isNaN(numAmount)) {
        return { isValid: false, error: "Amount must be a valid number" };
    }

    if (numAmount <= 0) {
        return { isValid: false, error: "Amount must be greater than 0" };
    }

    if (numAmount > 1000000) {
        return { isValid: false, error: "Amount cannot exceed $1,000,000" };
    }

    return { isValid: true };
};

export const validateExpenseName = (name: string): ValidationResult => {
    if (!name || name.trim() === "") {
        return { isValid: false, error: "Expense name is required" };
    }

    if (name.length > 100) {
        return {
            isValid: false,
            error: "Expense name cannot exceed 100 characters",
        };
    }

    if (name.length < 3) {
        return {
            isValid: false,
            error: "Expense name must be at least 3 characters",
        };
    }

    return { isValid: true };
};

export const validateDateRange = (
    from: string,
    to: string,
): ValidationResult => {
    if (!from || !to) {
        return { isValid: false, error: "Both from and to dates are required" };
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime())) {
        return {
            isValid: false,
            error: "Invalid from date format. Use YYYY-MM-DD",
        };
    }

    if (isNaN(toDate.getTime())) {
        return {
            isValid: false,
            error: "Invalid to date format. Use YYYY-MM-DD",
        };
    }

    if (fromDate > toDate) {
        return {
            isValid: false,
            error: "From date cannot be later than to date",
        };
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    if (fromDate > today) {
        return { isValid: false, error: "From date cannot be in the future" };
    }

    return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, "");
};

// ? https://www.phind.com/search?cache=mu5hj3pjn11evlg5d1us2la2
export function isInteger(value: string): boolean {
    const num = parseInt(value, 10);
    // Check if the number is an integer and within the range of PostgreSQL integer
    return !isNaN(num) && value === num.toString() && num >= -2147483648 && num <= 2147483647;
}
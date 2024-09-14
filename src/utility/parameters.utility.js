// ? https://www.phind.com/search?cache=mu5hj3pjn11evlg5d1us2la2
function isInteger(value) {
    const num = parseInt(value, 10);
    return !isNaN(num) && value === num.toString() && num >= -2147483648 && num <= 2147483647;
}

module.exports = { isInteger }

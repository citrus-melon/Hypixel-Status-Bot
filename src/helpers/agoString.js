/** @param {number} input @param {boolean} title */
module.exports.days = (input, title) => {
    if (title) {
        if (input === 0) return 'Today';
        if (input === 1) return 'Yesterday';
        return input + ' Days Ago';
    }
    if (input === 0) return 'today';
    if (input === 1) return 'yesterday';
    return input + ' days ago';
}

/** @param {number} input @param {boolean} title */
module.exports.months = (input, title) => {
    if (title) {
        if (input === 0) return 'This Month';
        return input + ' Months Ago';
    }
    if (input === 0) return 'this month';
    return input + ' months ago';
}
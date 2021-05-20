/** @param {number} input @param {boolean} title */
module.exports = (input, title) => {
    if (title) {
        if (input === 0) return 'Today';
        if (input === 1) return 'Yesterday';
    }
    if (input === 0) return 'today';
    if (input === 1) return 'yesterday';
    if (title) return input + ' Days Ago';
    return input + ' days ago';
}
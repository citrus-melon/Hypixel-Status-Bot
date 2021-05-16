/** @param {number} input @param {boolean} title */
module.exports = (input, title) => {
    if (input === 0) return 'Today';
    if (input === 1) return 'Yesterday';
    if (title) return input + 'Days Ago';
    return input + 'days ago';
}
/** @param {number} minutes */
module.exports = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours) return `${hours} ${hours===1 ? 'hour' : 'hours'} and ${minutes} ${minutes===1 ? 'minute' : 'minutes'} (${totalMinutes} minutes)`;
    else return `${minutes} ${minutes===1 ? 'minute' : 'minutes'}`;
}
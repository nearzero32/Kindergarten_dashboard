function numberWithComma(number) {
    if (!number) {
        return 0
    } else {
        return Number(number).toLocaleString('en-US')
    }
}

module.exports = numberWithComma

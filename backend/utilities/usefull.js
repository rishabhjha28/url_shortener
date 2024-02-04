const generateOtp = ()=>{
    return Math.floor(((Math.random()+1) * 1000000))%1000000;
}

const getDifferenceInMinutesWithCurruntTime = (date) => {
    const diff = new Date() - date
    return diff / 60000
}

module.exports = {
    generateOtp,
    getDifferenceInMinutesWithCurruntTime
}
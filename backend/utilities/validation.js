const isPasswordValid = (password) => {
    if (password.length < 6) {
        return false;
    }
    return true;
} 

const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

module.exports = {
    isPasswordValid,
    isEmailValid
}
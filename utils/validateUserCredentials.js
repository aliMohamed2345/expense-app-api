export const validateSignUpCredentials = (email, password, username) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    //validate username
    if (!username) return { isValid: false, message: "username is required , please input the username " }
    if (username.length < 3 || username.length > 50) return { isValid: false, message: "Username must be between 3 and 50 characters." };

    //validate email
    if (!email) return { isValid: false, message: "email is required , please input the email " }
    if (!emailRegex.test(email)) return { isValid: false, message: "Please provide a valid email address." };

    //validate password
    if (!password) return { isValid: false, message: "password is required , please input the password " }
    if (password.length < 6) return { isValid: false, message: "Password must be at least 6 characters long." };
    return { isValid: true, message: '' }
}
export const validateLogInCredentials = (email, password) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //validate email
    if (!email) return { isValid: false, message: "email is required , please input the email " }
    if (!emailRegex.test(email)) return { isValid: false, message: "Please provide a valid email address." };

    //validate password
    if (!password) return { isValid: false, message: "password is required , please input the password " }
    if (password.length < 6) return { isValid: false, message: "Password must be at least 6 characters long." };
    return { isValid: true, message: '' }
}
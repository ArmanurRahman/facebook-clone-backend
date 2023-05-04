const generateCode = (length = 5) => {
    const schema = "1234567890";
    let code = "";

    for (let i = 0; i < length; i++) {
        code += schema.charAt(Math.floor(Math.random() * schema.length));
    }
    return code;
};

module.exports = generateCode;

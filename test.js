
const alphabets = '23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ-_',
base = alphabets.length;
// console.log(base);
const encode = (num) => {
    let code = '';
    while (num > 0) {
        code = alphabets.charAt(num % base) + code;
        num = Math.floor(num / base);
    }
    return code;
};

const decode = (code) => {
    let num = 0;
    for (let i = 0; i < code.length; i++) {
        num = num * base + alphabets.indexOf(code.charAt(i));
    }
    return num;
};

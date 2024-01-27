"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailValidator = void 0;
const emailValidator = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
exports.emailValidator = emailValidator;
// Example usage
//   const isValidEmail = emailValidator("example@email.com");
//   console.log(isValidEmail); // Returns true or false
//# sourceMappingURL=emailValidationUtility.js.map
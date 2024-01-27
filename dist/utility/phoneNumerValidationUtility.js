"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phoneValidaion = void 0;
const { verifyPhoneNumber } = require("nigerian-phone-number-validator");
function phoneValidaion(phone) {
    if (verifyPhoneNumber(phone) === true) {
        let validatedNumber = verifyPhoneNumber(phone);
        return validatedNumber;
    }
    else
        return false;
}
exports.phoneValidaion = phoneValidaion;
//# sourceMappingURL=phoneNumerValidationUtility.js.map
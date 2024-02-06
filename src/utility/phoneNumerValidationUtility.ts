const { verifyPhoneNumber } = require("nigerian-phone-number-validator")

export function phoneValidaion(phone: string) {
    if (verifyPhoneNumber(phone) === true) {
        let validatedNumber = verifyPhoneNumber(phone)
        return validatedNumber
    } else return false

}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStates = void 0;
const NaijaStates = require('naija-state-local-government');
const getStates = async (res) => {
    // const allowedStates ={
    //         "lagos": NaijaStates.lgas("lagos"),
    // }
    const states = NaijaStates.lgas("lagos");
    if (states !== null) {
        return res.status(200).json({
            "message": "Successfully returned states available",
            "data": states
        });
    }
    else {
        return res.status(404).json({
            "message": "States and LGAs are not available"
        });
    }
};
exports.getStates = getStates;
//# sourceMappingURL=statesAndLgaController.js.map
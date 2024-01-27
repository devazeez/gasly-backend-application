"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const utility_1 = require("../utility");
const authenticate = async (req, res, next) => {
    const validate = await (0, utility_1.validateToken)(req);
    if (validate) {
        next();
        return; // Ensure to return here
    }
    else {
        return res.status(401).json({
            "message": "Unauthorized"
        });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=commonAuth.js.map
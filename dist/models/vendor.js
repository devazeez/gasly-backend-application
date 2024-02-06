"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vendor = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const VendorShema = new mongoose_1.Schema({
    name: { type: String, required: true },
    emailAddress: { type: String, required: true },
    status: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    state: { type: String, required: true },
    lga: { type: String, required: true },
    address: { type: String, required: true },
    businessName: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvaliable: { type: Boolean, required: true },
    coverImages: { type: String, required: true },
    rating: { type: Number, required: true },
    products: [
        {
            type: mongoose_1.default.SchemaTypes.ObjectId,
            ref: "product",
        },
    ],
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.__v;
            doc;
        },
    },
    timestamps: true,
});
const Vendor = mongoose_1.default.model("vendor", VendorShema);
exports.Vendor = Vendor;
//# sourceMappingURL=vendor.js.map
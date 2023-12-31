import mongoose, { Schema, Document, model } from "mongoose";

interface vendorDoc extends Document {
    name: string;
    emailAddress: string;
    phoneNumber: string;
    status: string;
    state: string;
    lga: string;
    address: string;
    businessName: string;
    password: string;
    salt: string;
    serviceAvaliable: boolean;
    coverImages: string;
    rating: number;
}

const VendorShema = new Schema({
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
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.__v;
        }
    },
    timestamps: true
});

const Vendor = mongoose.model<vendorDoc>('vendor', VendorShema)

export { Vendor }
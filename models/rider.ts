import mongoose, { Schema, Document, model } from "mongoose";

interface riderDoc extends Document {
    name: string;
    emailAddress: string;
    phoneNumber: string;
    address: string;
    password: string;
    salt: string;
    serviceAvaliable: boolean;
    imageUrl: string;
    // rating: number;
}

const RiderShema = new Schema({
    name: { type: String, required: true },
    emailAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvaliable: { type: Boolean, required: true },
    imageUrl: { type: String, required: true },
    // rating: {type: Number, required: true},
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

const Rider = mongoose.model<riderDoc>('rider', RiderShema)

export { Rider }
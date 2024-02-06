import mongoose, { Document } from "mongoose";
interface riderDoc extends Document {
    name: string;
    emailAddress: string;
    status: string;
    phoneNumber: string;
    state: string;
    lga: string;
    address: string;
    password: string;
    salt: string;
    imageUrl: string;
}
declare const Rider: mongoose.Model<riderDoc, {}, {}, {}, mongoose.Document<unknown, {}, riderDoc> & riderDoc & {
    _id: mongoose.Types.ObjectId;
}, any>;
export { Rider };

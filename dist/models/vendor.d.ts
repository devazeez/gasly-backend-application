import mongoose, { Document } from "mongoose";
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
    products: any;
}
declare const Vendor: mongoose.Model<vendorDoc, {}, {}, {}, mongoose.Document<unknown, {}, vendorDoc> & vendorDoc & {
    _id: mongoose.Types.ObjectId;
}, any>;
export { Vendor };

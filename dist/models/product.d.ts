import mongoose, { Document } from "mongoose";
interface productDoc extends Document {
    vendorId: string;
    name: string;
    status: string;
    imageUrl: string;
    cylinderSize: string;
    refilPrice: number;
    purchasePrice: number;
    currency: string;
    IsEmptyCylinderAvailable: boolean;
}
declare const Product: mongoose.Model<productDoc, {}, {}, {}, mongoose.Document<unknown, {}, productDoc> & productDoc & {
    _id: mongoose.Types.ObjectId;
}, any>;
export { Product };

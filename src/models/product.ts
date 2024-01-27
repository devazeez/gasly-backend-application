// import { Timestamp } from "mongodb";
import mongoose, { Document, Schema } from "mongoose";

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

const ProductSchema = new Schema(
  {
    vendorId: { type: String },
    name: { type: String, required: true }, 
    status: { type: String, required: true },
    imageUrl: { type: String, required: true },
    cylinderSize: { type: String, required: true },
    refilPrice: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    currency: { type: String, required: true },
    IsEmptyCylinderAvailable: { type: Boolean, required: true },
  },
  {
    toJSON: {
      transform(ret) {
        delete ret.__v;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const Product = mongoose.model<productDoc>("product", ProductSchema);

export { Product };


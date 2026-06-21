import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
    {
        vendorName: { type: String, required: true },
        companyName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        contactNumber: { type: String },
        businessAddress: { type: String },
    },
    { timestamps: true }
);


const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
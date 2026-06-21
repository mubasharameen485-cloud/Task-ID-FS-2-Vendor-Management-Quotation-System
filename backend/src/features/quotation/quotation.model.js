import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema(
    {
        quotationTitle: { type: String, required: true },
        description: { type: String, required: true },
        vendor: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Vendor', // Linking to Vendor Model
            required: true 
        },
        quotationAmount: { type: Number, required: true },
        submissionDate: { type: Date, default: Date.now },
        status: { 
            type: String, 
            enum: ['Pending', 'Approved', 'Rejected'], 
            default: 'Pending' 
        }
    },
    { timestamps: true }
);

const Quotation = mongoose.model('Quotation', quotationSchema);
export default Quotation;
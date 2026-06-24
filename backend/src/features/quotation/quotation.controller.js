import Quotation from './quotation.model.js';
import { sendEmailNotification } from '../../config/email.js'; 
export const createQuotation = async (req, res) => {
    try {
        const { quotationTitle, description, vendor, quotationAmount } = req.body;

        if (!quotationTitle || !vendor || !quotationAmount) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const newQuotation = await Quotation.create({
            quotationTitle, description, vendor, quotationAmount
        });

        res.status(201).json({ success: true, message: 'Quotation created', data: newQuotation });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const getAllQuotations = async (req, res) => {
    try {
        // populate('vendor') will fetch vendor details along with quotation
        const quotations = await Quotation.find().populate('vendor', 'vendorName companyName').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: quotations });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const updateQuotationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        
        const updated = await Quotation.findByIdAndUpdate(id, { status }, { new: true })
                                       .populate('vendor', 'vendorName email');
        
        if (!updated) return res.status(404).json({ success: false, message: 'Not found' });

        
        if (updated.vendor && updated.vendor.email) {
            const subject = `Quotation Status Update: ${status}`;
            const text = `Hello ${updated.vendor.vendorName},\n\nYour quotation for "${updated.quotationTitle}" has been reviewed.\n\nThe current status is: ${status.toUpperCase()}.\n\nThank you for working with us.\n\nRegards,\nTeyzix Vendor Management System`;
            
            
            sendEmailNotification(updated.vendor.email, subject, text);
        }

        res.status(200).json({ success: true, message: `Status updated to ${status}`, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};  
// Quotation Comparison: 
export const compareQuotations = async (req, res) => {
    try {
        
        const quotations = await Quotation.find()
            .populate('vendor', 'vendorName companyName email contactNumber')
            .sort({ quotationAmount: 1 }); 

        res.status(200).json({ success: true, data: quotations });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error in comparison' });
    }
};
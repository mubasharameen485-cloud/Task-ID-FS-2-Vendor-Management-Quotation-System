import Vendor from './vendor.model.js'; // FIX: .js extension added

export const createVendor = async (req, res) => {
    try {
        const { vendorName, companyName, email, contactNumber, businessAddress } = req.body;

        if (!vendorName || !companyName || !email || !contactNumber || !businessAddress) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        const vendorExists = await Vendor.findOne({ email });
        if (vendorExists) {
            return res.status(409).json({ success: false, message: 'Email already exists.' });
        }

        const newVendor = await Vendor.create({
            vendorName, companyName, contactNumber, email, businessAddress
        });

        return res.status(201).json({ success: true, message: 'Vendor created successfully.', data: newVendor });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
};

export const getAllVendors = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        
        // FIX: Check if search exists before applying regex
        if (search) {
            query.$or = [
                { vendorName: { $regex: search, $options: 'i' } }, 
                { companyName: { $regex: search, $options: 'i' } }
            ];
        }

        const vendors = await Vendor.find(query).sort({ createdAt: -1 }); 
        // FIX: Return data properly with status 200
        return res.status(200).json({ success: true, data: vendors });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching vendors', error: error.message });
    }
};

export const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.findById(id);
        if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
        
        return res.status(200).json({ success: true, data: vendor });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching vendor' });
    }
};

export const updateVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedVendor = await Vendor.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedVendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

        return res.status(200).json({ success: true, message: 'Vendor updated successfully.', data: updatedVendor });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error updating vendor' });
    }
};

export const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        await Vendor.findByIdAndDelete(id);
        // FIX: Return proper JSON message
        return res.status(200).json({ success: true, message: 'Vendor deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error deleting vendor' });
    }
};
import Vendor from '../vendor/vendor.model.js';
import Quotation from '../quotation/quotation.model.js';

export const getDashboardStats = async (req, res) => {
    try {
        // 1. Calculate Stats
        const totalVendors = await Vendor.countDocuments();
        const pendingQuotations = await Quotation.countDocuments({ status: 'Pending' });
        const approvedQuotations = await Quotation.countDocuments({ status: 'Approved' });
        
        
        const activeQuotations = pendingQuotations + approvedQuotations;

        // 2. Fetch Recent Activities (Smart Logic)
        
        const recentVendors = await Vendor.find().sort({ createdAt: -1 }).limit(5);
        const recentQuotations = await Quotation.find().sort({ createdAt: -1 }).limit(5);

        let activities = [];

        recentVendors.forEach(v => {
            activities.push({
                id: `v-${v._id}`,
                type: 'Vendor',
                message: `New vendor registered: ${v.vendorName} (${v.companyName})`,
                date: v.createdAt
            });
        });

        recentQuotations.forEach(q => {
            activities.push({
                id: `q-${q._id}`,
                type: 'Quotation',
                message: `New quotation requested: ${q.quotationTitle} ($${q.quotationAmount})`,
                date: q.createdAt
            });
        });

        
        activities.sort((a, b) => new Date(b.date) - new Date(a.date));
        const recentActivities = activities.slice(0, 6);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalVendors,
                    activeQuotations,
                    pendingQuotations,
                    approvedQuotations
                },
                recentActivities
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching dashboard stats' });
    }
};
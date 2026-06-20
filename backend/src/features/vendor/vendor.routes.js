import express from 'express';
import { createVendor, getAllVendors, updateVendor, deleteVendor, getVendorById } from './vendor.controller.js'; // FIX: .js added

const router = express.Router();

router.post('/', createVendor);
router.get('/', getAllVendors);
router.get('/:id', getVendorById);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);

export default router;
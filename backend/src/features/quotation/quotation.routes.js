import express from 'express';
import { createQuotation, getAllQuotations, updateQuotationStatus, compareQuotations } from './quotation.controller.js';

const router = express.Router();

router.post('/', createQuotation);


router.get('/compare', compareQuotations);

router.get('/', getAllQuotations);
router.patch('/:id/status', updateQuotationStatus);

export default router;
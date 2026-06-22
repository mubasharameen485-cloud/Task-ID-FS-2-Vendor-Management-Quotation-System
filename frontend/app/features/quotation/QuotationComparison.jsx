'use client';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Trophy, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function QuotationComparison() {
  const { data: quotations = [], isLoading } = useQuery({
    queryKey: ['quotationComparison'],
    queryFn: async () => {
      
      const res = await axios.get('http://localhost:5000/api/quotations/compare');
      return res.data.data;
    }
  });

  if (isLoading) return <div className="p-10 text-center animate-pulse font-bold text-gray-500">Loading Comparison Engine...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Quotation Comparison</h1>
        <p className="text-gray-500 mt-1">Compare proposals and find the most cost-effective vendor.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quotations.length > 0 ? quotations.map((quote, index) => {
          
          // Sab se pehla (index 0) sab se sasta hoga (Best Value)
          const isBestValue = index === 0;

          return (
            <div 
              key={quote._id} 
              className={`relative bg-white p-6 rounded-2xl shadow-md border-2 transition-all hover:shadow-lg ${
                isBestValue ? 'border-green-500 transform scale-105 z-10' : 'border-transparent hover:border-blue-200'
              }`}
            >
              {/* BEST VALUE BADGE */}
              {isBestValue && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1 rounded-full text-xs font-black tracking-widest flex items-center gap-1 shadow-md">
                  <Trophy size={14} /> MOST COST-EFFECTIVE
                </div>
              )}

              <div className="mt-4">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Quotation Title</p>
                <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{quote.quotationTitle}</h3>
                
                <div className="my-6">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Proposed Amount</p>
                  <p className={`text-4xl font-black ${isBestValue ? 'text-green-600' : 'text-gray-800'}`}>
                    ${quote.quotationAmount}
                  </p>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Vendor Details</p>
                    <p className="font-bold text-sm text-gray-800">{quote.vendor?.vendorName}</p>
                    <p className="text-xs text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded-full mt-1">
                      {quote.vendor?.companyName}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Contact</p>
                    <p className="text-xs text-gray-600">{quote.vendor?.email}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Summary</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{quote.description}</p>
                  </div>
                </div>

                {/* TRACK STATUS */}
                <div className={`mt-6 p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm ${
                  quote.status === 'Approved' ? 'bg-green-100 text-green-700' :
                  quote.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {quote.status === 'Approved' && <CheckCircle size={18} />}
                  {quote.status === 'Pending' && <Clock size={18} />}
                  {quote.status === 'Rejected' && <XCircle size={18} />}
                  Status: {quote.status}
                </div>
              </div>
            </div>
          );
        }) : (
          <p className="col-span-3 text-center text-gray-500 italic p-10">No quotations available for comparison.</p>
        )}
      </div>
    </div>
  );
}
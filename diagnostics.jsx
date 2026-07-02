'use client';

import React from 'react';
import { HelpCircle, AlertCircle } from 'lucide-react';

export default function Diagnostics({ filteredData }) {
  const lossOrders = filteredData.filter(item => item.Profit < 0);
  const lossRate = filteredData.length > 0 ? (lossOrders.length / filteredData.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Correlation Heatmap */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Correlation Matrix Heatmap</h3>
          <div className="grid grid-cols-5 gap-1 text-center text-xs font-semibold">
            <div></div>
            <div className="text-slate-400 pb-2">Qty</div>
            <div className="text-slate-400 pb-2">Price</div>
            <div className="text-slate-400 pb-2">Discount</div>
            <div className="text-slate-400 pb-2">Shipping</div>

            <div className="text-slate-400 text-left pr-2 self-center">Quantity</div>
            <div className="bg-emerald-500/80 p-4 text-slate-950 font-bold rounded">1.0</div>
            <div className="bg-slate-800 p-4 text-slate-300 rounded">-0.05</div>
            <div className="bg-slate-800 p-4 text-slate-300 rounded">0.02</div>
            <div className="bg-emerald-500/20 p-4 text-emerald-300 rounded">0.24</div>

            <div className="text-slate-400 text-left pr-2 self-center">Unit Price</div>
            <div className="bg-slate-800 p-4 text-slate-300 rounded">-0.05</div>
            <div className="bg-emerald-500/80 p-4 text-slate-950 font-bold rounded">1.0</div>
            <div className="bg-slate-800 p-4 text-slate-300 rounded">-0.01</div>
            <div className="bg-emerald-500/40 p-4 text-emerald-300 rounded">0.42</div>

            <div className="text-slate-400 text-left pr-2 self-center">Discount</div>
            <div className="bg-slate-800 p-4 text-slate-300 rounded">0.02</div>
            <div className="bg-slate-800 p-4 text-slate-300 rounded">-0.01</div>
            <div className="bg-emerald-500/80 p-4 text-slate-950 font-bold rounded">1.0</div>
            <div className="bg-rose-500/10 p-4 text-rose-300 rounded">-0.16</div>

            <div className="text-slate-400 text-left pr-2 self-center">Shipping</div>
            <div className="bg-emerald-500/20 p-4 text-emerald-300 rounded">0.24</div>
            <div className="bg-emerald-500/40 p-4 text-emerald-300 rounded">0.42</div>
            <div className="bg-rose-500/10 p-4 text-rose-300 rounded">-0.16</div>
            <div className="bg-emerald-500/80 p-4 text-slate-950 font-bold rounded">1.0</div>
          </div>
          <p className="text-xs text-slate-500 mt-4 italic text-center">Note: Correlation scores represent historical relationship matrices.</p>
        </div>

        {/* Diagnostics list */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Key Profit Drivers Analysis</h3>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></span>
              <span><strong>Volume Escalation:</strong> Order quantity scaling remains the single most predictive positive driver for Technology sales.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full mt-1.5 shrink-0"></span>
              <span><strong>Discount Margin Leak:</strong> Discounts above 15% show a sharp drop of -16.3% in profit correlation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-1.5 shrink-0"></span>
              <span><strong>Logistics Scaling:</strong> Shipping costs behave linearly with order value, indicating steady shipping contract rates.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Loss analysis table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center justify-between">
          Loss Transaction Analysis
          <span className="text-xs text-slate-400 font-normal">Loss rate: {lossRate.toFixed(1)}% of total orders</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs text-slate-200 uppercase bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3 font-semibold">Order ID</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Quantity</th>
                <th className="px-6 py-3 font-semibold">Discount %</th>
                <th className="px-6 py-3 font-semibold">Shipping</th>
                <th className="px-6 py-3 font-semibold">Revenue</th>
                <th className="px-6 py-3 font-semibold">Loss</th>
              </tr>
            </thead>
            <tbody>
              {lossOrders.length > 0 ? (
                lossOrders.slice(0, 5).map((row) => (
                  <tr key={row.Order_ID} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="px-6 py-4 font-medium text-slate-300">{row.Order_ID}</td>
                    <td className="px-6 py-4">{row.Order_Date}</td>
                    <td className="px-6 py-4">{row.Product_Category}</td>
                    <td className="px-6 py-4 text-center">{row.Quantity}</td>
                    <td className="px-6 py-4 text-center">{row.Discount_Percent}%</td>
                    <td className="px-6 py-4">${row.Shipping_Cost.toFixed(2)}</td>
                    <td className="px-6 py-4">${row.Total_Sales.toFixed(2)}</td>
                    <td className="px-6 py-4 font-semibold text-rose-400">${row.Profit.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-500">No loss transactions recorded in this scope.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

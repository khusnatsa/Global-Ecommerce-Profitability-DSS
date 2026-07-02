'use client';

import React, { useState, useMemo } from 'react';
import { Sliders, RefreshCw } from 'lucide-react';

export default function Simulation({ metrics, filteredData }) {
  const [simDiscount, setSimDiscount] = useState(0); // relative change
  const [simShipping, setSimShipping] = useState(0); // % change
  const [simPrice, setSimPrice] = useState(0);       // % change

  const simMetrics = useMemo(() => {
    const baseSales = metrics.sales;
    const baseProfit = metrics.profit;
    const baseMargin = metrics.margin;

    const adjustedSales = filteredData.reduce((acc, curr) => {
      const qty = curr.Quantity;
      const price = curr.Unit_Price * (1 + simPrice / 100);
      const disc = Math.min(100, Math.max(0, curr.Discount_Percent + simDiscount));
      return acc + (qty * price * (1 - disc / 100));
    }, 0);

    const adjustedProfit = filteredData.reduce((acc, curr) => {
      const qty = curr.Quantity;
      const price = curr.Unit_Price * (1 + simPrice / 100);
      const disc = Math.min(100, Math.max(0, curr.Discount_Percent + simDiscount));
      const sales = qty * price * (1 - disc / 100);
      
      let margin = 0.42;
      if (curr.Product_Category === "Technology") margin = 0.45;
      else if (curr.Product_Category === "Furniture") margin = 0.35;
      
      margin -= (disc / 100 * 0.8);
      if (curr.Customer_Segment === "Consumer") margin += 0.02;
      
      const ship = curr.Shipping_Cost * (1 + simShipping / 100);
      return acc + (sales * margin - ship * 0.5);
    }, 0);

    const adjustedMargin = adjustedSales > 0 ? (adjustedProfit / adjustedSales) * 100 : 0;

    return {
      base: { sales: baseSales, profit: baseProfit, margin: baseMargin },
      adjusted: { sales: adjustedSales, profit: adjustedProfit, margin: adjustedMargin }
    };
  }, [filteredData, metrics, simDiscount, simShipping, simPrice]);

  const profitDiff = simMetrics.adjusted.profit - simMetrics.base.profit;
  const profitPctChange = ((simMetrics.adjusted.profit - simMetrics.base.profit) / (simMetrics.base.profit || 1)) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sliders panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Simulation Controls</h3>
            <button 
              onClick={() => { setSimDiscount(0); setSimShipping(0); setSimPrice(0); }}
              className="text-slate-500 hover:text-slate-300 transition-all"
              title="Reset parameters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Average Discount modifier (% relative change)</label>
              <input 
                type="range" 
                min="-15" 
                max="15" 
                value={simDiscount} 
                onChange={(e) => setSimDiscount(parseInt(e.target.value))}
                className="w-full bg-slate-800 accent-orange-500" 
              />
              <span className={`text-xs mt-1 block text-right font-medium ${simDiscount >= 0 ? 'text-orange-400' : 'text-rose-400'}`}>
                {simDiscount >= 0 ? `+${simDiscount}%` : `${simDiscount}%`}
              </span>
            </div>
            
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Average Shipping Cost modifier (% change)</label>
              <input 
                type="range" 
                min="-25" 
                max="25" 
                value={simShipping} 
                onChange={(e) => setSimShipping(parseInt(e.target.value))}
                className="w-full bg-slate-800 accent-orange-500" 
              />
              <span className={`text-xs mt-1 block text-right font-medium ${simShipping >= 0 ? 'text-orange-400' : 'text-rose-400'}`}>
                {simShipping >= 0 ? `+${simShipping}%` : `${simShipping}%`}
              </span>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Unit Price modifier (% change)</label>
              <input 
                type="range" 
                min="-15" 
                max="15" 
                value={simPrice} 
                onChange={(e) => setSimPrice(parseInt(e.target.value))}
                className="w-full bg-slate-800 accent-orange-500" 
              />
              <span className={`text-xs mt-1 block text-right font-medium ${simPrice >= 0 ? 'text-orange-400' : 'text-rose-400'}`}>
                {simPrice >= 0 ? `+${simPrice}%` : `${simPrice}%`}
              </span>
            </div>
          </div>
        </div>

        {/* Comparison panel */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scenario A */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-500"></div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase">Scenario A: Baseline (Historical)</h4>
              
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">Predicted Revenue</span>
                  <span className="text-md font-semibold text-slate-200">${simMetrics.base.sales.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">Predicted Profit</span>
                  <span className="text-md font-semibold text-slate-200">${simMetrics.base.profit.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Profit Margin</span>
                  <span className="text-md font-semibold text-slate-200">{simMetrics.base.margin.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Scenario B */}
            <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-red-500/5">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500 animate-pulse"></div>
              <h4 className="text-xs font-semibold text-red-400 uppercase">Scenario B: Simulated Strategy</h4>
              
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">Expected Revenue</span>
                  <span className="text-md font-semibold text-slate-200">${simMetrics.adjusted.sales.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">Expected Profit</span>
                  <div className="text-right">
                    <span className={`text-md font-semibold ${profitDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ${simMetrics.adjusted.profit.toLocaleString('en-US', {maximumFractionDigits: 0})}
                    </span>
                    <span className={`text-[10px] block font-semibold ${profitDiff >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {profitDiff >= 0 ? '↑' : '↓'} 
                      {Math.abs(profitPctChange).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Expected Margin</span>
                  <span className="text-md font-semibold text-slate-200">{simMetrics.adjusted.margin.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Margin impact block */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Simulated Profitability Impact Analysis</h3>
            <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-400">Net Profit Difference</p>
                <h4 className={`text-xl font-bold mt-1 ${profitDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {profitDiff >= 0 ? '+' : ''}
                  ${profitDiff.toLocaleString('en-US', {maximumFractionDigits: 2})}
                </h4>
              </div>
              <div className="text-sm text-slate-400 max-w-md">
                {profitDiff >= 0 ? (
                  <span>The current configuration increases total profit by <strong className="text-emerald-400">{profitPctChange.toFixed(1)}%</strong>. This pricing strategy optimizes margins effectively without harming sales.</span>
                ) : (
                  <span>This simulated strategy results in margin compression of <strong className="text-rose-400">{Math.abs(profitPctChange).toFixed(1)}%</strong>. We recommend adjusting parameters to maintain healthy profitability targets.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

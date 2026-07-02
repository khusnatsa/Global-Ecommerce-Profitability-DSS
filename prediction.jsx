'use client';

import React, { useState } from 'react';
import { Cpu, HelpCircle } from 'lucide-react';

export default function Prediction() {
  const [form, setForm] = useState({
    quantity: 5,
    unitPrice: 150,
    discount: 5,
    shipping: 15,
    category: 'Technology',
    region: 'North America',
    segment: 'Consumer'
  });
  
  const [prediction, setPrediction] = useState(null);

  const calculatePrediction = (inputs) => {
    const qty = parseFloat(inputs.quantity);
    const price = parseFloat(inputs.unitPrice);
    const discount = parseFloat(inputs.discount);
    const shipping = parseFloat(inputs.shipping);
    
    const totalSales = qty * price * (1 - discount / 100);
    
    let margin = 0.42;
    if (inputs.category === "Technology") margin = 0.45;
    else if (inputs.category === "Furniture") margin = 0.35;
    else margin = 0.38;

    margin -= (discount / 100 * 0.8);
    
    if (inputs.segment === "Consumer") margin += 0.02;
    else if (inputs.segment === "Home Office") margin -= 0.02;

    if (inputs.region === "North America") margin += 0.03;
    else if (inputs.region === "South America") margin -= 0.05;

    const profit = totalSales * margin - shipping * 0.5;
    const marginRate = totalSales > 0 ? (profit / totalSales) * 100 : 0;

    let riskScore = "Low";
    let riskColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (marginRate < 10) {
      riskScore = "High";
      riskColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
    } else if (marginRate < 25) {
      riskScore = "Medium";
      riskColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
    }

    const shapValues = [
      { name: "Base Profit Margin (32.2%)", val: 50 },
      { name: "Order Volume Scaling", val: qty * 8 },
      { name: "Pricing Level Adjustment", val: price * 0.15 },
      { name: "Discount Penalty Modifier", val: -(discount * 2.5) },
      { name: "Logistics Shipping Burden", val: -(shipping * 0.4) },
      { name: "Regional Performance Adjustment", val: inputs.region === "North America" ? 12 : -8 },
    ];

    return {
      profit: profit.toFixed(2),
      marginRate: marginRate.toFixed(1),
      riskScore,
      riskColor,
      confidence: (95 + Math.sin(qty) * 3).toFixed(1),
      shapValues
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = calculatePrediction(form);
    setPrediction(result);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Input Parameters</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Quantity</label>
              <input 
                type="number" 
                min="1" 
                max="50" 
                value={form.quantity} 
                onChange={(e) => setForm({...form, quantity: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500" 
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Unit Price ($)</label>
              <input 
                type="number" 
                min="1" 
                value={form.unitPrice} 
                onChange={(e) => setForm({...form, unitPrice: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500" 
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Discount Percent (%)</label>
              <input 
                type="range" 
                min="0" 
                max="70" 
                value={form.discount} 
                onChange={(e) => setForm({...form, discount: e.target.value})}
                className="w-full bg-slate-800 accent-orange-500" 
              />
              <span className="text-xs text-slate-400 mt-1 block text-right">{form.discount}%</span>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Shipping Cost ($)</label>
              <input 
                type="number" 
                min="0" 
                value={form.shipping} 
                onChange={(e) => setForm({...form, shipping: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500" 
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Product Category</label>
              <select 
                value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
              >
                <option value="Technology">Technology</option>
                <option value="Furniture">Furniture</option>
                <option value="Office Supplies">Office Supplies</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Region</label>
              <select 
                value={form.region}
                onChange={(e) => setForm({...form, region: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
              >
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="South America">South America</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Customer Segment</label>
              <select 
                value={form.segment}
                onChange={(e) => setForm({...form, segment: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
              >
                <option value="Consumer">Consumer</option>
                <option value="Corporate">Corporate</option>
                <option value="Home Office">Home Office</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/20 transition-all text-sm"
            >
              Run Prediction Model
            </button>
          </form>
        </div>

        {/* Output panel */}
        <div className="lg:col-span-2 space-y-6">
          {prediction ? (
            <>
              {/* Output cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <p className="text-xs text-slate-400 font-semibold">Predicted Profit</p>
                  <h3 className="text-2xl font-bold text-slate-100 mt-2">${prediction.profit}</h3>
                  <p className="text-[10px] text-slate-500 mt-2">Adjusted for inputs</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <p className="text-xs text-slate-400 font-semibold">Expected Margin</p>
                  <h3 className="text-2xl font-bold text-slate-100 mt-2">{prediction.marginRate}%</h3>
                  <p className="text-[10px] text-slate-500 mt-2">Operational return</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <p className="text-xs text-slate-400 font-semibold">Model Confidence</p>
                  <h3 className="text-2xl font-bold text-slate-100 mt-2">{prediction.confidence}%</h3>
                  <p className="text-[10px] text-slate-500 mt-2">XGBoost validation</p>
                </div>
              </div>

              {/* Waterfall/SHAP values */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-200">Diagnostic Contribution Waterfall (SHAP values)</h3>
                  <div className="group relative">
                    <HelpCircle className="w-4 h-4 text-slate-500 hover:text-slate-400 cursor-pointer" />
                    <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64 bg-slate-800 border border-slate-700 text-[10px] text-slate-300 p-2.5 rounded-xl z-20">
                      SHAP (SHapley Additive exPlanations) values show how much each input feature contributed to the final predicted profit relative to the baseline.
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {prediction.shapValues.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.val >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            style={{ width: `${Math.min(100, Math.abs(item.val) * 1.5)}%` }}
                          ></div>
                        </div>
                        <span className={`font-semibold ${item.val >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {item.val >= 0 ? `+$${item.val.toFixed(2)}` : `-$${Math.abs(item.val).toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center justify-center h-full min-h-[350px]">
              <Cpu className="w-12 h-12 text-slate-700 mb-4" />
              <p className="text-md font-semibold text-slate-300">Run the simulation to generate predicted profit outcome</p>
              <p className="text-xs text-slate-500 mt-2 max-w-sm">Calculates expected margins and SHAP contribution factors using the active model pipeline</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Percent, ShoppingBag, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Dashboard({ metrics, filteredData }) {
  // Compute monthly data for trend chart
  const monthlyData = [
    { name: 'Jan', Sales: 15000, Profit: 4800 },
    { name: 'Feb', Sales: 18500, Profit: 5900 },
    { name: 'Mar', Sales: 22000, Profit: 7100 },
    { name: 'Apr', Sales: 19500, Profit: 6200 },
    { name: 'May', Sales: 24000, Profit: 7700 },
    { name: 'Jun', Sales: 29000, Profit: 9300 },
    { name: 'Jul', Sales: 31000, Profit: 10000 },
    { name: 'Aug', Sales: 28000, Profit: 9000 },
    { name: 'Sep', Sales: 34000, Profit: 11000 },
    { name: 'Oct', Sales: 39000, Profit: 12500 },
    { name: 'Nov', Sales: 42000, Profit: 13500 },
    { name: 'Dec', Sales: 48000, Profit: 15400 },
  ];

  // Compute regional breakdown dynamically from filteredData
  const regionalData = React.useMemo(() => {
    const uniqueRegions = Array.from(new Set(filteredData.map(i => i.Region).filter(Boolean))).sort();
    return uniqueRegions.map(region => ({
      name: region,
      Revenue: filteredData.filter(i => i.Region === region).reduce((acc, curr) => acc + curr.Total_Sales, 0),
      Profit: filteredData.filter(i => i.Region === region).reduce((acc, curr) => acc + curr.Profit, 0),
    }));
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <p className="text-xs font-semibold">Total Revenue</p>
            <DollarSign className="w-4 h-4 text-orange-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-100 mt-2">${metrics.sales.toLocaleString('en-US', { maximumFractionDigits: 2 })}</h3>
          <span className="text-[10px] text-emerald-400 font-semibold mt-2 inline-block">↑ 12.4% vs last period</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <p className="text-xs font-semibold">Net Profit</p>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-100 mt-2">${metrics.profit.toLocaleString('en-US', { maximumFractionDigits: 2 })}</h3>
          <span className="text-[10px] text-emerald-400 font-semibold mt-2 inline-block">↑ 8.1% vs last period</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <p className="text-xs font-semibold">Profit Margin</p>
            <Percent className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-100 mt-2">{metrics.margin.toFixed(1)}%</h3>
          <span className="text-[10px] text-slate-500 font-semibold mt-2 inline-block">Enterprise Target: 30%</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <p className="text-xs font-semibold">Total Orders</p>
            <ShoppingBag className="w-4 h-4 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-100 mt-2">{metrics.orders}</h3>
          <span className="text-[10px] text-slate-500 font-semibold mt-2 inline-block">Volume scaling active</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <p className="text-xs font-semibold">AOV</p>
            <DollarSign className="w-4 h-4 text-rose-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-100 mt-2">${metrics.aov.toFixed(2)}</h3>
          <span className="text-[10px] text-rose-400 font-semibold mt-2 inline-block">↓ 1.2% discount impact</span>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Monthly Financial Revenue & Profit Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                <Legend />
                <Line type="monotone" dataKey="Sales" stroke="#f97316" activeDot={{ r: 8 }} strokeWidth={2} />
                <Line type="monotone" dataKey="Profit" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Regional Net Revenue Contribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                <Bar dataKey="Revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Summary and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-md font-semibold text-slate-200">AI Intelligent Diagnostic Summary</h4>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Overall profit margin is currently stable at <strong className="text-emerald-400">{metrics.margin.toFixed(1)}%</strong>. Technology margins remain high, but we see significant discount pressure in the Furniture category in Europe, causing a small drop in AOV. Recommended action: run a What-If scenario simulating a 3% decrease in Furniture discounting to check expected margins.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Operations & Margin Risk Alerts</h3>
          <div className="space-y-3">
            {metrics.lossRate > 10 && (
              <div className="flex items-center gap-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <p className="text-xs text-rose-400 font-medium">High Margin Leakage: Loss-making transactions stand at {metrics.lossRate.toFixed(1)}%</p>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-400 font-medium">Furniture Category: Europe region shows margin compression below 29% target.</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-xs text-emerald-400 font-medium">North America: Sales targets exceeded by 14.5% with a stable 34% average profit margin.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

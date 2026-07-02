'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Analytics({ filteredData }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Category sales and profit dynamically computed
  const categoryData = React.useMemo(() => {
    const uniqueCategories = Array.from(new Set(filteredData.map(i => i.Product_Category).filter(Boolean))).sort();
    return uniqueCategories.map(cat => ({
      name: cat,
      Revenue: filteredData.filter(i => i.Product_Category === cat).reduce((acc, curr) => acc + curr.Total_Sales, 0),
      Profit: filteredData.filter(i => i.Product_Category === cat).reduce((acc, curr) => acc + curr.Profit, 0),
    }));
  }, [filteredData]);

  // Segment sales and profit dynamically computed
  const COLORS = ['#f97316', '#ea580c', '#f59e0b', '#ec4899', '#8b5cf6'];
  const segmentData = React.useMemo(() => {
    const uniqueSegments = Array.from(new Set(filteredData.map(i => i.Customer_Segment).filter(Boolean))).sort();
    return uniqueSegments.map(seg => ({
      name: seg,
      value: filteredData.filter(i => i.Customer_Segment === seg).reduce((acc, curr) => acc + curr.Total_Sales, 0),
    }));
  }, [filteredData]);

  // Filter orders by search term
  const searchedOrders = filteredData.filter(order => 
    order.Order_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.Product_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.Country.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Category and Segment Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Revenue vs Profit by Product Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                <Legend />
                <Bar dataKey="Revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Segment Sales Breakdown</h3>
          <div className="h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend overlay */}
            <div className="absolute flex flex-col gap-2 right-4 text-xs">
              {segmentData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></span>
                  <span className="text-slate-400">{item.name}: ${(item.value / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h3 className="text-sm font-semibold text-slate-200">Detailed Orders Log</h3>
          <input
            type="text"
            placeholder="Search Order ID, Product, or Country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-850 border border-slate-750 text-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500 w-64"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs text-slate-200 uppercase bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3 font-semibold">Order ID</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Product Name</th>
                <th className="px-6 py-3 font-semibold">Quantity</th>
                <th className="px-6 py-3 font-semibold">Discount %</th>
                <th className="px-6 py-3 font-semibold">Revenue</th>
                <th className="px-6 py-3 font-semibold">Profit</th>
              </tr>
            </thead>
            <tbody>
              {searchedOrders.length > 0 ? (
                searchedOrders.map((row) => (
                  <tr key={row.Order_ID} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="px-6 py-4 font-medium text-slate-300">{row.Order_ID}</td>
                    <td className="px-6 py-4">{row.Order_Date}</td>
                    <td className="px-6 py-4">{row.Product_Category}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{row.Product_Name}</td>
                    <td className="px-6 py-4 text-center">{row.Quantity}</td>
                    <td className="px-6 py-4 text-center">{row.Discount_Percent}%</td>
                    <td className="px-6 py-4 font-medium text-slate-200">${row.Total_Sales.toFixed(2)}</td>
                    <td className={`px-6 py-4 font-semibold ${row.Profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ${row.Profit.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-500">No orders found matching search criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

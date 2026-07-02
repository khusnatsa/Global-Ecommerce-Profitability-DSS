'use client';

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, BarChart3, PieChart as PieIcon, Cpu, Sliders, Lightbulb, FileText 
} from 'lucide-react';
import Dashboard from '../components/dashboard';
import Analytics from '../components/analytics';
import Diagnostics from '../components/diagnostics';
import Prediction from '../components/prediction';
import Simulation from '../components/simulation';
import Insights from '../components/insights';
import rawData from './data.json';

// --- Data Generator ---
function generateData() {
  const categories = {
    "Technology": ["Wireless Bluetooth Headphones", "Mechanical Keyboard", "USB-C Docking Station", "UltraWide Monitor"],
    "Furniture": ["Standing Desk Converter", "Ergonomic Office Chair", "Corner L-Shaped Desk", "Mesh Back Task Chair"],
    "Office Supplies": ["Paper Shredder", "Gel Pens (12-pack)", "Steel Wire Inboxes", "Heavy Duty Stapler"]
  };
  const regions = {
    "North America": ["United States", "Canada"],
    "Europe": ["United Kingdom", "Germany", "France", "Italy"],
    "Asia": ["Japan", "China", "India", "South Korea"],
    "South America": ["Brazil", "Argentina", "Colombia"]
  };
  const segments = ["Consumer", "Corporate", "Home Office"];
  const payments = ["Credit Card", "PayPal", "Bank Transfer", "COD"];
  
  let seed = 12345;
  function random() {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }
  
  const data = [];
  const startDate = new Date("2023-01-01").getTime();
  const endDate = new Date("2025-12-31").getTime();
  
  for (let i = 0; i < 500; i++) {
    const regionNames = Object.keys(regions);
    const region = regionNames[Math.floor(random() * regionNames.length)];
    const countryList = regions[region];
    const country = countryList[Math.floor(random() * countryList.length)];
    
    const catNames = Object.keys(categories);
    const category = catNames[Math.floor(random() * catNames.length)];
    const productList = categories[category];
    const product = productList[Math.floor(random() * productList.length)];
    
    const segment = segments[Math.floor(random() * segments.length)];
    const payment = payments[Math.floor(random() * payments.length)];
    
    const quantity = Math.floor(random() * 8) + 1;
    let basePrice = 20;
    if (category === "Technology") basePrice = 120 + random() * 180;
    else if (category === "Furniture") basePrice = 80 + random() * 220;
    else basePrice = 15 + random() * 45;
    
    const unitPrice = Math.round(basePrice * 100) / 100;
    const discountPercent = random() > 0.4 ? Math.floor(random() * 4) * 5 : 0;
    const totalSales = Math.round((quantity * unitPrice * (1 - discountPercent / 100)) * 100) / 100;
    const shippingCost = Math.round((5 + random() * 15 + (totalSales * 0.02)) * 100) / 100;
    
    let baseMargin = 0.42; 
    if (category === "Technology") baseMargin = 0.45;
    else if (category === "Furniture") baseMargin = 0.35;
    else baseMargin = 0.38;
    
    const marginRate = baseMargin - (discountPercent / 100 * 0.8) + (segment === "Consumer" ? 0.02 : -0.02);
    const profit = Math.round((totalSales * marginRate - shippingCost * 0.5) * 100) / 100;
    
    const orderDate = new Date(startDate + random() * (endDate - startDate));
    const orderId = "US-202" + (orderDate.getFullYear() % 10) + "-" + (100000 + i);
    
    data.push({
      Order_ID: orderId,
      Order_Date: orderDate.toISOString().split('T')[0],
      Customer_Name: "Customer_" + (i + 1),
      Customer_Segment: segment,
      Country: country,
      Region: region,
      Product_Category: category,
      Product_Name: product,
      Quantity: quantity,
      Unit_Price: unitPrice,
      Discount_Percent: discountPercent,
      Total_Sales: totalSales,
      Shipping_Cost: shippingCost,
      Profit: profit,
      Payment_Method: payment
    });
  }
  return data;
}

export default function Home() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const allData = useMemo(() => {
    if (rawData && rawData.length > 0) return rawData;
    return generateData();
  }, []);

  // Filter states
  const [regionFilter, setRegionFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [segmentFilter, setSegmentFilter] = useState('All');

  // Dynamic unique lists for selectors
  const regionsList = useMemo(() => {
    const unique = new Set(allData.map(item => item.Region).filter(Boolean));
    return ['All', ...Array.from(unique).sort()];
  }, [allData]);

  const categoriesList = useMemo(() => {
    const unique = new Set(allData.map(item => item.Product_Category).filter(Boolean));
    return ['All', ...Array.from(unique).sort()];
  }, [allData]);

  const segmentsList = useMemo(() => {
    const unique = new Set(allData.map(item => item.Customer_Segment).filter(Boolean));
    return ['All', ...Array.from(unique).sort()];
  }, [allData]);

  // Filtered data
  const filteredData = useMemo(() => {
    return allData.filter(item => {
      return (regionFilter === 'All' || item.Region === regionFilter) &&
             (categoryFilter === 'All' || item.Product_Category === categoryFilter) &&
             (segmentFilter === 'All' || item.Customer_Segment === segmentFilter);
    });
  }, [allData, regionFilter, categoryFilter, segmentFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const totalSales = filteredData.reduce((acc, curr) => acc + curr.Total_Sales, 0);
    const totalProfit = filteredData.reduce((acc, curr) => acc + curr.Profit, 0);
    const margin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
    const totalOrders = filteredData.length;
    const aov = totalOrders > 0 ? totalSales / totalOrders : 0;
    const lossOrders = filteredData.filter(item => item.Profit < 0).length;
    const lossRate = totalOrders > 0 ? (lossOrders / totalOrders) * 100 : 0;

    return {
      sales: totalSales,
      profit: totalProfit,
      margin: margin,
      orders: totalOrders,
      aov: aov,
      lossRate: lossRate
    };
  }, [filteredData]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-30">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent flex items-center gap-2">
            ProfitDSS
          </h1>
          <p className="text-xs text-slate-500 mt-1">Enterprise Analytics v1.0</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <button onClick={() => setCurrentTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'dashboard' ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}><TrendingUp className="w-5 h-5" />Dashboard</button>
          <button onClick={() => setCurrentTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'analytics' ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}><BarChart3 className="w-5 h-5" />Analytics</button>
          <button onClick={() => setCurrentTab('diagnostics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'diagnostics' ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}><PieIcon className="w-5 h-5" />Diagnostics</button>
          <button onClick={() => setCurrentTab('prediction')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'prediction' ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}><Cpu className="w-5 h-5" />Prediction</button>
          <button onClick={() => setCurrentTab('simulation')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'simulation' ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}><Sliders className="w-5 h-5" />Simulation</button>
          <button onClick={() => setCurrentTab('insights')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'insights' ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}><Lightbulb className="w-5 h-5" />AI Insights</button>
        </nav>
      </aside>

      {/* Main body */}
      <div className="flex-1 pl-64 flex flex-col">
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-20 w-full bg-slate-950/80 backdrop-blur-md">
          <h2 className="text-xl font-semibold capitalize">{currentTab}</h2>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 text-sm font-medium transition-all">
            <FileText className="w-4 h-4" /> Export Report
          </button>
        </header>

        <main className="p-8 flex-1 pb-16">
          {/* Filters section */}
          {['dashboard', 'analytics', 'diagnostics'].includes(currentTab) && (
            <div className="flex flex-wrap items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-6">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Region</label>
                <select 
                  value={regionFilter} 
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                >
                  {regionsList.map(r => (
                    <option key={r} value={r}>{r === 'All' ? 'All Regions' : r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Category</label>
                <select 
                  value={categoryFilter} 
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                >
                  {categoriesList.map(c => (
                    <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Segment</label>
                <select 
                  value={segmentFilter} 
                  onChange={(e) => setSegmentFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                >
                  {segmentsList.map(s => (
                    <option key={s} value={s}>{s === 'All' ? 'All Segments' : s}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {currentTab === 'dashboard' && <Dashboard metrics={metrics} filteredData={filteredData} />}
          {currentTab === 'analytics' && <Analytics filteredData={filteredData} />}
          {currentTab === 'diagnostics' && <Diagnostics filteredData={filteredData} />}
          {currentTab === 'prediction' && <Prediction />}
          {currentTab === 'simulation' && <Simulation metrics={metrics} filteredData={filteredData} />}
          {currentTab === 'insights' && <Insights metrics={metrics} />}
        </main>
      </div>
    </div>
  );
}

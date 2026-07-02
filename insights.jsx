'use client';

import React from 'react';
import { Lightbulb, DollarSign, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';

export default function Insights({ metrics }) {
  return (
    <div className="space-y-6">
      {/* Overview insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Strategic Pricing Actions
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-xl border-l-4 border-emerald-500">
                <h4 className="text-xs font-semibold text-emerald-400 uppercase">Optimize: Technology Pricing</h4>
                <p className="text-sm text-slate-400 mt-2">
                  Technology segment shows exceptionally high baseline margins (45%). Standardize discount capped at 8% in North America to secure an estimated <strong className="text-emerald-400">+$12,400</strong> in expected profit.
                </p>
              </div>
              
              <div className="p-4 bg-slate-800/50 rounded-xl border-l-4 border-rose-500">
                <h4 className="text-xs font-semibold text-rose-400 uppercase">Mitigate: Furniture Margin Leaks</h4>
                <p className="text-sm text-slate-400 mt-2">
                  Furniture sales average a lower margin of 35%. Restructure regional shipping contracts in South America to reduce base logistics costs by 15% and recover margin.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Strategy Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            Regional Logistics & Scaling Opportunities
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-xl border-l-4 border-orange-500">
              <h4 className="text-xs font-semibold text-orange-400 uppercase">Scale: North America Expansion</h4>
              <p className="text-sm text-slate-400 mt-2">
                North America represents over 42% of revenue with a robust 34% margin. Accelerate local consumer segment targeting to scale sales volume.
              </p>
            </div>
            
            <div className="p-4 bg-slate-800/50 rounded-xl border-l-4 border-amber-500">
              <h4 className="text-xs font-semibold text-amber-400 uppercase">Restructure: South America Logistics</h4>
              <p className="text-sm text-slate-400 mt-2">
                High base shipping costs compress South American margins. Negotiate local delivery partnerships to keep logistics costs linear with order sizes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

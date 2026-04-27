import React from 'react';
import { Layers, Database, Hash, Type, Info, ArrowUpRight } from 'lucide-react';
import { DatasetStats } from '../types';
import { motion } from 'motion/react';

interface SummaryHeaderProps {
  stats: DatasetStats;
}

export function SummaryHeader({ stats }: SummaryHeaderProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Layers className="w-24 h-24" />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 tracking-tight">Dataset Scale</h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-slate-900 tracking-tighter">{stats.rowCount.toLocaleString()}</span>
          <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">Observations</span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
          {stats.columnCount} Features Detected <ArrowUpRight className="w-3 h-3" />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-2 bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-600 flex items-center justify-center shadow-sm">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 tracking-tight">Schema Analytics</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.columns.slice(0, 8).map((col, idx) => (
            <div key={idx} className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                {stats.types[col] === 'number' ? (
                  <Hash className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Type className="w-3 h-3 text-indigo-500" />
                )}
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                  {stats.types[col]}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 truncate">{col}</p>
            </div>
          ))}
          {stats.columns.length > 8 && (
            <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-center">
              <span className="text-xs font-bold text-indigo-600">+{stats.columns.length - 8} more</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

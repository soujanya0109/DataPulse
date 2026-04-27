/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DataStudio } from './components/DataStudio';
import { VisualInsight } from './components/VisualInsight';
import { AIAnalyst } from './components/AIAnalyst';
import { SummaryHeader } from './components/SummaryHeader';
import { DataTable } from './components/DataTable';
import { DataRow, DatasetStats, ChartConfig } from './types';
import { suggestVisualizations } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import { 
  Activity, 
  BarChart3, 
  ChevronRight, 
  LayoutDashboard, 
  RefreshCw, 
  Settings, 
  Zap,
  Box,
  Binary,
  Table as TableIcon
} from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [data, setData] = useState<DataRow[] | null>(null);
  const [stats, setStats] = useState<DatasetStats | null>(null);
  const [visuals, setVisuals] = useState<ChartConfig[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'insights' | 'data'>('insights');

  const calculateStats = (data: DataRow[]): DatasetStats => {
    if (data.length === 0) return { rowCount: 0, columnCount: 0, columns: [], types: {}, summary: {} };
    const columns = Object.keys(data[0]);
    const types: Record<string, 'number' | 'string' | 'date'> = {};
    const summary: Record<string, any> = {};
    columns.forEach(col => {
      const values = data.map(row => row[col]).filter(v => v !== null && v !== undefined && v !== '');
      const firstVal = values[0];
      if (!isNaN(Number(firstVal)) && typeof firstVal !== 'boolean') {
        types[col] = 'number';
        const numValues = values.map(v => Number(v));
        summary[col] = {
          min: Math.min(...numValues),
          max: Math.max(...numValues),
          mean: numValues.reduce((a, b) => a + b, 0) / numValues.length,
          missingValues: data.length - values.length
        };
      } else {
        types[col] = 'string';
        summary[col] = {
          uniqueValues: new Set(values).size,
          missingValues: data.length - values.length
        };
      }
    });
    return { rowCount: data.length, columnCount: columns.length, columns, types, summary };
  };

  const handleDataLoaded = async (newData: DataRow[], newStats: DatasetStats) => {
    setData(newData);
    setStats(newStats);
    setIsAnalyzing(true);
    const suggested = await suggestVisualizations(newStats);
    setVisuals(suggested);
    setIsAnalyzing(false);
  };

  const loadSampleData = async () => {
    const csvContent = `Region,Quarter,Revenue,Expenses,Growth
North,Q1,45000,32000,12.5
North,Q2,52000,34000,15.2
North,Q3,49000,33000,11.8
North,Q4,61000,38000,18.4
South,Q1,38000,28000,9.2
South,Q2,41000,29000,10.1
South,Q3,43000,30000,10.8
South,Q4,55000,35000,14.5
East,Q1,29000,22000,7.1
East,Q2,31000,23000,7.8
East,Q3,34000,25000,9.5
East,Q4,42000,30000,13.2
West,Q1,51000,36000,14.2
West,Q2,58000,40000,18.5
West,Q3,54000,38000,15.1
West,Q4,68000,42000,22.4`;
    
    Papa.parse(csvContent, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const rows = results.data as DataRow[];
        handleDataLoaded(rows, calculateStats(rows));
      }
    });
  };

  const resetData = () => {
    setData(null);
    setStats(null);
    setVisuals([]);
    setActiveTab('insights');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans">
      {/* Navigation Top Rail */}
      <nav className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <Zap className="text-white w-5 h-5 fill-current" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic">DataPulse</span>
          <div className="h-4 w-px bg-slate-200 mx-2" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Intelligence Hub v1.0</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {['Dashboard', 'Neural Maps', 'Archive'].map((link) => (
            <a key={link} href="#" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">{link}</a>
          ))}
          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8 lg:p-12">
        {!data ? (
          <div className="max-w-4xl mx-auto py-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full mb-6">
                <Binary className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Advanced Neural Architect</span>
              </div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-[0.95]">
                Unlock the DNA <br /> of your <span className="text-indigo-600">Datasets.</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-xl mx-auto mb-8 font-medium leading-relaxed">
                Upload raw CSV data and watch as DataPulse orchestrates visual narratives and deep statistical insights using the power of Gemini 3.1 Pro.
              </p>
            </motion.div>
            
            <DataStudio onDataLoaded={handleDataLoaded} />
            <div className="mt-8 flex justify-center">
              <button 
                onClick={loadSampleData}
                className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 group"
              >
                Don't have a file? <span className="underline decoration-indigo-200 group-hover:decoration-indigo-600">Load sample Global Sales dataset</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full min-h-[calc(100vh-160px)]">
            {/* Primary Analysis View */}
            <div className="xl:col-span-8 flex flex-col space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Live Workspace</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em]">Neural EDA</span>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Insights Dashboard</h2>
                </div>
                <button 
                  onClick={resetData}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" /> New Session
                </button>
              </div>

              <SummaryHeader stats={stats} />

              <div className="flex bg-slate-100 p-1 rounded-2xl w-fit mb-6">
                <button 
                  onClick={() => setActiveTab('insights')}
                  className={cn(
                    "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                    activeTab === 'insights' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <Activity className="w-3.5 h-3.5" /> Insights
                </button>
                <button 
                  onClick={() => setActiveTab('data')}
                  className={cn(
                    "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                    activeTab === 'data' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <TableIcon className="w-3.5 h-3.5" /> Raw Data
                </button>
              </div>

              {activeTab === 'insights' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-500" /> Automated Visualizations
                    </h3>
                    {isAnalyzing && (
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                          <RefreshCw className="w-3 h-3" />
                        </motion.div>
                        Synthesizing Neural Maps...
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {visuals.map((config, idx) => (
                        <VisualInsight key={idx} data={data} config={config} index={idx} />
                      ))}
                    </AnimatePresence>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-indigo-600 p-8 rounded-3xl text-white flex flex-col justify-between overflow-hidden relative"
                    >
                      <div className="absolute -bottom-10 -right-10 opacity-20">
                        <Box className="w-40 h-40" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black tracking-tight mb-2">Need more specific charts?</h4>
                        <p className="text-indigo-100 text-sm font-medium leading-relaxed max-w-[200px]">
                          Describe the relationship you want to see in the AI Agent sidebar to generate custom analysis.
                        </p>
                      </div>
                      <div className="mt-8">
                         <div className="inline-flex items-center gap-2 py-1 px-3 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-white/30 transition-colors">
                          Explore Modeling <ChevronRight className="w-3 h-3" />
                         </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <DataTable data={data} />
                </motion.div>
              )}
            </div>

            {/* AI Assistant Sidebar */}
            <aside className="xl:col-span-4 h-full sticky top-24 max-h-[85vh]">
              {stats && <AIAnalyst stats={stats} data={data} />}
            </aside>
          </div>
        )}
      </main>

      <footer className="mt-20 py-12 border-t border-slate-100 bg-white">
        <div className="max-w-[1600px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <Zap className="text-white w-4 h-4 fill-current" />
            </div>
            <span className="font-black tracking-tighter uppercase italic text-sm">DataPulse</span>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Built for High-Level Data Synthesizers • © 2026 
          </p>
          <div className="flex gap-4">
            <span className="w-2 h-2 bg-indigo-600 rounded-full" />
            <span className="w-2 h-2 bg-indigo-400 rounded-full" />
            <span className="w-2 h-2 bg-indigo-200 rounded-full" />
          </div>
        </div>
      </footer>
    </div>
  );
}

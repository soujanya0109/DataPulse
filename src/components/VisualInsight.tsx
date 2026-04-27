import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, ScatterChart, Scatter, AreaChart, Area, Cell 
} from 'recharts';
import { DataRow, ChartConfig } from '../types';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, ScatterChart as ScatterIcon, Activity } from 'lucide-react';

interface VisualInsightProps {
  data: DataRow[];
  config: ChartConfig;
  index: number;
}

export function VisualInsight({ data, config, index }: VisualInsightProps) {
  const renderChart = () => {
    switch (config.type) {
      case 'bar':
        return (
          <BarChart data={data.slice(0, 50)}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey={config.xAxis} fontSize={10} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis fontSize={10} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey={config.yAxis} fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data.slice(0, 50)}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey={config.xAxis} fontSize={10} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis fontSize={10} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
            <Line type="monotone" dataKey={config.yAxis} stroke="#6366f1" strokeWidth={2} dot={false} />
          </LineChart>
        );
      case 'scatter':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis type="number" dataKey={config.xAxis} name={config.xAxis} fontSize={10} axisLine={false} tickLine={false} />
            <YAxis type="number" dataKey={config.yAxis} name={config.yAxis} fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
            <Scatter name="Data" data={data.slice(0, 100)} fill="#6366f1" />
          </ScatterChart>
        );
      case 'area':
        return (
          <AreaChart data={data.slice(0, 50)}>
            <defs>
              <linearGradient id={`colorGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey={config.xAxis} fontSize={10} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis fontSize={10} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
            <Area type="monotone" dataKey={config.yAxis} stroke="#6366f1" fillOpacity={1} fill={`url(#colorGrad-${index})`} strokeWidth={2} />
          </AreaChart>
        );
      default:
        return null;
    }
  };

  const getIcon = () => {
    switch(config.type) {
      case 'bar': return <BarChart3 className="w-4 h-4" />;
      case 'line': return <TrendingUp className="w-4 h-4" />;
      case 'scatter': return <ScatterIcon className="w-4 h-4" />;
      case 'area': return <Activity className="w-4 h-4" />;
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            {getIcon()}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 tracking-tight">{config.title}</h4>
            <div className="flex gap-2 mt-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{config.xAxis} vs {config.yAxis}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';
import { Upload, Database, FileText, Table as TableIcon } from 'lucide-react';
import { DataRow, DatasetStats } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface DataStudioProps {
  onDataLoaded: (data: DataRow[], stats: DatasetStats) => void;
}

export function DataStudio({ onDataLoaded }: DataStudioProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

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

    return {
      rowCount: data.length,
      columnCount: columns.length,
      columns,
      types,
      summary
    };
  };

  const handleFileUpload = (file: File) => {
    setLoading(true);
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as DataRow[];
        const stats = calculateStats(data);
        onDataLoaded(data, stats);
        setLoading(false);
      },
      error: (error) => {
        console.error("CSV Parse Error:", error);
        setLoading(false);
      }
    });
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      handleFileUpload(file);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 group cursor-pointer",
          isDragging ? "border-indigo-500 bg-indigo-50/50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
        )}
      >
        <input 
          type="file" 
          accept=".csv"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        />
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110",
            isDragging ? "bg-indigo-100 text-indigo-600 scale-110" : "bg-slate-100 text-slate-500"
          )}>
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Upload Dataset</h3>
            <p className="text-slate-500 mt-1">Drag and drop your CSV file here, or click to browse</p>
          </div>
          <div className="flex gap-4 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
              <FileText className="w-3 h-3" /> CSV Only
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
              <Database className="w-3 h-3" /> Auto-Types
            </span>
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Max Rows', value: '100,000', icon: Database },
          { label: 'File Type', value: 'CSV', icon: FileText },
          { label: 'Security', value: 'Private', icon: Upload },
          { label: 'Structure', value: 'Relational', icon: TableIcon },
        ].map((item, idx) => (
          <div key={idx} className="p-4 bg-white border border-slate-100 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-semibold text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

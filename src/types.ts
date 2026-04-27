export interface DataRow {
  [key: string]: any;
}

export interface DatasetStats {
  rowCount: number;
  columnCount: number;
  columns: string[];
  types: Record<string, 'number' | 'string' | 'date'>;
  summary: Record<string, {
    min?: number;
    max?: number;
    mean?: number;
    uniqueValues?: number;
    missingValues: number;
  }>;
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'scatter' | 'area';
  xAxis: string;
  yAxis: string;
  title: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

import * as XLSX from 'xlsx';
import { processWithKimiAI } from './KimiAIService';

export interface ProcessedData {
  headers: string[];
  data: any[][];
  analysis: string;
}

export function processExcelData(file: File, aiInstructions: string): Promise<ProcessedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        if (!jsonData || jsonData.length === 0) {
          throw new Error('Excel file is empty');
        }

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];

        // Convert Excel data to string for KIMI AI
        const excelDataString = jsonData
          .map(row => row.join('\t'))
          .join('\n');

        // Get analysis from KIMI AI
        const analysis = await processWithKimiAI(aiInstructions, excelDataString);

        // Process the data based on AI analysis
        const processedRows = processRowsWithAnalysis(rows, headers, analysis);

        resolve({
          headers,
          data: processedRows,
          analysis
        });
      } catch (err) {
        reject(new Error('Failed to process Excel file: ' + (err instanceof Error ? err.message : 'Unknown error')));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

function processRowsWithAnalysis(rows: any[][], headers: string[], analysis: string): any[][] {
  // Extract key insights and patterns from the analysis
  const insights = extractInsightsFromAnalysis(analysis);
  
  // Filter and sort rows based on insights
  return rows.filter(row => {
    return headers.some((header, index) => {
      const cellValue = row[index]?.toString().toLowerCase() || '';
      return insights.some(insight => 
        cellValue.includes(insight.toLowerCase())
      );
    });
  });
}

function extractInsightsFromAnalysis(analysis: string): string[] {
  // Extract key terms and patterns from the AI analysis
  return analysis
    .split(/[.,\n]/)
    .map(insight => insight.trim())
    .filter(insight => 
      insight.length > 0 && 
      !insight.toLowerCase().includes('analysis') &&
      !insight.toLowerCase().includes('recommend')
    );
}

export function generateExcelFile(data: ProcessedData): void {
  try {
    // Create analysis sheet
    const analysisWS = XLSX.utils.aoa_to_sheet([
      ['AI Analysis Results'],
      [''],
      ...data.analysis.split('\n').map(line => [line])
    ]);

    // Create data sheet
    const dataWS = XLSX.utils.aoa_to_sheet([
      data.headers,
      ...data.data
    ]);

    // Auto-size columns for both sheets
    const colWidths = data.headers.map(header => ({
      wch: Math.max(
        header.length,
        ...data.data.map(row => 
          row[data.headers.indexOf(header)]?.toString().length || 0
        )
      )
    }));
    dataWS['!cols'] = colWidths;

    // Create workbook with both sheets
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, analysisWS, 'AI Analysis');
    XLSX.utils.book_append_sheet(wb, dataWS, 'Processed Data');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    XLSX.writeFile(wb, `analyzed_data_${timestamp}.xlsx`);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    throw new Error('Failed to generate Excel file');
  }
}
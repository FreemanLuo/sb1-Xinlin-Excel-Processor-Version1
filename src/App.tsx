import React, { useState } from 'react';
import { FileUp, Download, Table2, FileQuestion, Loader2, Mail, Calendar, Bot } from 'lucide-react';
import { processExcelData, ProcessedData } from './components/ExcelProcessor';
import { generateWordReport } from './components/WordGenerator';
import { FileUpload } from './components/FileUpload';
import { AIQueryInput } from './components/AIQueryInput';
import { ActionButtons } from './components/ActionButtons';
import { DataPreview } from './components/DataPreview';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProgressBar } from './components/ProgressBar';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [aiResponse, setAiResponse] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel') {
        setFile(file);
        setError('');
        setProcessedData(null);
        setAiResponse(''); // Clear AI response when new file is uploaded
        setQuery(''); // Clear query input when new file is uploaded
      } else {
        setError('请上传有效的 Excel 文件 (.xlsx 或 .xls)');
      }
    }
  };

  const handleProcess = async () => {
    if (!file || !query.trim()) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessedData(null);
    setError('');

    try {
      setProgress(20);
      const processedData = await processExcelData(file, query);
      setProgress(80);
      setProcessedData(processedData);
      setAiResponse(processedData.analysis);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理过程中发生错误');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (processedData && file) {
      await generateWordReport(
        file.name.replace(/\.[^/.]+$/, ''),
        query,
        aiResponse,
        processedData
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <Header />

          <div className="space-y-6">
            <FileUpload 
              file={file}
              isProcessing={isProcessing}
              onFileUpload={handleFileUpload}
            />

            <AIQueryInput 
              query={query}
              isProcessing={isProcessing}
              aiResponse={aiResponse}
              onQueryChange={(e) => setQuery(e.target.value)}
            />

            {isProcessing && (
              <ProgressBar progress={progress} />
            )}

            <ActionButtons 
              isProcessing={isProcessing}
              hasFile={!!file}
              hasQuery={!!query.trim()}
              hasProcessedData={!!processedData}
              onProcess={handleProcess}
              onDownload={handleDownload}
            />

            {error && (
              <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            {processedData && (
              <DataPreview data={processedData} />
            )}
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
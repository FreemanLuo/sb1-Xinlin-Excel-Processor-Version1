import { FileQuestion, Download, Loader2 } from 'lucide-react';

interface ActionButtonsProps {
  isProcessing: boolean;
  hasFile: boolean;
  hasQuery: boolean;
  hasProcessedData: boolean;
  onProcess: () => void;
  onDownload: () => Promise<void>;
}

export function ActionButtons({ 
  isProcessing, 
  hasFile, 
  hasQuery, 
  hasProcessedData, 
  onProcess, 
  onDownload 
}: ActionButtonsProps) {
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasProcessedData && !isProcessing) {
      try {
        await onDownload();
      } catch (error) {
        console.error('下载Word文档时出错:', error);
        alert('下载Word文档失败，请重试');
      }
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={onProcess}
        disabled={!hasFile || !hasQuery || isProcessing}
        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <FileQuestion className="w-5 h-5 animate-bounce" />
        )}
        {isProcessing ? '处理中...' : '使用 Xinlin AI 分析'}
      </button>
      
      {hasProcessedData && (
        <button
          onClick={handleDownload}
          disabled={isProcessing}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg animate-fade-in"
        >
          <Download className="w-5 h-5 animate-bounce" />
          下载 Word 分析报告
        </button>
      )}
    </div>
  );
}
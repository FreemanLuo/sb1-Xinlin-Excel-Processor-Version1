import { ProcessedData } from './ExcelProcessor';

interface DataPreviewProps {
  data: ProcessedData;
}

export function DataPreview({ data }: DataPreviewProps) {
  return (
    <div className="mt-8 space-y-6">
      <div className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">AI 分析计划</h2>
        <div className="prose prose-purple">
          {data.analysis.split('\n').map((line, index) => (
            <p key={index} className="text-gray-700">{line}</p>
          ))}
        </div>
      </div>

      <div className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">AI 分析结果</h2>
        <div className="prose prose-purple">
          {data.analysis.split('\n').map((line, index) => (
            <p key={index} className="text-gray-700">{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
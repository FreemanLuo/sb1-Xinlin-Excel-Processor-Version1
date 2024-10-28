import { Bot } from 'lucide-react';

interface AIQueryInputProps {
  query: string;
  isProcessing: boolean;
  aiResponse: string;
  onQueryChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function AIQueryInput({ query, isProcessing, aiResponse, onQueryChange }: AIQueryInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="query" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
        <Bot className="w-5 h-5 text-purple-600 animate-spin" />
        Xinlin AI 分析需求
      </label>
      <textarea
        id="query"
        value={query}
        onChange={onQueryChange}
        placeholder="请输入您的数据分析需求..."
        className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
        rows={3}
        disabled={isProcessing}
      />
      {aiResponse && (
        <div className="mt-2 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-700">
            <strong>AI 分析计划：</strong> {aiResponse}
          </p>
        </div>
      )}
    </div>
  );
}
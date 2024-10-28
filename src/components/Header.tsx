import { Table2 } from 'lucide-react';

export function Header() {
  return (
    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-8 flex items-center gap-3">
      <Table2 className="w-8 h-8 text-purple-600 animate-bounce" />
      Xinlin-Excel Processor
    </h1>
  );
}
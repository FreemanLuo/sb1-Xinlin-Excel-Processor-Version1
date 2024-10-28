import { FileUp } from 'lucide-react';

interface FileUploadProps {
  file: File | null;
  isProcessing: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUpload({ file, isProcessing, onFileUpload }: FileUploadProps) {
  return (
    <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
      <input
        type="file"
        onChange={onFileUpload}
        accept=".xlsx,.xls"
        className="hidden"
        id="file-upload"
        disabled={isProcessing}
      />
      <label
        htmlFor="file-upload"
        className={`cursor-pointer flex flex-col items-center gap-4 ${isProcessing ? 'opacity-50' : ''}`}
      >
        <FileUp className="w-12 h-12 text-purple-600 animate-pulse" />
        <div className="text-gray-600">
          {file ? (
            <span className="text-purple-600 font-medium">{file.name}</span>
          ) : (
            <>
              <span className="text-purple-600 font-medium">Click to upload</span>
              {' '}or drag and drop
            </>
          )}
        </div>
        <span className="text-sm text-gray-500">
          Supports Excel files (.xlsx, .xls)
        </span>
      </label>
    </div>
  );
}
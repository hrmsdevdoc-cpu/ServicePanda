import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CloudUpload, File, X } from "lucide-react";

interface DocumentUploadProps {
  label: string;
  description: string;
  onUpload: (files: FileList) => void;
  loading?: boolean;
  accept?: string;
  multiple?: boolean;
}

export function DocumentUpload({ 
  label, 
  description, 
  onUpload, 
  loading, 
  accept = ".pdf,.jpg,.jpeg,.png",
  multiple = true 
}: DocumentUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles = Array.from(files).filter(file => {
      const validTypes = accept.split(',').map(type => type.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const fileMimeType = file.type;
      
      return validTypes.some(type => 
        type === fileExtension || 
        type === fileMimeType ||
        (type === '.pdf' && fileMimeType === 'application/pdf') ||
        (type === '.jpg' && (fileMimeType === 'image/jpeg' || fileMimeType === 'image/jpg')) ||
        (type === '.jpeg' && fileMimeType === 'image/jpeg') ||
        (type === '.png' && fileMimeType === 'image/png')
      );
    });
    
    if (multiple) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    } else {
      setSelectedFiles(validFiles.slice(0, 1));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach(file => dataTransfer.items.add(file));
    
    onUpload(dataTransfer.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {label}
        </Label>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? "border-primary bg-blue-50" 
              : "border-gray-300 hover:border-primary"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CloudUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">{description}</p>
          <p className="text-sm text-gray-500 mb-4">
            Supported formats: PDF, JPG, JPEG, PNG (Max 10MB)
          </p>
          <Button
            type="button"
            onClick={openFileDialog}
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            Choose Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInput}
          />
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Selected Files ({selectedFiles.length})
          </Label>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={handleUpload}
            disabled={loading || selectedFiles.length === 0}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading ? "Uploading..." : `Upload ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`}
          </Button>
        </div>
      )}
    </div>
  );
}

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms';
import { AlertMessage } from '@/components/molecules';
import { Upload, File, X, Check, Loader2 } from 'lucide-react';

interface FileUploadProps {
  title?: string;
  description?: string;
  accept?: string;
  maxSize?: number; // in MB
  onFileSelect: (file: File, base64: string) => void;
  isUploading?: boolean;
  error?: string;
  successMessage?: string;
  className?: string;
}

export function FileUpload({
  title = 'Upload File',
  description = 'Drag and drop or click to upload',
  accept = '.csv',
  maxSize = 5,
  onFileSelect,
  isUploading = false,
  error,
  successMessage,
  className,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    setFileError(null);

    // Check file type
    const acceptedTypes = accept.split(',').map((t) => t.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.some((type) => type === fileExtension || type === file.type)) {
      setFileError(`Invalid file type. Accepted: ${accept}`);
      return false;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setFileError(`File too large. Maximum size: ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const processFile = (file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:text/csv;base64,")
      const base64 = result.split(',')[1];
      onFileSelect(file, base64);
    };
    reader.onerror = () => {
      setFileError('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setFileError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(error || fileError) && (
          <AlertMessage variant="error">{error || fileError}</AlertMessage>
        )}

        {successMessage && (
          <AlertMessage variant="success">{successMessage}</AlertMessage>
        )}

        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer',
            'flex flex-col items-center justify-center gap-2',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50',
            isUploading && 'pointer-events-none opacity-50'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />

          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : selectedFile ? (
            <>
              <File className="h-10 w-10 text-primary" />
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drop your file here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                {accept} files up to {maxSize}MB
              </p>
            </>
          )}
        </div>

        {/* Selected file actions */}
        {selectedFile && !isUploading && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm text-foreground">File selected</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              <X className="h-4 w-4" />
              Remove
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

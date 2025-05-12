
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trash2, FileText, Video, Image as ImageIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type FileWithPreview = File & {
  preview: string;
  id: string;
};

interface FileUploaderProps {
  onFilesChange?: (files: FileWithPreview[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
  className?: string;
}

const FileUploader = ({
  onFilesChange,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB by default
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    'application/pdf': ['.pdf'],
    'video/*': ['.mp4', '.webm', '.mov']
  },
  className
}: FileUploaderProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        alert(`Solo puedes subir un máximo de ${maxFiles} archivos.`);
        return;
      }

      // Convert File objects to FileWithPreview
      const newFiles = acceptedFiles.map((file) => 
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          id: Math.random().toString(36).substring(2),
        })
      );

      // Simulate upload
      setUploading(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setUploading(false);
          
          // Add to files array
          const updatedFiles = [...files, ...newFiles];
          setFiles(updatedFiles);
          
          // Notify parent component
          if (onFilesChange) {
            onFilesChange(updatedFiles);
          }
        }
      }, 100);
    },
    [files, maxFiles, onFilesChange]
  );

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(file => file.id !== id);
    setFiles(updatedFiles);
    
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  const getFileIcon = (file: FileWithPreview) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-5 w-5" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="h-5 w-5" />;
    } else {
      return <FileText className="h-5 w-5" />;
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept,
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors",
          isDragActive ? "border-escalando-400 bg-escalando-50" : "border-muted-foreground/25",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          {isDragActive ? (
            <p>Suelta los archivos aquí...</p>
          ) : (
            <>
              <p className="font-medium">Arrastra archivos o haz clic para seleccionar</p>
              <p className="text-xs text-muted-foreground">
                Soporta imágenes, PDF y videos (máx. {maxFiles} archivos, {maxSize / (1024 * 1024)}MB por archivo)
              </p>
            </>
          )}
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center">Subiendo archivos... {progress}%</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Archivos cargados ({files.length})</p>
          <div className="grid gap-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2 rounded-md border bg-background"
              >
                <div className="flex items-center space-x-2">
                  {getFileIcon(file)}
                  <div className="max-w-[180px] sm:max-w-[300px]">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;

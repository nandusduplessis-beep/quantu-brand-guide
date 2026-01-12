import { useState, useRef } from "react";
import { Upload, X, FileText, Image, Video, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  files: UploadedFile[];
  folder: string;
  multiple?: boolean;
  accept?: string;
  maxSizeMB?: number;
}

const FileUpload = ({
  onFilesChange,
  files,
  folder,
  multiple = false,
  accept = ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp,.mp4,.mp3,.wav",
  maxSizeMB = 20,
}: FileUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="w-4 h-4 text-cyan-400" />;
    if (type.startsWith("video/") || type.startsWith("audio/")) return <Video className="w-4 h-4 text-purple-400" />;
    return <FileText className="w-4 h-4 text-blue-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `${file.name} exceeds ${maxSizeMB}MB limit`,
        variant: "destructive",
      });
      return null;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("campaign-files")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("campaign-files")
      .getPublicUrl(data.path);

    return {
      name: file.name,
      url: urlData.publicUrl,
      type: file.type,
      size: file.size,
    };
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);
    const filesToUpload = multiple ? Array.from(fileList) : [fileList[0]];
    const uploadedFiles: UploadedFile[] = [];

    for (const file of filesToUpload) {
      const result = await uploadFile(file);
      if (result) {
        uploadedFiles.push(result);
      }
    }

    if (uploadedFiles.length > 0) {
      const newFiles = multiple ? [...files, ...uploadedFiles] : uploadedFiles;
      onFilesChange(newFiles);
      toast({
        title: "Upload complete",
        description: `${uploadedFiles.length} file(s) uploaded successfully`,
      });
    }

    setIsUploading(false);
  };

  const removeFile = async (fileToRemove: UploadedFile) => {
    // Extract path from URL
    const urlParts = fileToRemove.url.split("/campaign-files/");
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      await supabase.storage.from("campaign-files").remove([filePath]);
    }
    onFilesChange(files.filter((f) => f.url !== fileToRemove.url));
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
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer ${
          dragActive
            ? "border-cyan-400 bg-cyan-500/10"
            : "border-cyan-500/30 hover:border-cyan-400/50"
        } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
            <p className="text-white/70 text-xs">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-6 h-6 text-cyan-400" />
            <p className="text-white/70 text-xs">
              {dragActive ? "Drop files here" : "Click to upload or drag & drop"}
            </p>
            <p className="text-slate-500 text-xs">PDF, DOC, images, video (max {maxSizeMB}MB)</p>
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-slate-700/40 rounded-lg p-2 border border-cyan-500/20"
            >
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs truncate">{file.name}</p>
                <p className="text-slate-400 text-xs">{formatFileSize(file.size)}</p>
              </div>
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file);
                }}
                className="p-1 text-slate-400 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;

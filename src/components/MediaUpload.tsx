import { useState, useCallback } from "react";
import { Upload, Image, Video } from "lucide-react";
import { Card } from "@/components/ui/card";

const MediaUpload = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (isImage && file.size > 20 * 1024 * 1024) {
      alert("Image size must be less than 20MB");
      return;
    }
    if (isVideo && file.size > 200 * 1024 * 1024) {
      alert("Video size must be less than 200MB");
      return;
    }

    if (isImage || isVideo) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFileType(isImage ? "image" : "video");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <Card
      className={`p-8 border-2 border-dashed transition-all ${
        isDragging ? "border-primary bg-primary/5" : "border-border"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {preview ? (
        <div className="space-y-4">
          {fileType === "image" ? (
            <img src={preview} alt="Preview" className="w-full h-64 object-contain rounded-lg" />
          ) : (
            <video src={preview} controls className="w-full h-64 rounded-lg" />
          )}
          <button
            onClick={() => {
              setPreview(null);
              setFileType(null);
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Remove and upload new file
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center cursor-pointer py-12">
          <Upload className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold mb-2">Drop your media here or click to upload</p>
          <p className="text-sm text-muted-foreground mb-4">
            Images (.jpg, .png, .webp) up to 20MB or Videos (.mp4, .mov) up to 200MB
          </p>
          <div className="flex gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              <span>Images</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              <span>Videos</span>
            </div>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
            onChange={handleChange}
          />
        </label>
      )}
    </Card>
  );
};

export default MediaUpload;

import { ImageUp, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const MAX_IMAGE_WIDTH = 1200;
const MAX_IMAGE_HEIGHT = 800;
const IMAGE_QUALITY = 0.78;

async function resizeImage(file) {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }

  try {
    const imageUrl = URL.createObjectURL(file);
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageUrl;
    });

    const scale = Math.min(MAX_IMAGE_WIDTH / image.width, MAX_IMAGE_HEIGHT / image.height, 1);
    if (scale === 1 && file.size < 600 * 1024) {
      URL.revokeObjectURL(imageUrl);
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);

    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(imageUrl);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", IMAGE_QUALITY));
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, ".jpg");
    return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return file;
  }
}

function getOptimizedCloudinaryUrl(url) {
  return url.replace("/upload/", "/upload/f_auto,q_auto,c_limit,w_900/");
}

export default function CloudinaryUpload({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();
    if (!cloudName || !uploadPreset) {
      toast.error("Cloudinary environment variables are missing");
      return;
    }

    const resizedFile = await resizeImage(file);
    const formData = new FormData();
    formData.append("file", resizedFile);
    formData.append("upload_preset", uploadPreset);

    setUploading(true);
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        const message = data.error?.message || "Upload failed";
        if (message.toLowerCase().includes("upload preset not found")) {
          throw new Error(`Cloudinary upload preset "${uploadPreset}" was not found. Create it as an unsigned preset or update VITE_CLOUDINARY_UPLOAD_PRESET.`);
        }
        throw new Error(message);
      }
      onChange(getOptimizedCloudinaryUrl(data.secure_url));
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error.message || "Could not upload image");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {value ? (
        <div className="relative max-w-2xl overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
          <img src={value} alt="Blog thumbnail" className="max-h-72 w-full object-cover" />
          <Button type="button" size="icon" variant="secondary" className="absolute right-3 top-3" onClick={() => onChange("")}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-24 w-full items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white text-slate-600 transition hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageUp className="h-5 w-5" />}
          {uploading ? "Uploading..." : "Click to upload image"}
        </button>
      )}
    </div>
  );
}

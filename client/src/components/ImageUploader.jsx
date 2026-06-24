import { useRef } from "react";
import toast from "react-hot-toast";
import uploadImage from "../apis/imageApi";
import { useImageActions, useUploaderState } from "../store/hooks.js";
import socket from "../socket/socket.js";

export default function ImageUploader() {
  const { selectedImage, isUploading } = useUploaderState();
  const {
    setSelectedImage,
    clearSelectedImage,
    beginUpload,
    markQueuedForProcessing,
    markUploadFailed,
  } = useImageActions();

  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    setSelectedImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedImage.file) {
      toast.error("Please select an image first.");
      return;
    }

    try {
      beginUpload();

      const formData = new FormData();
      formData.append("image", selectedImage.file);

      const response = await uploadImage(formData);

      console.log("Upload response:", response.jobId);

      socket.emit("join-job-room", { jobId: response.jobId });

      toast.success("Image uploaded successfully!");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      clearSelectedImage();
      markQueuedForProcessing();

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Image upload failed."
      );
      markUploadFailed();
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Upload panel</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Choose an image</h2>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
          Drag or click
        </div>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        className="group mt-5 flex min-h-96 cursor-pointer flex-col overflow-hidden rounded-3xl border border-dashed border-white/15 bg-slate-950/40 transition duration-300 hover:border-cyan-300/60 hover:bg-slate-950/55"
      >
          {selectedImage.file ? (
          <div className="relative flex h-full min-h-96 items-end">
            <img
              src={selectedImage.preview}
              alt="preview"
              className="absolute inset-0 h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/35 to-transparent" />

            <div className="relative w-full p-5 sm:p-6">
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Selected file</p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-medium text-white">{selectedImage.name}</p>
                    <p className="text-sm text-slate-300">
                      {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelectedImage();
                      if (inputRef.current) {
                        inputRef.current.value = "";
                      }
                    }}
                    disabled={isUploading}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-400/10 text-3xl text-cyan-200 shadow-lg shadow-cyan-950/20">
              ⇪
            </div>

            <p className="mt-6 text-xl font-semibold text-white">Drag & drop your image</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              PNG, JPG, and WebP are supported. Click anywhere in this card to browse your files.
            </p>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-6 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Browse image
            </button>
          </div>
        )}
      </div>

      <input
        hidden
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-300">
          <p className="font-medium text-white">Fast queueing</p>
          <p className="mt-1 leading-6">Upload your file and the worker will generate optimized outputs in the background.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-300">
          <p className="font-medium text-white">Multiple outputs</p>
          <p className="mt-1 leading-6">Thumbnail, medium, large, WebP, and AVIF versions appear in the gallery when ready.</p>
        </div>
      </div>

      {selectedImage.file && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`mt-5 w-full rounded-2xl px-5 py-3 text-sm font-semibold text-white transition ${
            isUploading
              ? "cursor-not-allowed bg-slate-600"
              : "bg-linear-to-r from-cyan-400 to-sky-500 shadow-lg shadow-cyan-950/30 hover:from-cyan-300 hover:to-sky-400"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload and process image"}
        </button>
      )}
    </div>
  );
}
import axios from "axios";
import { Download, ExternalLink, ImageIcon } from "lucide-react";

function getDownloadFileName(title, src) {
  try {
    const url = new URL(src);
    const lastSegment = url.pathname.split("/").filter(Boolean).pop();
    return lastSegment || `${title.toLowerCase()}.jpg`;
  } catch {
    return `${title.toLowerCase()}.jpg`;
  }
}

export default function ImageCard({ title, src }) {
  const handleDownload = async () => {
    try {
      const response = await axios.get(src, {
        responseType: "blob",
      });

      const objectUrl = URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = getDownloadFileName(title, src);

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const extension = src.split(".").pop().toUpperCase();

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-[0_0_60px_rgba(6,182,212,0.15)]">

      {/* Glow */}
      <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl transition-all duration-700 group-hover:bg-cyan-400/20" />

      {/* Image */}
      <div className="relative overflow-hidden">

        <img
          src={src}
          alt={title}
          className="h-64 w-full object-cover transition-all duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Format */}
        <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-md">
          {extension}
        </div>

        {/* Title */}
        <div className="absolute left-4 bottom-4 flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 backdrop-blur-md">

          <ImageIcon size={16} className="text-cyan-400" />

          <span className="text-sm font-medium text-white">
            {title}
          </span>

        </div>

      </div>

      {/* Content */}
      <div className="space-y-5 p-6">

        <div>

          <h3 className="text-xl font-semibold text-white">
            {title}
          </h3>

        </div>

        {/* Buttons */}
        <div className="flex gap-3">

          <button
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-cyan-500/30"
          >
            <Download size={18} />
            Download
          </button>

          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-white transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10"
          >
            <ExternalLink size={18} />
          </a>

        </div>

      </div>

    </div>
  );
}
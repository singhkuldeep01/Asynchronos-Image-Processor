import { CheckCircle2 } from "lucide-react";
import ImageCard from "./ImageCard";
import { useProcessedImages } from "../store/hooks";

export default function ProcessedImages() {
  const images = useProcessedImages();

  if (!images) return null;

  const BASE = "http://localhost:3000/api/v1/processed/";

  const variants = [
    {
      title: "Thumbnail",
      src: BASE + images.thumbnailPath.replace("processed/", ""),
    },
    {
      title: "Medium",
      src: BASE + images.mediumPath.replace("processed/", ""),
    },
    {
      title: "Large",
      src: BASE + images.largePath.replace("processed/", ""),
    },
    {
      title: "WebP",
      src: BASE + images.webpPath.replace("processed/", ""),
    },
    {
      title: "AVIF",
      src: BASE + images.avifPath.replace("processed/", ""),
    },
  ];

  return (
    <section className="mx-auto mt-12 w-full max-w-7xl ">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">

        <div>
          <h2 className="text-3xl font-bold text-white">
            Processed Images
          </h2>

          <p className="mt-2 text-slate-400">
            Download or preview the generated image variants.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-emerald-400">
          <CheckCircle2 size={18} />
          Completed
        </div>

      </div>

      {/* Scrollable Container */}
      <div className="rounded-3xl p-6 backdrop-blur-xl">

        <div className="max-h-[75vh] overflow-y-auto pr-2">

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 xl:grid-cols-2">

            {variants.map((variant) => (
              <ImageCard
                key={variant.title}
                title={variant.title}
                src={variant.src}
              />
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}
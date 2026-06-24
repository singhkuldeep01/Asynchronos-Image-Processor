import { useEffect } from 'react'
import Toast from "./components/Toast";
import ImageUploader from './components/ImageUploader'
import socket from './socket/socket.js'
import ProcessingStatus from './components/ProcessingStatus.jsx'
import ProcessedImages from './components/ProcessedImages.jsx'
import { useImageActions, useJobState } from './store/hooks.js'
import './App.css'

function App() {
  const job = useJobState();
  const { setJobProgress, setJobCompleted } = useImageActions();

  useEffect(() => {
    const handleProgress = ({ progress }) => {
      setJobProgress(progress);
    };

    const handleCompleted = (data) => {
      setJobCompleted(data.returnvalue);
    };

    socket.on("job-progress", handleProgress);
    socket.on("job-completed", handleCompleted);

    return () => {
      socket.off("job-progress", handleProgress);
      socket.off("job-completed", handleCompleted);
    };
  }, [setJobCompleted, setJobProgress]);

  return (
    <div className="app-shell min-h-screen text-slate-100">
      <div className="app-shell__glow app-shell__glow--one" />
      <div className="app-shell__glow app-shell__glow--two" />

      <Toast />

      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-cyan-200 backdrop-blur">
              Image pipeline
            </span>

            <div className="space-y-3">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Upload once, generate every optimized format automatically.
              </h1>

              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                A fast image processor that creates thumbnails, responsive sizes, WebP, and AVIF variants with live queue progress.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
                Sharp-powered transforms
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
                Queue-backed processing
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
                Live job progress
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Formats</p>
                <p className="mt-2 text-2xl font-semibold text-white">5</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Workflow</p>
                <p className="mt-2 text-2xl font-semibold text-white">Queue</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Output</p>
                <p className="mt-2 text-2xl font-semibold text-white">Ready</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
              Drop an image to preview it, then upload to generate optimized derivatives.
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <ImageUploader />
            <ProcessingStatus />
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Output gallery</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Processed variants</h2>
              </div>

              <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300 sm:block">
                {job.status === "idle" ? "Waiting for upload" : job.status}
              </div>
            </div>

            <div className="pt-6">
              {job.status === "completed" ? (
                <ProcessedImages />
              ) : (
                <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-6 py-10 text-center text-slate-400">
                  <div className="max-w-sm space-y-3">
                    <p className="text-lg font-medium text-slate-200">No processed images yet</p>
                    <p>
                      Once the job finishes, thumbnails and export formats will appear here in a responsive gallery.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App
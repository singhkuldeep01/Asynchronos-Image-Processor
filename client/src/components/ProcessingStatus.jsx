import { useJobState } from "../store/hooks.js";

export default function ProcessingStatus() {
    const job = useJobState();

    if(job.status==="idle") return null;

    const isComplete = job.status === "completed";

    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Job status</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                        {isComplete ? "Processing complete" : "Processing image"}
                    </h2>
                </div>

                {isComplete ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-200">
                        <span className="text-sm leading-none">✓</span>
                        <span>Complete</span>
                    </div>
                ) : (
                    <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
                        {job.progress}%
                    </div>
                )}
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-950/70">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${
                        isComplete
                            ? "bg-linear-to-r from-emerald-400 to-cyan-300"
                            : "bg-linear-to-r from-cyan-400 to-sky-500"
                    }`}
                    style={{
                        width:`${job.progress}%`
                    }}
                />
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-300">
                {isComplete
                    ? "Your optimized image versions are ready in the gallery."
                    : "The image is being transformed in the background. Results will appear automatically once the queue finishes."}
            </p>

        </div>
    );
}
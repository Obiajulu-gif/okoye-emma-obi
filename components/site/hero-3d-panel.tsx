"use client";

import Image from "next/image";

export function Hero3DPanel({ imageSrc = "/images/emmanuel.png" }: { imageSrc?: string }) {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/20 bg-[radial-gradient(circle_at_18%_18%,rgba(79,162,223,0.22),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(255,179,114,0.22),transparent_28%),linear-gradient(180deg,#040a14_0%,#091221_55%,#060d18_100%)] p-5 sm:min-h-[460px] sm:p-6">
      <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -right-8 bottom-12 h-36 w-36 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_45%)]" />

      <div className="relative flex h-full flex-col justify-between gap-5">
        <div className="flex justify-end">
          <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-100">
            Available for remote builds
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden rounded-[1.6rem] border border-white/15 bg-[#091321]/80 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <Image
            src={imageSrc}
            alt="Portrait of Emmanuel"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.16),transparent_26%),linear-gradient(180deg,rgba(4,10,20,0)_18%,rgba(4,10,20,0.18)_48%,rgba(4,10,20,0.72)_100%)]" />

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <div className="max-w-xs rounded-3xl border border-white/15 bg-black/35 p-4 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.22em] text-primary">Emmanuel</p>
              <p className="mt-2 text-lg font-semibold text-white">
                Building full-stack products, blockchain systems, and OSS tooling.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="chip border-white/20 bg-white/10 text-slate-100">Next.js</span>
          <span className="chip border-white/20 bg-white/10 text-slate-100">Stellar OSS</span>
          <span className="chip border-white/20 bg-white/10 text-slate-100">Production APIs</span>
        </div>
      </div>
    </div>
  );
}

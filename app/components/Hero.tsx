"use client";

import { type MouseEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import type { SiteContentDoc } from "@/types/portfolio";

const CodePattern = () => (
  <svg
    className="absolute inset-0 h-full w-full opacity-[0.08]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <pattern
      id="pattern-circles"
      x="0"
      y="0"
      width="50"
      height="50"
      patternUnits="userSpaceOnUse"
      patternContentUnits="userSpaceOnUse"
    >
      <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#fff"></circle>
    </pattern>
    <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
  </svg>
);

function getImageUrl(imageId?: string, fallback?: string) {
  if (imageId) return `/api/media/${imageId}`;
  return fallback || "/images/emmanuel.png";
}

function handleAnchorClick(href: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  };
}

const TypewriterEffect = ({ texts }: { texts: string[] }) => {
  const safeTexts = texts.length ? texts : ["Software Developer"];
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const currentText = safeTexts[index];

    if (typing) {
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, 150);
      } else {
        timeout = setTimeout(() => setTyping(false), 4000);
      }
    } else if (displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length - 1));
      }, 100);
    } else {
      setTyping(true);
      setIndex((prevIndex) => (prevIndex + 1) % safeTexts.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, typing, index, safeTexts]);

  return (
    <span className="inline-block min-h-[2rem] tracking-tight">
      {displayText}
      <span className="ml-1 border-r-2 border-current animate-blink">&nbsp;</span>
      <style jsx>{`
        @keyframes blink {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </span>
  );
};

const CodeNameEffect = ({ name }: { name: string }) => {
  return (
    <div className="relative inline-block">
      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
        {name}
      </h1>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-4xl font-semibold tracking-tight text-primary/65 opacity-70 animate-glitch sm:text-5xl lg:text-6xl"
      >
        {name}
      </span>
      <style jsx>{`
        @keyframes glitch {
          0% {
            clip-path: inset(0 0 0 0);
            transform: translate(0);
          }
          20% {
            clip-path: inset(10% 0 85% 0);
            transform: translate(-2px, -2px);
          }
          40% {
            clip-path: inset(40% 0 45% 0);
            transform: translate(2px, 1px);
          }
          60% {
            clip-path: inset(70% 0 15% 0);
            transform: translate(-1px, 2px);
          }
          80% {
            clip-path: inset(30% 0 50% 0);
            transform: translate(1px, -1px);
          }
          100% {
            clip-path: inset(0 0 0 0);
            transform: translate(0);
          }
        }
        .animate-glitch {
          animation: glitch 4s infinite;
        }
      `}</style>
    </div>
  );
};

export default function Hero({ content }: { content: SiteContentDoc }) {
  const socialLinks = [
    {
      href: content.socials.github,
      label: "GitHub Profile",
      icon: FaGithub,
    },
    {
      href: content.socials.linkedin,
      label: "LinkedIn Profile",
      icon: FaLinkedin,
    },
    {
      href: content.socials.x,
      label: "X Profile",
      icon: FaXTwitter,
    },
  ].filter((item) => item.href);

  const heroImageSrc = getImageUrl(content.hero.heroImageId, content.hero.heroImageFallback);
  const primaryHref = content.hero.primaryCtaUrl || "#about";
  const secondaryHref = content.hero.secondaryCtaUrl || "";
  const primaryOpensNewTab = primaryHref.startsWith("http");
  const secondaryOpensNewTab = secondaryHref.startsWith("http") || secondaryHref.endsWith(".pdf");

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden border-b border-white/10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_18%,rgba(72,154,221,0.18),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(252,175,101,0.16),transparent_24%),linear-gradient(180deg,rgba(7,15,26,0.65),rgba(7,15,26,0.18))]" />

      <div className="absolute inset-0 z-0">
        <CodePattern />
      </div>

      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_48%)]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(20,143,180,0.06),transparent_35%,rgba(240,168,35,0.08)_100%)]"></div>
      </div>

      <div className="section-shell relative z-10 flex min-h-screen items-center py-24">
        <div className="flex w-full flex-col items-center justify-between gap-12 lg:flex-row lg:gap-16">
          <motion.div
            className="text-center lg:w-1/2 lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="chip mx-auto mb-5 w-fit border-white/15 bg-white/8 text-slate-100 lg:mx-0">
              {content.hero.eyebrow}
            </p>
            <CodeNameEffect name={content.hero.name} />
            <h2 className="mb-6 mt-6 text-2xl font-semibold text-slate-200 md:text-3xl">
              <span className="inline-block min-h-[2.5rem]">
                <TypewriterEffect texts={content.hero.roles} />
              </span>
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300 md:text-xl lg:mx-0">
              {content.hero.description}
            </p>
            {socialLinks.length ? (
              <div className="mb-8 flex justify-center space-x-4 lg:justify-start">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="skeuo-icon-shell rounded-full p-3 transition duration-300 hover:border-primary/30 hover:brightness-105"
                    aria-label={label}
                  >
                    <Icon className="h-6 w-6 text-slate-100" />
                  </Link>
                ))}
              </div>
            ) : null}
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Link
                  href={primaryHref}
                  onClick={handleAnchorClick(primaryHref)}
                  target={primaryOpensNewTab ? "_blank" : undefined}
                  rel={primaryOpensNewTab ? "noreferrer" : undefined}
                  className="skeuo-button-shell inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/90 px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:brightness-105"
                >
                  {content.hero.primaryCtaLabel}
                </Link>
              </motion.div>

              {content.hero.secondaryCtaLabel && secondaryHref ? (
                <Link
                  href={secondaryHref}
                  onClick={handleAnchorClick(secondaryHref)}
                  target={secondaryOpensNewTab ? "_blank" : undefined}
                  rel={secondaryOpensNewTab ? "noreferrer" : undefined}
                  className="skeuo-button-shell inline-flex items-center gap-2 rounded-full border border-white/15 bg-[linear-gradient(180deg,rgba(61,72,92,0.94)_0%,rgba(29,36,51,0.98)_100%)] px-6 py-3 text-sm font-semibold text-slate-100 transition duration-300 hover:border-white/25 hover:brightness-105"
                >
                  {content.hero.secondaryCtaLabel}
                </Link>
              ) : null}
            </div>
          </motion.div>
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative mx-auto h-[400px] w-[300px] md:h-[500px] md:w-[400px]">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/25 via-transparent to-secondary/25 blur-2xl"></div>
              <div className="surface-card absolute inset-0 rotate-[5deg] rounded-[2rem] opacity-90"></div>
              <div className="surface-card absolute inset-0 -rotate-[5deg] rounded-[2rem] opacity-75"></div>
              <div className="surface-card absolute inset-0 overflow-hidden rounded-[1.75rem]">
                <Image
                  src={heroImageSrc}
                  alt={content.hero.name}
                  fill
                  className="object-cover object-[50%_-20px]"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 transform flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="h-12 w-1 rounded-full bg-gradient-to-b from-primary to-secondary animate-pulse"></div>
      </motion.div>
    </section>
  );
}

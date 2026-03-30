'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/content/site';


interface LoadingScreenProps {
  onComplete: () => void;
}

// Countdown boxes with color photos - numbers show days, hours, minutes
const COUNTDOWN_BOXES = [
  { src: '/frontboxes/box (1).webp' },
  { src: '/frontboxes/box (2).webp' },
  { src: '/frontboxes/box (3).webp' },
];

const MAIN_BW_IMAGE = '/frontboxes/Front.webp';
const DESKTOP_BW_IMAGE = '/frontboxes/desktopView.JPG';
const STAGGER_DELAY_MS = 4000; // Each image appears every 4 seconds
const BOX_TRANSITION_MS = 1200; // Slow, smooth transition
const TOTAL_DURATION_MS = COUNTDOWN_BOXES.length * STAGGER_DELAY_MS + 3000;

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visibleBoxes, setVisibleBoxes] = useState<number[]>([]);
  const [now, setNow] = useState(() => new Date());

    // Live countdown: days, hours, minutes until wedding
  const countdown = useMemo(() => {
    const weddingDate = new Date(siteConfig.wedding.date);
    const diff = weddingDate.getTime() - now.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes };
  }, [now]);

  const countdownText = useMemo(() => {
    const { days } = countdown;
    if (days === 0) return 'TODAY IS THE DAY';
    if (days === 1) return 'ONE DAY TO GO';
    if (days >= 28 && days <= 31) return 'ONE MONTH TO GO';
    if (days >= 58 && days <= 62) return 'TWO MONTHS TO GO';
    if (days >= 88 && days <= 93) return 'THREE MONTHS TO GO';
    if (days >= 118 && days <= 123) return 'FOUR MONTHS TO GO';
    if (days >= 148 && days <= 153) return 'FIVE MONTHS TO GO';
    return `${days} DAYS TO GO`;
  }, [countdown.days]);

  // Wedding date derived from siteConfig.wedding.date
  const debutDateObj = new Date(siteConfig.wedding.date);
  const debutMonthName = debutDateObj
    .toLocaleString('default', { month: 'short' })
    .toUpperCase(); // e.g. "MAY"
  const debutDay = String(debutDateObj.getDate()).padStart(2, '0'); // e.g. "09"
  const debutYear = String(debutDateObj.getFullYear()); // e.g. "2026"

  const countdownNumbers = [debutMonthName, debutDay, debutYear]; // e.g. May, 09, 2026
  const countdownLabels = ['Month', 'Day', 'Year']; // should return Month, Day, Year

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000); // update every minute
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000); // update every minute
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    COUNTDOWN_BOXES.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleBoxes((prev) => [...prev, i]), i * STAGGER_DELAY_MS)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / TOTAL_DURATION_MS) * 100);
      setProgress(pct);
    }, 50);

    const timer = setTimeout(() => {
      setProgress(100);
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, TOTAL_DURATION_MS);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  const coupleNames = `${siteConfig.couple.groomNickname} & ${siteConfig.couple.brideNickname}`;
  const hashtag = '#KennethLiveWithoutNomay';
  const productionCredit = '';


//   Background	#F5EFE6
// --color-motif-deep:    #9C5A63; /* deeper rose */
// --color-motif-medium:  #D88C9A; /* muted pink */
// --color-motif-accent:  #F2B5B5; /* pastel pink */
// --color-motif-cream:   #FFF8F5; /* creamy white */
// --color-motif-soft:    #F9E4E4; /* soft background */
// --color-motif-silver:  #CFC7C7; /* refined gray */
  const palette = {
    deep: '--color-motif-deep',
    medium: '--color-motif-medium',
    accent: '--color-motif-accent',
    cream: '--color-motif-cream',
    soft: '--color-motif-soft',
    silver: '--color-motif-silver',
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col overflow-hidden transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        {/* Mobile background */}
        <Image
          src={MAIN_BW_IMAGE}
          alt=""
          fill
          className="object-cover object-center md:hidden"
          sizes="100vw"
          priority
        />
        {/* Desktop background (md and above) */}
        <Image
          src={DESKTOP_BW_IMAGE}
          alt=""
          fill
          className="object-cover object-center hidden md:block"
          sizes="100vw"
          priority
        />
        {/* Gradient overlay for readability and warmth */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, var(--color-motif-deep)40 0%, transparent 25%, transparent 75%, var(--color-motif-deep)55 100%)`,
          }}
        />
      </div>

      <div className="relative flex flex-col flex-1 min-h-0">
        {/* Top: headline + hashtag + countdown (readable over photo, no container) */}
        <div className="flex flex-col items-center justify-center w-full pt-12 sm:pt-16 md:pt-24 px-4 sm:px-6 flex-shrink-0">
          <div className="w-full max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <span
                className="hidden sm:block h-px w-12 flex-shrink-0"
                style={{ backgroundColor: 'var(--color-motif-cream)' }}
              />
              <p className="text-center">
                <span
                  className="inline-block text-[10px] sm:text-xs tracking-[0.28em] sm:tracking-[0.36em] font-[family-name:'Cinzel', serif] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm border"
                  style={{
                    color: 'var(--color-motif-deep)',
                    backgroundColor: 'var(--color-motif-cream)',
                    borderColor: 'var(--color-motif-deep)',
                    textShadow: '0 1px 0 palette.soft',
                  }}
                >
                  Your invitation is on its way
                </span>
              </p>
              <span
                className="hidden sm:block h-px w-12 flex-shrink-0"
                style={{ backgroundColor: 'var(--color-motif-accent)' }}
              />
            </div>

            <p className="text-center mb-4 sm:mb-5">
              <span
                className="inline-block text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.25em] font-[family-name:'Cinzel', serif] px-3 py-1.5 rounded-full backdrop-blur-sm border"
                style={{
                  color: 'var(--color-motif-deep)',
                  backgroundColor: 'var(--color-motif-cream)',
                  borderColor: 'var(--color-motif-deep)',
                  textShadow: '0 1px 0 palette.soft',
                }}
              >
                {hashtag}
              </span>
            </p>

            <h2 className="text-center">
              <span
                className="inline-block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[0.08em] sm:tracking-[0.12em] uppercase max-w-md mx-auto leading-tight px-2"
                style={{
                  fontFamily: '"Cinzel", serif',
                  color: 'var(--color-motif-cream)',
                  textShadow:
                    '0 2px 14px rgba(0,0,0,0.55), 0 0 22px var(--color-motif-accent), 0 0 44px var(--color-motif-deep)',
                }}
              >
                {countdownText}
              </span>
            </h2>
          </div>
        </div>

        {/* Spacer - lets B&W image dominate (upper 2/3) */}
        <div className="flex-1 min-h-[12vh]" />

        {/* Middle: Three color countdown boxes - staggered reveal */}
        <div className="flex items-stretch justify-center gap-3 sm:gap-4 md:gap-6 px-3 sm:px-4 py-4 flex-shrink-0">
          {COUNTDOWN_BOXES.map((item, i) => {
            const isVisible = visibleBoxes.includes(i);
            return (
              <div
                key={i}
                className="relative flex-1 max-w-[28vw] sm:max-w-[140px] md:max-w-[160px] aspect-[3/4] overflow-hidden rounded-3xl border border-white/40 bg-white/10 backdrop-blur-md shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? 'translateY(0) scale(1)'
                    : 'translateY(28px) scale(0.94)',
                  transition: `opacity ${BOX_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${BOX_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                }}
              >
                <Image
                  src={item.src}
                  alt={coupleNames}
                  fill
                  className="object-cover scale-105"
                  sizes="(max-width: 640px) 28vw, 160px"
                />
                {/* Soft gradient overlay for readable number */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(145deg, ${palette.deep}66 0%, transparent 40%, ${palette.accent}aa 100%)`,
                  }}
                />

                {/* Bold debut date number + label - centered at bottom */}
                <div className="absolute bottom-2 inset-x-0 sm:bottom-3 flex flex-col items-center">
                  <span
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black select-none leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                    style={{
                      fontFamily: 'var(--font-granika), sans-serif',
                      color: 'var(--color-motif-soft)',
                    }}
                  >
                    {countdownNumbers[i]}
                  </span>
                  <span className="text-[8px] sm:text-[9px] tracking-widest uppercase mt-0.5 text-[rgba(255,246,248,0.85)]">
                    {countdownLabels[i]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom: Names + production credit + progress bar */}
        <div className="flex flex-col items-center justify-center w-full py-6 sm:py-8 px-4 flex-shrink-0">
          <p
            className="text-center text-sm sm:text-base tracking-[0.18em] uppercase text-[family-name:var(--font-crimson)] mb-2"
            style={{ color: 'var(--color-motif-deep)' }}
          >
            Almost ready for
          </p>
          <div
            className="text-center text-2xl sm:text-3xl md:text-4xl mb-2"
            style={{
              fontFamily: '"Cinzel", serif',
              color: 'var(--color-motif-deep)',
              textShadow: '0 2px 10px var(--color-motif-deep)35',
            }}
          >
            {coupleNames}
          </div>
          {productionCredit && (
            <p
              className="text-[10px] sm:text-xs font-sans tracking-wider"
              style={{ color: 'var(--color-motif-soft)' }}
            >
              {productionCredit}
            </p>
          )}
          {/* Preparing message + progress bar */}
          <p
            className="text-xs sm:text-sm tracking-[0.22em] mt-6 mb-3 font-[family-name:var(--font-crimson)] uppercase font-semibold"
            style={{ color: 'var(--color-motif-cream)', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}
          >
            Crafting your invitation experience
          </p>
          <div className="w-full max-w-xs mx-auto">
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                style={{
                  width: `${progress}%`,
                  backgroundColor: 'var(--color-motif-accent)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
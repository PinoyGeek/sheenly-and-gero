import React, { useEffect, useMemo, useState } from 'react';
import { siteConfig } from '@/content/site';
import { CloudinaryImage } from '@/components/ui/cloudinary-image';

interface HeroProps {
  onOpen: () => void;
  visible: boolean;
}

const desktopImages: string[] = [
  '/Album/couple (11).jpg',
  '/Album/couple (12).jpg',
  '/Album/couple (11).jpg',
  '/Album/couple (12).jpg',
  '/Album/couple (11).jpg',
];

const mobileImages: string[] = [
  '/Album/couple (3).jpg',
  '/Album/couple (5).jpg',
  '/Album/couple (6).jpg',
  '/Album/couple (7).jpg',
  '/Album/couple (8).jpg',
];

export const Hero: React.FC<HeroProps> = ({ onOpen, visible }) => {
  const [index, setIndex]               = useState(0);
  const [isMobile, setIsMobile]         = useState(false);
  const [mounted, setMounted]           = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(max-width: 768px)');
    const handleChange = () => setIsMobile(media.matches);
    handleChange();
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % 5);
    }, 5500);
    return () => clearInterval(timer);
  }, [mounted]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setContentVisible(true), 300);
      return () => clearTimeout(timer);
    } else {
      setContentVisible(false);
    }
  }, [visible]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gentleFloat {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-8px); }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const images = useMemo(() => (isMobile ? mobileImages : desktopImages), [isMobile]);

  return (
    <div
      className={`fixed inset-0 z-30 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
        visible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
    >
      {/* ── Background Image Carousel ── */}
      <div className="absolute inset-0 z-0">
        {images.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: i === index ? 'scale(1)' : 'scale(1.05)',
              transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
            }}
          >
            <CloudinaryImage
              src={src}
              alt="Couple"
              fill
              quality={90}
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* ── Top gradient vignette — keeps monogram readable ── */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none z-10"
        style={{
          height: '40%',
          background:
            'linear-gradient(to bottom, rgba(14,38,72,0.78) 0%, rgba(34,106,171,0.28) 60%, transparent 100%)',
        }}
      />

      {/* ── Bottom gradient vignette — keeps text & button readable ── */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none z-10"
        style={{
          height: '55%',
          background:
            'linear-gradient(to top, rgba(14,38,72,0.90) 0%, rgba(34,106,171,0.52) 55%, transparent 100%)',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-20 flex flex-col items-center text-center p-6 w-full max-w-md mx-auto h-full">

        {/* Monogram */}
        <div
          className={`mb-auto mt-8 transition-all duration-1000 ease-out ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center">
            <div
              className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 transition-transform duration-700 ease-out hover:scale-105"
              style={{
                animation: contentVisible ? 'gentleFloat 3s ease-in-out infinite' : 'none',
              }}
            >
              <CloudinaryImage
                src={siteConfig.couple.monogram}
                alt="Monogram"
                fill
                className="object-contain"
                priority
                style={{
                  filter:
                    'brightness(0) saturate(100%) invert(1) drop-shadow(0 4px 20px rgba(255,255,255,0.25))',
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* Bottom text block */}
        <div className="flex flex-col items-center justify-end w-full gap-5 sm:gap-6 pb-14 sm:pb-16 md:pb-20">

          {/* "You are" */}
          <h2
            className={`text-6xl md:text-8xl transform -rotate-6 transition-all duration-1000 ease-out delay-200 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              fontFamily: '"Great Vibes", cursive',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.92)',
              textShadow: '0 2px 24px rgba(14,38,72,0.55)',
            }}
          >
            You are
          </h2>

          {/* "Invited!" */}
          <h1
            className={`text-5xl md:text-7xl font-bold tracking-wider uppercase transition-all duration-1000 ease-out delay-300 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 700,
              color: '#ffffff',
              textShadow: '0 2px 28px rgba(14,38,72,0.60)',
              letterSpacing: '0.08em',
            }}
          >
            Invited!
          </h1>

          {/* Open Invitation button */}
          <button
            onClick={onOpen}
            className={`px-10 py-4 text-sm tracking-[0.22em] uppercase rounded-sm border-2 transition-all duration-300 ease-out delay-500 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 500,
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderColor: 'rgba(255,255,255,0.65)',
              color: '#ffffff',
              backdropFilter: 'blur(6px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.90)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.65)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Open Invitation
          </button>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
};

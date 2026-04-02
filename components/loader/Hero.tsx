import React, { useEffect, useMemo, useState } from 'react';
import { siteConfig } from '@/content/site';
import { CloudinaryImage } from '@/components/ui/cloudinary-image';

interface HeroProps {
  onOpen: () => void;
  visible: boolean;
}

// Background (beige)          #F5EFE6
// Section Alternate           #E8DCCB
// Soft Brown (headings)       #8B6F5A
// Deep Brown (accents/shadow) #4E3B31
// Champagne Gold (buttons)    #D6BFA3
// Champagne Hover (richer)    #C9A989
// Borders / Dividers          #F2E4D3
  // Palette tuned for champagne gold + beige + soft brown
 // Palette tuned to motif: sage green, muted sage, warm ivory, powder blue, steel blue, luxury silver
 const palette = {
  deep: '--color-motif-deep',    // sage green — primary elegance, headings, borders
  medium: '--color-motif-medium',  // soft muted sage — secondary text, subtle elements
  accent: '--color-motif-accent',  // steel blue — deeper accent, hashtag, dividers
  cream: '--color-motif-cream',   // warm ivory — surfaces, overlays, light text on dark
  soft: '--color-motif-soft',    // powder blue — highlights, glow accents, progress fill
  silver: '--color-motif-silver',  // luxury silver — neutral separators, track backgrounds
};


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
  '/Album/couple (8).jpg'
];

export const Hero: React.FC<HeroProps> = ({ onOpen, visible }) => {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
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
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-8px);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const images = useMemo(() => (isMobile ? mobileImages : desktopImages), [isMobile]);

  return (
      <div className={`fixed inset-0 z-30 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${visible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {images.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
            style={{
              transform: i === index ? 'scale(1)' : 'scale(1.05)',
              transition: 'opacity 1s ease-in-out, transform 1s ease-in-out'
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
        
        {/* Gradient Overlay - light champagne into beige, very soft so photo stays visible */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, var(--color-motif-deep)13, var(--color-motif-cream)47)'
          }}
        />
        
        {/* Subtle vignette effect - soft brown edges, clear warm center */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, var(--color-motif-deep)18 100%)'
            }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 w-full max-w-md mx-auto h-full">
        
        {/* Top Logo/Monogram */}
        <div 
          className={`mb-auto mt-8 transition-all duration-1000 ease-out ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center">
            {/* Monogram Image with subtle animation */}
            <div 
              className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 transition-transform duration-700 ease-out hover:scale-105"
              style={{
                animation: contentVisible ? 'gentleFloat 3s ease-in-out infinite' : 'none'
              }}
            >
              <CloudinaryImage
                src={siteConfig.couple.monogram}
                alt="Monogram"
                fill
                className="object-contain"
                priority
                style={{
                  filter: "brightness(0) saturate(100%) invert(17%) sepia(94%) saturate(1700%) hue-rotate(195deg) brightness(85%) contrast(110%) drop-shadow(0 4px 16px rgba(8,70,127,0.35))",
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex flex-col items-center justify-end w-full gap-5 sm:gap-6 pb-14 sm:pb-16 md:pb-20">
          <h2
            className={`text-6xl md:text-8xl transform -rotate-6 transition-all duration-1000 ease-out delay-200 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              fontFamily: '"Great Vibes", cursive',
              fontWeight: 400,
              color: 'var(--color-motif-deep)', // #F5EFE6
              textShadow: '0 0 18px var(--color-motif-cream)',
            }}
          >
            You are
          </h2>
          
          <h1
            className={`text-5xl md:text-7xl font-bold tracking-wider uppercase transition-all duration-1000 ease-out delay-300 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 700,
              color: 'var(--color-motif-deep)', // #F5EFE6
              textShadow: '0 0 22px var(--color-motif-cream)95',
              letterSpacing: '0.05em',
            }}
          >
            Invited!
          </h1>

          <button 
            onClick={() => {
              onOpen();
            }}
            className={`px-10 py-4 font-serif text-sm tracking-[0.2em] uppercase rounded-sm border transition-all duration-500 ease-out delay-500 shadow-lg hover:shadow-xl ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              backgroundColor: 'var(--color-motif-deep)',
              borderColor: 'var(--color-motif-deep)',
              color: 'var(--color-motif-cream)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-motif-deep)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'var(--color-motif-medium)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-motif-deep)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--color-motif-medium)';
            }}
          >
            <span
              style={{ fontFamily: '"Cinzel", serif', fontWeight: 500, color: 'var(--color-motif-cream)' }}
            >
              Open Invitation
            </span>
          </button>
        </div>

        {/* Bottom Spacer */}
        <div className="h-4" />
      </div>
    </div>
  );
};
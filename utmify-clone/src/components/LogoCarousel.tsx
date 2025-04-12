"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Alterando a interface para tornar src opcional quando isPlaceholder é true
interface Logo {
  src?: string; // src é opcional
  alt: string;
  isPlaceholder?: boolean;
  bgColor?: string;
}

interface LogoCarouselProps {
  logos: Logo[];
  speed?: number; // Velocidade de animação em pixels por segundo
  pauseOnHover?: boolean;
  className?: string;
  showGlow?: boolean;
}

export default function LogoCarousel({
  logos,
  speed = 30,
  pauseOnHover = true,
  className = '',
  showGlow = true,
}: LogoCarouselProps) {
  const [loopLogos, setLoopLogos] = useState<Logo[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [logosWidth, setLogosWidth] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);

  // Verificar se é dispositivo móvel
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Duplica os logos para criar o efeito de loop contínuo
  useEffect(() => {
    // Duplicar os logos para criar um loop contínuo
    setLoopLogos([...logos, ...logos, ...logos]);
  }, [logos]);

  // Mede as dimensões dos contêineres
  useEffect(() => {
    const updateWidths = () => {
      if (containerRef.current && logosRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setLogosWidth(logosRef.current.scrollWidth / 3); // Dividido por 3 porque duplicamos os logos 3 vezes
      }
    };

    updateWidths();
    window.addEventListener('resize', updateWidths);

    return () => window.removeEventListener('resize', updateWidths);
  }, [loopLogos]);

  // Calcula a duração da animação baseada na velocidade
  const duration = logosWidth / speed;

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden relative ${className}`}
      onMouseEnter={() => pauseOnHover && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Efeito de gradiente nas bordas */}
      {showGlow && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-12 z-10 pointer-events-none bg-gradient-to-r from-slate-50 to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 z-10 pointer-events-none bg-gradient-to-l from-slate-50 to-transparent" />
        </>
      )}

      <motion.div
        ref={logosRef}
        className="flex py-4"
        animate={{
          x: [-logosWidth, -logosWidth * 2]
        }}
        transition={{
          duration: hovering ? 0 : duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        {loopLogos.map((logo, index) => (
          <motion.div
            key={`${logo.alt}-${index}`}
            className="flex-shrink-0 mx-2 md:mx-4 flex items-center justify-center bg-white p-3 md:p-4 rounded-md shadow-sm hover:shadow-md"
            style={{
              minWidth: isMobile ? '130px' : '150px',
              height: isMobile ? '70px' : '80px'
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            {logo.isPlaceholder ? (
              <div
                className="h-10 md:h-12 w-28 md:w-36 rounded-md flex items-center justify-center text-white text-sm md:text-base font-semibold"
                style={{ background: logo.bgColor || 'linear-gradient(to right, #3b82f6, #2563eb)' }}
              >
                {logo.alt}
              </div>
            ) : (
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-10 md:h-12 max-w-full object-contain"
              />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

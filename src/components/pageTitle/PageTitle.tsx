import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

type PageTitleProps = {
  title?: string;
};

// dynamically import Particles
const Particles = dynamic(
  () => import('react-tsparticles').then(mod => mod.Particles || mod.default),
  { ssr: false }
);

export default function PageTitle({ title }: PageTitleProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="relative h-[200px] w-full overflow-hidden border-b border-gray-300 shadow-sm bg-[#182f79]">
      {/* <Particles
        id="tsparticles"
        className="absolute inset-0 z-0"
        options={{
          fullScreen: { enable: false },
          background: { color: 'transparent' },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'grab' },
              onClick: { enable: true, mode: 'push' },
              resize: true,
            },
            modes: {
              grab: { distance: 150, links: { opacity: 0.8 } },
              push: { quantity: 4 },
              repulse: { distance: 100, duration: 0.4 },
            },
          },
          particles: {
            number: { value: 80, density: { enable: true, area: 800 } },
            color: { value: '#3b82f6' },
            shape: { type: 'circle' },
            opacity: { value: 0.6 },
            size: { value: { min: 2, max: 4 } },
            links: {
              enable: true,
              distance: 150,
              color: '#3b82f6',
              opacity: 0.5,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              random: false,
              straight: false,
              outModes: { default: 'out' },
            },
          },
          detectRetina: true,
        }}
      /> */}
      <h1 className="text-white text-[25px] absolute bottom-0 left-5 z-10 border-b-4 border-white" >{title}</h1>
    </div>
  );
}
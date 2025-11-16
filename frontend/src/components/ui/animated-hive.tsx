import { useEffect, useState } from 'react';

interface Bee {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  phase: 'leaving' | 'returning';
  delay: number;
}

export function AnimatedHive() {
  const [bees, setBees] = useState<Bee[]>([]);

  useEffect(() => {
    // Initialize bees
    const initialBees: Bee[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 50,
      y: 50,
      angle: (i * 30) + Math.random() * 15,
      speed: 0.5 + Math.random() * 0.5,
      phase: 'leaving',
      delay: i * 0.3,
    }));
    setBees(initialBees);

    // Animate bees
    const interval = setInterval(() => {
      setBees(prevBees =>
        prevBees.map(bee => {
          const currentTime = Date.now() / 1000;
          if (currentTime < bee.delay) return bee;

          const timeInCycle = (currentTime - bee.delay) % 8;
          
          if (timeInCycle < 4) {
            // Leaving the hive
            const progress = timeInCycle / 4;
            const distance = progress * 40;
            return {
              ...bee,
              x: 50 + Math.cos((bee.angle * Math.PI) / 180) * distance,
              y: 50 + Math.sin((bee.angle * Math.PI) / 180) * distance,
              phase: 'leaving',
            };
          } else {
            // Returning to hive
            const progress = (timeInCycle - 4) / 4;
            const distance = (1 - progress) * 40;
            return {
              ...bee,
              x: 50 + Math.cos((bee.angle * Math.PI) / 180) * distance,
              y: 50 + Math.sin((bee.angle * Math.PI) / 180) * distance,
              phase: 'returning',
            };
          }
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full max-w-2xl"
        style={{ filter: 'drop-shadow(0 0 20px rgba(234, 179, 8, 0.3))' }}
      >
        {/* Hexagonal hive structure */}
        <defs>
          <pattern id="honeycomb" x="0" y="0" width="20" height="17.32" patternUnits="userSpaceOnUse">
            <polygon
              points="10,0 15,4.33 15,12.99 10,17.32 5,12.99 5,4.33"
              fill="rgba(234, 179, 8, 0.1)"
              stroke="rgba(234, 179, 8, 0.4)"
              strokeWidth="0.3"
            />
          </pattern>
          
          <radialGradient id="hiveGlow">
            <stop offset="0%" stopColor="rgba(234, 179, 8, 0.3)" />
            <stop offset="100%" stopColor="rgba(234, 179, 8, 0)" />
          </radialGradient>
        </defs>

        {/* Main hive structure */}
        <circle cx="50" cy="50" r="20" fill="url(#hiveGlow)" />
        
        {/* Honeycomb pattern */}
        <g>
          {[0, 1, 2].map(ring => (
            <g key={ring}>
              {Array.from({ length: 6 * (ring + 1) }, (_, i) => {
                const angle = (i * 360) / (6 * (ring + 1));
                const radius = 5 + ring * 4;
                const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
                return (
                  <polygon
                    key={i}
                    points={`${x},${y - 2} ${x + 1.7},${y - 1} ${x + 1.7},${y + 1} ${x},${y + 2} ${x - 1.7},${y + 1} ${x - 1.7},${y - 1}`}
                    fill="rgba(234, 179, 8, 0.15)"
                    stroke="rgba(234, 179, 8, 0.5)"
                    strokeWidth="0.2"
                  />
                );
              })}
            </g>
          ))}
        </g>

        {/* Center hive entrance */}
        <circle cx="50" cy="50" r="3" fill="rgba(0, 0, 0, 0.6)" />
        <circle cx="50" cy="50" r="2.5" fill="rgba(234, 179, 8, 0.3)" />

        {/* Animated bees */}
        {bees.map(bee => (
          <g key={bee.id} transform={`translate(${bee.x}, ${bee.y})`}>
            {/* Bee body */}
            <ellipse
              cx="0"
              cy="0"
              rx="0.8"
              ry="1.2"
              fill="#FFD700"
              opacity={0.9}
            />
            {/* Bee stripes */}
            <line x1="-0.6" y1="-0.4" x2="0.6" y2="-0.4" stroke="#000" strokeWidth="0.15" />
            <line x1="-0.6" y1="0.4" x2="0.6" y2="0.4" stroke="#000" strokeWidth="0.15" />
            
            {/* Wings */}
            <ellipse
              cx="-0.5"
              cy="-0.8"
              rx="0.8"
              ry="0.4"
              fill="rgba(255, 255, 255, 0.6)"
              opacity={bee.phase === 'leaving' ? 0.8 : 0.6}
              transform={`rotate(${bee.phase === 'leaving' ? -20 : 20})`}
            />
            <ellipse
              cx="0.5"
              cy="-0.8"
              rx="0.8"
              ry="0.4"
              fill="rgba(255, 255, 255, 0.6)"
              opacity={bee.phase === 'leaving' ? 0.8 : 0.6}
              transform={`rotate(${bee.phase === 'leaving' ? 20 : -20})`}
            />
            
            {/* Trail effect when flying */}
            {bee.phase === 'leaving' && (
              <circle
                cx="0"
                cy="0"
                r="1.5"
                fill="rgba(234, 179, 8, 0.2)"
                opacity="0.4"
              />
            )}
          </g>
        ))}

        {/* Pulsing glow effect */}
        <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(234, 179, 8, 0.3)" strokeWidth="0.5">
          <animate
            attributeName="r"
            values="25;28;25"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3;0.1;0.3"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}

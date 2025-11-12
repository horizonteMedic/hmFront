import { useState, useEffect } from 'react';
import './Loading.css';

const RINGS_CONFIG = [
  { className: 'pl__ring1', r: 60, strokeWidth: 8, color: 'hsl(3,90%,55%)', dashArray: 377, dashOffset: -376.4 },
  { className: 'pl__ring2', r: 52.5, strokeWidth: 7, color: 'hsl(13,90%,55%)', dashArray: 329.9, dashOffset: -329.3 },
  { className: 'pl__ring3', r: 46, strokeWidth: 6, color: 'hsl(23,90%,55%)', dashArray: 289, dashOffset: -288.6 },
  { className: 'pl__ring4', r: 40.5, strokeWidth: 5, color: 'hsl(33,90%,55%)', dashArray: 254.5, dashOffset: -254 },
  { className: 'pl__ring5', r: 36, strokeWidth: 4, color: 'hsl(43,90%,55%)', dashArray: 226.2, dashOffset: -225.8 },
  { className: 'pl__ring6', r: 32.5, strokeWidth: 3, color: 'hsl(53,90%,55%)', dashArray: 204.2, dashOffset: -203.9 },
];

export function Loading() {
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowText(true), 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className='absolute inset-0 flex flex-col justify-center items-center bg-zinc-500/20 backdrop-blur-sm z-50'>
            <div className="mb-4 fade-in-up">
                <svg 
                    className="pl" 
                    width="128px" 
                    height="128px" 
                    viewBox="0 0 128 128" 
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Cargando"
                >
                    {RINGS_CONFIG.map((ring) => (
                        <circle
                            key={ring.className}
                            className={ring.className}
                            cx="64"
                            cy="64"
                            r={ring.r}
                            fill="none"
                            stroke={ring.color}
                            strokeWidth={ring.strokeWidth}
                            transform="rotate(-90,64,64)"
                            strokeLinecap="round"
                            strokeDasharray={`${ring.dashArray} ${ring.dashArray}`}
                            strokeDashoffset={ring.dashOffset}
                        />
                    ))}
                </svg>
            </div>
            {showText && (
                <div className="fade-in-up">
                    <SlideInText text="Horizonte medic" />
                </div>
            )}
        </div>
    );
}

/* eslint-disable react/prop-types */
function SlideInText({ text }) {
    if (!text || typeof text !== 'string') {
        return null;
    }
    
    return (
        <div className="text-gray-700 dark:text-gray-300 text-base font-medium overflow-hidden" style={{ whiteSpace: 'nowrap' }}>
            {text.split('').map((char, index) => (
                <span 
                    key={`${char}-${index}`} 
                    style={{ 
                        display: 'inline-block', 
                        animationDelay: `${index * 0.05}s` 
                    }} 
                    className="slide-in"
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </div>
    );
}

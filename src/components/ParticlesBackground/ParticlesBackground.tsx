'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    baseX: number;
    baseY: number;
    density: number;
    freq: number; // For "music" vibration
    amp: number;
    phase: number;
}

const ParticlesBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        // Brighter, music-inspired palette (Neon Cyan, Electric Purple, Bright Blue)
        const colors = ['#00f2ff', '#bd00ff', '#0077ff', '#ffffff'];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            const particleCount = Math.min(window.innerWidth * 0.15, 180); // Slightly more particles
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                particles.push({
                    x,
                    y,
                    baseX: x,
                    baseY: y,
                    size: Math.random() * 3 + 1, // Varied sizes
                    speedX: (Math.random() - 0.5) * 1.5,
                    speedY: (Math.random() - 0.5) * 1.5,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    density: (Math.random() * 30) + 1,
                    freq: Math.random() * 0.05 + 0.01,
                    amp: Math.random() * 20,
                    phase: Math.random() * Math.PI * 2
                });
            }
        };

        let time = 0;

        const drawParticles = () => {
            // Use a distinct "clear" to keep it crisp, but maybe a simplified trail?
            // No trail for clearer "antigravity" look
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;

            time += 0.02; // Global time for rhythm

            particles.forEach((p) => {
                // "Music" Vibration: Sine wave movement on top of velocity
                // Creating a subtle "dancing" effect
                const vibrationX = Math.sin(time * p.freq + p.phase) * 0.5;
                const vibrationY = Math.cos(time * p.freq + p.phase) * 0.5;

                p.x += p.speedX + vibrationX;
                p.y += p.speedY + vibrationY;

                // Wrap around screen
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Interaction
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 180;

                // "Antigravity field" around cursor
                if (distance < maxDist) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (maxDist - distance) / maxDist;
                    // Push away stronger
                    const directionX = forceDirectionX * force * p.density * 0.6;
                    const directionY = forceDirectionY * force * p.density * 0.6;

                    p.x += directionX;
                    p.y += directionY;

                    // Connect when close
                    ctx.beginPath();
                    ctx.strokeStyle = p.color;
                    ctx.lineWidth = 0.5 * (1 - distance / maxDist);
                    ctx.globalAlpha = 1 - distance / maxDist;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }

                // Connect particles to each other if close (constellation effect)
                // Only checking a few neighbors for performance
                // ... (Skipping O(N^2) for performance, cursor interaction is key)

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;

                // "Beat" Pulse
                const pulse = Math.sin(time * 2 + p.phase); // Beat
                if (pulse > 0.8) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = p.color;
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(drawParticles);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);

        resize();
        drawParticles();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
        // Added a subtle gradient overlay to the canvas itself if needed, but managing via standard CSS is better.
        // Keeping transparent to let body bg show through.
        />
    );
};

export default ParticlesBackground;

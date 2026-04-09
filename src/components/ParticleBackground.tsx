import { useEffect, useRef } from 'react';

export const ParticleBackground = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<any[]>([]);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    const getParticleColor = () => {
      const isDark = document.documentElement.classList.contains('dark');
      return isDark ? 'rgba(180, 180, 220, 0.5)' : 'rgba(80, 80, 120, 0.45)';
    };

    const getLineColor = (opacity: number) => {
      const isDark = document.documentElement.classList.contains('dark');
      return isDark
        ? `rgba(180, 180, 220, ${opacity})`
        : `rgba(80, 80, 120, ${opacity})`;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      baseSpeedX: number;
      baseSpeedY: number;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 1;
        this.baseSpeedX = Math.random() * 0.4 - 0.2;
        this.baseSpeedY = Math.random() * 0.4 - 0.2;
        this.speedX = this.baseSpeedX;
        this.speedY = this.baseSpeedY;
      }

      update(w: number, h: number) {
        // Mouse interaction
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 180) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (180 - distance) / 180;
          // Push particles away from cursor
          this.speedX = this.baseSpeedX - forceDirectionX * force * 3;
          this.speedY = this.baseSpeedY - forceDirectionY * force * 3;
        } else {
          // Gradually return to base speed
          this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
          this.speedY += (this.baseSpeedY - this.speedY) * 0.05;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x > w) this.x = 0;
        else if (this.x < 0) this.x = w;
        if (this.y > h) this.y = 0;
        else if (this.y < 0) this.y = h;
      }

      draw(context: CanvasRenderingContext2D) {
        context.fillStyle = getParticleColor();
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
      }
    }

    const init = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      particlesRef.current = [];
      const numberOfParticles = Math.min((w * h) / 8000, 200);
      for (let i = 0; i < numberOfParticles; i++) {
        particlesRef.current.push(new Particle(w, h));
      }
    };

    const animate = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      
      ctx.clearRect(0, 0, w, h);
      
      const particles = particlesRef.current;
      
      particles.forEach((particle) => {
        particle.update(w, h);
        particle.draw(ctx);
      });

      // Draw connection lines
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = 0.15 * (1 - distance / 120);
            ctx.strokeStyle = getLineColor(opacity);
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX: number, clientY: number;
      
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      
      mouseRef.current.x = clientX - rect.left;
      mouseRef.current.y = clientY - rect.top;
    };

    const handlePointerLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const handleResize = () => {
      resize();
      init();
    };

    // Use container for mouse events so coordinates are always correct
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove, { passive: true });
    container.addEventListener('mouseleave', handlePointerLeave);
    container.addEventListener('touchend', handlePointerLeave);
    window.addEventListener('resize', handleResize);

    resize();
    init();
    animate();

    return () => {
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('mouseleave', handlePointerLeave);
      container.removeEventListener('touchend', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  );
};

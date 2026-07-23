import React, { useEffect, useRef } from 'react';

const CosmicBackground = ({ children }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      particles = [];
      const numParticles = Math.floor((width * height) / 4000);
      
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.1,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          alpha: Math.random(),
          color: Math.random() > 0.8 ? '#ffd700' : '#c77dff' // Mix of gold and purple
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        
        // Twinkle effect
        p.alpha += (Math.random() - 0.5) * 0.05;
        if (p.alpha < 0.1) p.alpha = 0.1;
        if (p.alpha > 1) p.alpha = 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        
        // Glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
      });
      
      requestAnimationFrame(draw);
    };

    init();
    draw();
    
    window.addEventListener('resize', init);
    return () => window.removeEventListener('resize', init);
  }, []);

  return (
    <div className="relative min-h-screen">
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-[-1]"
        style={{ background: 'radial-gradient(circle at 50% 0%, #05020a 0%, #0a0515 100%)' }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default CosmicBackground;

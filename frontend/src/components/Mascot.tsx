import { useState, useEffect, useRef } from 'react';

export function Mascot() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. 处理鼠标跟随
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      
      // 限制眼球移动范围 (控制在较小的范围，因为本身图标较小)
      const maxMove = 1.5;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      let moveX = 0;
      let moveY = 0;
      
      if (distance > 0) {
        const moveDistance = Math.min(maxMove, distance / 100);
        moveX = (dx / distance) * moveDistance;
        moveY = (dy / distance) * moveDistance;
      }
      
      setMousePos({ x: moveX, y: moveY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 2. 处理随机眨眼
  useEffect(() => {
    const blinkLoop = () => {
      const nextBlink = 2000 + Math.random() * 4000;
      
      setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          blinkLoop();
        }, 150);
      }, nextBlink);
    };
    
    blinkLoop();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-8 h-8 relative cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full drop-shadow-sm">
        {/* 身体底座 */}
        <rect x="2" y="8" width="28" height="20" rx="7" fill="#D97736" />
        
        {/* 猫耳 */}
        <polygon points="6,13 8,3 15,10" fill="#D97736" />
        <polygon points="26,13 24,3 17,10" fill="#D97736" />
        
        {/* 眼睛组 */}
        <g transform={`translate(${mousePos.x}, ${mousePos.y})`}>
          {/* 左眼 */}
          <rect 
            x="8" 
            y={isBlinking ? "17.5" : "14"} 
            width="3" 
            height={isBlinking ? "1" : "8"} 
            rx={isBlinking ? "0.5" : "1.5"} 
            fill="#1E1E1E" 
            className="transition-all duration-100 ease-in-out"
          />
          {/* 右眼 */}
          <rect 
            x="21" 
            y={isBlinking ? "17.5" : "14"} 
            width="3" 
            height={isBlinking ? "1" : "8"} 
            rx={isBlinking ? "0.5" : "1.5"} 
            fill="#1E1E1E" 
            className="transition-all duration-100 ease-in-out"
          />
        </g>
      </svg>
    </div>
  );
}

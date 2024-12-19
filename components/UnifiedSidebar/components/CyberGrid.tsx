'use client';

import React, { useEffect, useRef } from 'react';
import styles from './CyberGrid.module.css';

export function CyberGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawGrid = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gridSize = 40;
      const lineWidth = 0.5;

      ctx.strokeStyle = 'rgba(0, 245, 255, 0.2)';
      ctx.lineWidth = lineWidth;

      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const animate = () => {
      drawGrid();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.cyberGrid} />;
} 
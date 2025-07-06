"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

// Path SVG de ejemplo (ajusta los puntos para tus títulos)
const PATH =
  "M 60 600 Q 200 200 400 400 Q 600 600 900 100";

const FloatingPencil = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0, angle: 0 });

  // Para animar con framer-motion
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);

  useEffect(() => {
    if (!pathRef.current) return;
    setPathLength(pathRef.current.getTotalLength());

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      if (!pathRef.current) return;
      const length = pathRef.current.getTotalLength();
      const point = pathRef.current.getPointAtLength(progress * length);
      // Para la rotación, samplea un poco más adelante
      const delta = 1;
      const next = pathRef.current.getPointAtLength(Math.min(progress * length + delta, length));
      const angle = Math.atan2(next.y - point.y, next.x - point.x) * 180 / Math.PI;
      setPosition({ x: point.x, y: point.y, angle });
      x.set(point.x - 36); // Centra el lápiz (72/2)
      y.set(point.y - 36);
      rotate.set(angle);
    };
    window.addEventListener("scroll", handleScroll);
    // Inicializa posición
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [x, y, rotate]);

  return (
    <>
      {/* Path visual de referencia, puedes ocultarlo luego */}
      <svg style={{position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 10}}>
        <path ref={pathRef} d={PATH} fill="none" stroke="#eee" strokeDasharray="8 8" strokeWidth={2} />
      </svg>
      {/* Lápiz flotante */}
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 72,
          height: 72,
          zIndex: 50,
          x,
          y,
          rotate,
          pointerEvents: "none",
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
      >
        <svg
          width="72" height="72" viewBox="0 0 72 72" fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: "drop-shadow(0 4px 16px rgba(80,80,120,0.18))" }}
        >
          {/* Cuerpo del lápiz */}
          <rect x="22" y="16" width="28" height="32" rx="8" fill="#F4D06F" stroke="#B48A2C" strokeWidth="2" />
          {/* Borrador */}
          <rect x="22" y="8" width="28" height="12" rx="6" fill="#F47C7C" stroke="#B44A4A" strokeWidth="2" />
          {/* Anillo */}
          <rect x="22" y="18" width="28" height="6" rx="3" fill="#E0E0E0" stroke="#B0B0B0" strokeWidth="1.5" />
          {/* Punta */}
          <polygon points="36,48 30,64 42,64" fill="#B48A2C" stroke="#7A5A1E" strokeWidth="2" />
          {/* Mina */}
          <polygon points="36,60 33,68 39,68" fill="#222" />
          {/* Ojo izquierdo */}
          <ellipse cx="30" cy="28" rx="2.2" ry="2.6" fill="#fff" />
          <ellipse cx="30" cy="28" rx="1.1" ry="1.3" fill="#222" />
          {/* Ojo derecho */}
          <ellipse cx="42" cy="28" rx="2.2" ry="2.6" fill="#fff" />
          <ellipse cx="42" cy="28" rx="1.1" ry="1.3" fill="#222" />
          {/* Sonrisa */}
          <path d="M32 36 Q36 40 40 36" stroke="#222" strokeWidth="1.5" fill="none" />
        </svg>
      </motion.div>
    </>
  );
};

export default FloatingPencil;
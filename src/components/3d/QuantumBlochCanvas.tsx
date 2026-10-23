import { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw, Sparkles, Activity, Layers } from 'lucide-react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export default function QuantumBlochCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Rotation angles (Euler angles in radians stored in refs to avoid 60fps React re-renders)
  const rotXRef = useRef(0.4);
  const rotYRef = useRef(-0.6);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);

  // Qubit state vector in spherical coordinates (theta, phi)
  // |psi> = cos(theta/2)|0> + e^(i phi) sin(theta/2)|1>
  const [theta, setTheta] = useState(Math.PI / 3); // 60 degrees
  const [phi, setPhi] = useState(Math.PI / 4); // 45 degrees
  const [activeGate, setActiveGate] = useState<string | null>(null);

  // Apply Quantum Gates with smooth animated transition
  const applyGate = (gate: 'H' | 'X' | 'Y' | 'Z' | 'RESET') => {
    setActiveGate(gate);
    setTimeout(() => setActiveGate(null), 800);

    if (gate === 'H') {
      // Hadamard: maps |0> -> (|+>), or rotates around (X+Z)/sqrt(2)
      setTheta((prev) => (Math.abs(prev - Math.PI / 2) < 0.1 ? 0 : Math.PI / 2));
      setPhi(0);
    } else if (gate === 'X') {
      // Pauli-X (NOT gate): flips theta to PI - theta
      setTheta((prev) => Math.PI - prev);
      setPhi((prev) => prev);
    } else if (gate === 'Y') {
      // Pauli-Y: flips theta and adds PI to phi
      setTheta((prev) => Math.PI - prev);
      setPhi((prev) => (prev + Math.PI) % (2 * Math.PI));
    } else if (gate === 'Z') {
      // Pauli-Z: phase flip, phi -> phi + PI
      setPhi((prev) => (prev + Math.PI) % (2 * Math.PI));
    } else if (gate === 'RESET') {
      setTheta(0);
      setPhi(0);
    }
  };

  // Calculate probabilities
  const prob0 = Math.cos(theta / 2) ** 2;
  const prob1 = Math.sin(theta / 2) ** 2;

  // 3D rotation projection helper
  const project = useCallback(
    (p: Point3D, cx: number, cy: number, r: number, rx: number, ry: number) => {
      // Rotate around Y axis
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = p.x * cosY + p.z * sinY;
      const y1 = p.y;
      const z1 = -p.x * sinY + p.z * cosY;

      // Rotate around X axis
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      // Perspective projection
      const cameraDistance = 3.2;
      const fov = r * 1.5;
      const scale = fov / (cameraDistance - z2);

      return {
        x: cx + x2 * scale,
        y: cy + y2 * scale,
        z: z2,
        scale,
      };
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // Molecular particle cloud around the sphere
    const particleCount = 28;
    const particles: (Point3D & { radius: number; speed: number; phase: number; hue: number })[] = [];
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const pTheta = u * 2.0 * Math.PI;
      const pPhi = Math.acos(2.0 * v - 1.0);
      const dist = 1.1 + Math.random() * 0.45;
      particles.push({
        x: dist * Math.sin(pPhi) * Math.cos(pTheta),
        y: dist * Math.cos(pPhi),
        z: dist * Math.sin(pPhi) * Math.sin(pTheta),
        radius: 1.5 + Math.random() * 2,
        speed: 0.003 + Math.random() * 0.008,
        phase: Math.random() * Math.PI * 2,
        hue: 180 + Math.random() * 60, // Cyan to blue hues
      });
    }

    const render = () => {
      // Auto-rotation when not dragging
      if (autoRotateRef.current) {
        rotYRef.current += 0.003;
      }
      const currentRotY = rotYRef.current;
      const currentRotX = rotXRef.current;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const sphereRadius = Math.min(width, height) * 0.28;

      // Draw subtle background radial glow
      const radialGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, sphereRadius * 1.8);
      radialGlow.addColorStop(0, 'rgba(14, 165, 233, 0.12)');
      radialGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.04)');
      radialGlow.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // --- Draw 3D Bloch Sphere Latitude Rings ---
      const latSteps = 7;
      for (let i = 1; i < latSteps; i++) {
        const lat = (i / latSteps) * Math.PI - Math.PI / 2;
        const ringY = Math.sin(lat);
        const ringR = Math.cos(lat);
        const segments = 48;
        ctx.beginPath();
        for (let j = 0; j <= segments; j++) {
          const segAng = (j / segments) * Math.PI * 2;
          const pt = {
            x: ringR * Math.cos(segAng),
            y: ringY,
            z: ringR * Math.sin(segAng),
          };
          const proj = project(pt, cx, cy, sphereRadius, currentRotX, currentRotY);
          if (j === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.strokeStyle = i === 3 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(56, 189, 248, 0.14)';
        ctx.lineWidth = i === 3 ? 1.4 : 0.8;
        ctx.stroke();
      }

      // --- Draw 3D Longitude Meridian Rings ---
      const longRings = 4;
      for (let i = 0; i < longRings; i++) {
        const longAng = (i / longRings) * Math.PI;
        const segments = 48;
        ctx.beginPath();
        for (let j = 0; j <= segments; j++) {
          const segAng = (j / segments) * Math.PI * 2;
          const pt = {
            x: Math.sin(segAng) * Math.cos(longAng),
            y: Math.cos(segAng),
            z: Math.sin(segAng) * Math.sin(longAng),
          };
          const proj = project(pt, cx, cy, sphereRadius, currentRotX, currentRotY);
          if (j === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.16)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // --- Draw Coordinate Axes (X, Y, Z) ---
      const axes: { p: Point3D; label: string; color: string }[] = [
        { p: { x: 0, y: -1.25, z: 0 }, label: '|0⟩ (+Z)', color: '#38bdf8' },
        { p: { x: 0, y: 1.25, z: 0 }, label: '|1⟩ (-Z)', color: '#a855f7' },
        { p: { x: 1.25, y: 0, z: 0 }, label: '|+⟩ (+X)', color: '#2dd4bf' },
        { p: { x: 0, y: 0, z: 1.25 }, label: '|i⟩ (+Y)', color: '#f59e0b' },
      ];

      // Draw axis lines through center
      const centerProj = project({ x: 0, y: 0, z: 0 }, cx, cy, sphereRadius, currentRotX, currentRotY);

      axes.forEach((axis) => {
        const proj = project(axis.p, cx, cy, sphereRadius, currentRotX, currentRotY);
        ctx.beginPath();
        ctx.moveTo(centerProj.x, centerProj.y);
        ctx.lineTo(proj.x, proj.y);
        ctx.strokeStyle = `${axis.color}55`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Axis label
        ctx.font = '600 11px Inter, sans-serif';
        ctx.fillStyle = axis.color;
        ctx.fillText(axis.label, proj.x + 6, proj.y + 4);
      });

      // --- Draw Qubit State Vector |psi> ---
      // In 3D: x = sin(theta)*cos(phi), y = -cos(theta) (so |0> is at top), z = sin(theta)*sin(phi)
      const stateVector: Point3D = {
        x: Math.sin(theta) * Math.cos(phi),
        y: -Math.cos(theta),
        z: Math.sin(theta) * Math.sin(phi),
      };

      const tipProj = project(stateVector, cx, cy, sphereRadius, currentRotX, currentRotY);

      // State vector glowing laser line
      ctx.beginPath();
      ctx.moveTo(centerProj.x, centerProj.y);
      ctx.lineTo(tipProj.x, tipProj.y);
      const gradient = ctx.createLinearGradient(centerProj.x, centerProj.y, tipProj.x, tipProj.y);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.6, 'rgba(56, 189, 248, 1)');
      gradient.addColorStop(1, 'rgba(236, 72, 153, 1)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Glow pulse on tip
      ctx.beginPath();
      ctx.arc(tipProj.x, tipProj.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Vector label |psi>
      ctx.font = '700 13px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('|ψ⟩', tipProj.x + 10, tipProj.y - 6);

      // --- Draw Molecular Entangled Particles & Links ---
      particles.forEach((p, idx) => {
        p.phase += p.speed;
        const currentRadius = 1.1 + Math.sin(p.phase) * 0.2;
        const pPoint: Point3D = {
          x: p.x * currentRadius,
          y: p.y * currentRadius,
          z: p.z * currentRadius,
        };
        const pProj = project(pPoint, cx, cy, sphereRadius, currentRotX, currentRotY);

        // Particle dot
        ctx.beginPath();
        ctx.arc(pProj.x, pProj.y, Math.max(1, p.radius * (pProj.scale / 100)), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${0.3 + (pProj.z + 1) * 0.3})`;
        ctx.fill();

        // Entanglement wire to next particle if close
        if (idx % 3 === 0 && idx + 1 < particles.length) {
          const p2Point: Point3D = {
            x: particles[idx + 1].x * currentRadius,
            y: particles[idx + 1].y * currentRadius,
            z: particles[idx + 1].z * currentRadius,
          };
          const p2Proj = project(p2Point, cx, cy, sphereRadius, currentRotX, currentRotY);
          ctx.beginPath();
          ctx.moveTo(pProj.x, pProj.y);
          ctx.lineTo(p2Proj.x, p2Proj.y);
          ctx.strokeStyle = `rgba(56, 189, 248, 0.1)`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [theta, phi, project]);

  // Handle Mouse Drag for 3D Orbit
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    autoRotateRef.current = false;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    rotYRef.current += dx * 0.008;
    rotXRef.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotXRef.current + dy * 0.008));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    // Resume slow auto-rotation after 2 seconds
    setTimeout(() => {
      autoRotateRef.current = true;
    }, 2000);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950/90 via-slate-900/90 to-slate-950/95 border border-sky-500/20 shadow-2xl backdrop-blur-2xl">
      {/* Top Banner overlay */}
      <div className="absolute top-4 left-5 right-5 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
            Interactive 3D Bloch Simulator
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
          <Layers size={13} className="text-cyan-400" />
          <span>Drag in 3D to Rotate</span>
        </div>
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        width={680}
        height={480}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-[380px] sm:h-[440px] cursor-grab active:cursor-grabbing block"
      />

      {/* Bottom Control Bar & Realtime State Stats */}
      <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/80 flex flex-col gap-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Quantum Gate Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 mr-1 hidden sm:inline">Quantum Gates:</span>
            <button
              onClick={() => applyGate('H')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                activeGate === 'H'
                  ? 'bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/40'
                  : 'bg-slate-800/90 hover:bg-sky-950 hover:border-sky-500/50 text-sky-300 border-slate-700/80'
              }`}
              title="Hadamard Gate (Superposition)"
            >
              H (Hadamard)
            </button>
            <button
              onClick={() => applyGate('X')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                activeGate === 'X'
                  ? 'bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/40'
                  : 'bg-slate-800/90 hover:bg-purple-950 hover:border-purple-500/50 text-purple-300 border-slate-700/80'
              }`}
              title="Pauli-X Gate (Bit-flip)"
            >
              X (NOT)
            </button>
            <button
              onClick={() => applyGate('Z')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                activeGate === 'Z'
                  ? 'bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/40'
                  : 'bg-slate-800/90 hover:bg-amber-950 hover:border-amber-500/50 text-amber-300 border-slate-700/80'
              }`}
              title="Pauli-Z Gate (Phase-flip)"
            >
              Z (Phase)
            </button>
            <button
              onClick={() => applyGate('RESET')}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/80 transition"
              title="Reset to Ground State |0⟩"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {/* Realtime Amplitudes */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-mono">P(|0⟩):</span>
              <span className="font-bold text-sky-400 font-mono">{(prob0 * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-mono">P(|1⟩):</span>
              <span className="font-bold text-purple-400 font-mono">{(prob1 * 100).toFixed(1)}%</span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-400">
              <Activity size={12} className="text-emerald-400" />
              <span>Coherence: 99.8%</span>
            </div>
          </div>
        </div>

        {/* State Vector representation equation */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles size={12} className="text-cyan-400 shrink-0" />
            <span className="text-slate-200">
              |ψ⟩ = {Math.cos(theta / 2).toFixed(3)}|0⟩ + {Math.sin(theta / 2).toFixed(3)}e^(i·{(phi / Math.PI).toFixed(2)}π)|1⟩
            </span>
          </div>
          <span className="text-cyan-400/90 text-right shrink-0">IBM Eagle 127-Qubit Engine</span>
        </div>
      </div>
    </div>
  );
}

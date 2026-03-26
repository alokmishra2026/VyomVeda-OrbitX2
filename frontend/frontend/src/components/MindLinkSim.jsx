import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Activity, Zap, Play } from 'lucide-react';
import * as THREE from 'three';

const MindLinkSim = () => {
  const [isLinking, setIsLinking] = useState(false);
  const [brainWave, setBrainWave] = useState(0);
  const [roverPos, setRoverPos] = useState({ x: 50, y: 50 });
  const [targetPos, setTargetPos] = useState({ x: 80, y: 20 });
  const [neuralStability, setNeuralStability] = useState(100);
  const [missionComplete, setMissionComplete] = useState(false);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const roverGroupRef = useRef(null);
  const targetMeshRef = useRef(null);

  // Simulation Logic
  useEffect(() => {
    let interval;
    if (isLinking && !missionComplete) {
      interval = setInterval(() => {
        setBrainWave(Math.random() * 100);
        const noise = Math.random() * 5;
        setNeuralStability(prev => Math.max(0, prev - (0.05 + noise / 50)));

        setRoverPos(prev => {
           const dist = Math.sqrt(Math.pow(prev.x - targetPos.x, 2) + Math.pow(prev.y - targetPos.y, 2));
           if (dist < 5) {
              setMissionComplete(true);
           }
           return prev;
        });
      }, 100);
    } else {
       setBrainWave(0);
    }
    return () => clearInterval(interval);
  }, [isLinking, missionComplete, targetPos]);

  // Key Controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLinking) return;
      const step = 2;
      setRoverPos(prev => {
        let nx = prev.x;
        let ny = prev.y;
        if (e.key === 'ArrowUp') ny = Math.max(0, prev.y - step);
        if (e.key === 'ArrowDown') ny = Math.min(100, prev.y + step);
        if (e.key === 'ArrowLeft') nx = Math.max(0, prev.x - step);
        if (e.key === 'ArrowRight') nx = Math.min(100, prev.x + step);
        return { x: nx, y: ny };
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLinking]);

  // Three.js Setup
  useEffect(() => {
    if (!isLinking || !canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000');
    scene.fog = new THREE.FogExp2(0x000000, 0.05);

    const camera = new THREE.PerspectiveCamera(50, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.1, 100);
    camera.position.set(0, 8, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x4ade80, 1.5, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const fillLight = new THREE.PointLight(0xffffff, 0.5, 50);
    fillLight.position.set(-10, 5, -10);
    scene.add(fillLight);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(20, 20, 0x064e3b, 0x064e3b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Stars background
    const starGeo = new THREE.BufferGeometry();
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
    const starVerts = [];
    for(let i=0; i<1000; i++) {
        starVerts.push((Math.random()-0.5)*40, (Math.random()-0.5)*40, (Math.random()-0.5)*40);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Rover Group
    const roverGroup = new THREE.Group();
    scene.add(roverGroup);
    roverGroupRef.current = roverGroup;

    // Rover Body geometry
    const bodyGeo = new THREE.BoxGeometry(1, 0.3, 1.2);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, metalness: 0.8, roughness: 0.3 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.5;
    roverGroup.add(body);

    // Outline
    const outlineGeo = new THREE.BoxGeometry(1.05, 0.35, 1.25);
    const outlineMat = new THREE.MeshBasicMaterial({ color: 0x4ade80, wireframe: true });
    const outline = new THREE.Mesh(outlineGeo, outlineMat);
    outline.position.y = 0.5;
    roverGroup.add(outline);

    // Wheels
    [-0.6, 0.6].forEach(x => {
        [-0.5, 0.5].forEach(z => {
            const wheelGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16);
            const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.position.set(x, 0.2, z);
            wheel.rotation.z = Math.PI / 2;
            roverGroup.add(wheel);
        });
    });

    // Target Marker
    const targetGeo = new THREE.OctahedronGeometry(0.4);
    const targetMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 2 });
    const targetMesh = new THREE.Mesh(targetGeo, targetMat);
    scene.add(targetMesh);
    targetMeshRef.current = targetMesh;

    let time = 0;
    const animate = () => {
      const animId = requestAnimationFrame(animate);
      time += 0.05;

      // Float effect for target
      if (targetMeshRef.current) {
          targetMeshRef.current.position.y = 0.5 + Math.sin(time) * 0.2;
          targetMeshRef.current.rotation.y += 0.02;
          targetMeshRef.current.rotation.x += 0.01;
      }

      stars.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvasRef.current && renderer.domElement) {
         canvasRef.current.removeChild(renderer.domElement);
         renderer.dispose();
      }
    };
  }, [isLinking]);

  // Update Rover and Target Position when state changes
  useEffect(() => {
    if (roverGroupRef.current) {
        // Map 0-100 state to -5 to +5 3D space
        roverGroupRef.current.position.x = (roverPos.x / 10) - 5;
        roverGroupRef.current.position.z = (roverPos.y / 10) - 5;
    }
    if (targetMeshRef.current) {
        targetMeshRef.current.position.x = (targetPos.x / 10) - 5;
        targetMeshRef.current.position.z = (targetPos.y / 10) - 5;
        if (missionComplete) {
            targetMeshRef.current.visible = false;
        } else {
            targetMeshRef.current.visible = true;
        }
    }
  }, [roverPos, targetPos, missionComplete]);


  return (
    <div className="glass-panel p-8 border-green-500/30 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #00ff00 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <h2 className="text-2xl font-bold mb-8 flex items-center italic text-green-400">
         <BrainCircuit className="w-8 h-8 mr-4" />
         NEURAL LINK: ROVER COMMAND
      </h2>

      {!isLinking ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-6 z-10"
        >
          <div className="w-32 h-32 rounded-full border-2 border-green-500/30 flex items-center justify-center mx-auto animate-pulse">
             <BrainCircuit className="w-16 h-16 text-green-500/50" />
          </div>
          <p className="text-gray-400 max-w-sm uppercase tracking-widest text-xs font-bold leading-relaxed">
             Place your hand near the sensor to initiate a BCI link with the Alpha Rover.
          </p>
          <button 
            onClick={() => setIsLinking(true)}
            className="px-10 py-4 glass-panel neon-border-green text-green-400 font-bold hover:bg-green-500 hover:text-black transition-all uppercase tracking-widest flex items-center gap-3 mx-auto"
          >
            <Play className="w-4 h-4" /> INITIALIZE LINK
          </button>
        </motion.div>
      ) : (
        <div className="w-full h-full flex flex-col md:flex-row gap-12 z-10">
          <div className="flex-1 space-y-8">
             <div className="glass-panel p-6 border-white/5 bg-black/40">
                <div className="flex justify-between items-center mb-4">
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Brain-Wave Activity</h4>
                   <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                </div>
                <div className="h-16 flex items-end gap-1">
                   {Array.from({ length: 30 }).map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: `${Math.random() * 100}%` }}
                        className="flex-1 bg-green-500/50 rounded-t"
                      />
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div className="glass-panel p-4 border-white/5">
                   <p className="text-[10px] text-gray-500 font-bold mb-1">STABILITY</p>
                   <p className={`text-xl font-bold font-mono ${neuralStability < 30 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
                      {neuralStability.toFixed(1)}%
                   </p>
                </div>
                <div className="glass-panel p-4 border-white/5">
                   <p className="text-[10px] text-gray-500 font-bold mb-1">SYNAPSE TRAFFIC</p>
                   <p className="text-xl font-bold font-mono text-cyan-400">{brainWave.toFixed(0)} MHz</p>
                </div>
             </div>

             <div className="p-4 bg-yellow-500/10 border border-yellow-500/40 rounded-xl text-yellow-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
                <Zap className="w-4 h-4" /> Use Arrow Keys to relay neural pulses to rover.
             </div>
             
             <button 
               onClick={() => setIsLinking(false)}
               className="w-full py-3 glass-panel border-red-500/50 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-black transition-all"
             >
               TERMINATE LINK
             </button>
          </div>

          <div className="flex-[1.5] relative aspect-square bg-gray-900 rounded-3xl border border-white/10 overflow-hidden group">
             <div className="absolute inset-4 border border-white/5 rounded-2xl flex flex-col items-center justify-center">
                <div className="absolute top-0 left-0 p-4">
                   <p className="text-[8px] text-gray-600 font-mono">MISSION: RED_VALLEY_PROBE</p>
                </div>
                <div className="absolute top-4 right-4 z-40 bg-black/50 border border-green-500/30 px-2 py-1 rounded">
                   <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest">WebXR: Live Feed</p>
                </div>

                {/* Vanilla Three.js Mount Point */}
                <div ref={canvasRef} className="absolute inset-0" />

                <AnimatePresence>
                  {missionComplete && (
                    <motion.div 
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.8 }}
                       className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                       <div className="text-center p-8 glass-panel border-blue-500">
                          <h3 className="text-2xl font-bold text-blue-400 mb-2 italic">MISSION SUCCESS</h3>
                          <p className="text-xs text-gray-400 uppercase tracking-widest mb-6">Neural Link Synced: Sample Recovered</p>
                          <button 
                            onClick={() => {
                              setMissionComplete(false);
                              setRoverPos({ x: 50, y: 50 });
                              setTargetPos({ x: Math.random()*80 + 10, y: Math.random()*80 + 10 });
                              setNeuralStability(100);
                            }}
                            className="px-6 py-2 glass-panel neon-border-blue text-xs font-bold hover:bg-[var(--neon-blue)] hover:text-black transition-all"
                          >
                            NEW MISSION
                          </button>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MindLinkSim;

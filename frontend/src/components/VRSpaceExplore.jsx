import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Glasses, Power, Focus, Loader, ShieldCheck, Orbit, Activity } from 'lucide-react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

const VRSpaceExplore = ({ onExit }) => {
  const [stage, setStage] = useState('CALIBRATING'); 
  const containerRef = useRef(null);
  const [vrSupported, setVrSupported] = useState(true);

  useEffect(() => {
    // Calibration Sequence
    const t1 = setTimeout(() => setStage('SYNCING'), 1500);
    const t2 = setTimeout(() => setStage('ACTIVE'), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (stage !== 'ACTIVE' || !containerRef.current) return;

    // Check VR Support
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        setVrSupported(supported);
      });
    } else {
      setVrSupported(false);
    }

    const { clientWidth, clientHeight } = containerRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000005);
    scene.fog = new THREE.FogExp2(0x000005, 0.002);

    const camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 3); // 1.6m is typical VR eye height

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(clientWidth, clientHeight);
    renderer.xr.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // VR Button injection
    const vrButton = VRButton.createButton(renderer);
    vrButton.style.position = 'absolute';
    vrButton.style.bottom = '40px';
    vrButton.style.left = '50%';
    vrButton.style.transform = 'translateX(-50%)';
    vrButton.style.zIndex = '50';
    containerRef.current.appendChild(vrButton);

    // Group for VR rotation (so camera moves with headset, while scene rotates slightly)
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Add Stars
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPos = new Float32Array(starCount * 3);
    for(let i=0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 400;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    const stars = new THREE.Points(starGeo, starMat);
    worldGroup.add(stars);

    // Add a glowing Planet
    const planetGeo = new THREE.SphereGeometry(2, 64, 64);
    const planetMat = new THREE.MeshStandardMaterial({ 
      color: 0x0088ff,
      emissive: 0x002244,
      roughness: 0.8,
      metalness: 0.2
    });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    planet.position.set(0, 1.6, -10);
    worldGroup.add(planet);

    // Add rings to planet
    const ringGeo = new THREE.RingGeometry(3, 4, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2 + 0.2;
    planet.add(ring);

    // Add an orbiting Satellite
    const satGeo = new THREE.BoxGeometry(0.5, 0.2, 0.5);
    const satMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const satellite = new THREE.Mesh(satGeo, satMat);
    worldGroup.add(satellite);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 2, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Variables for the animation loop
    let angle = 0;
    let localFrameId;

    // Animation Loop
    const animate = () => {
      planet.rotation.y += 0.005;
      ring.rotation.z -= 0.01;

      // Orbit satellite around planet
      angle += 0.02;
      satellite.position.set(
        planet.position.x + Math.cos(angle) * 4,
        planet.position.y + Math.sin(angle * 0.5) * 1,
        planet.position.z + Math.sin(angle) * 4
      );
      satellite.rotation.y -= 0.02;
      satellite.rotation.x += 0.01;

      // In non-VR mode, slowly rotate the whole world for dramatic effect
      if (!renderer.xr.isPresenting) {
         worldGroup.rotation.y += 0.001;
      }

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        if (renderer.domElement.parentNode === containerRef.current) {
           containerRef.current.removeChild(renderer.domElement);
        }
        if (vrButton && vrButton.parentNode === containerRef.current) {
           containerRef.current.removeChild(vrButton);
        }
      }
      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
      planetGeo.dispose();
      planetMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      satGeo.dispose();
      satMat.dispose();
    };
  }, [stage]);

  if (stage !== 'ACTIVE') {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono text-cyan-500 space-y-8"
      >
         <Glasses className="w-32 h-32 animate-pulse text-[var(--neon-blue)]" />
         <div className="text-center space-y-4">
           <h2 className="text-2xl font-bold uppercase tracking-widest text-white">
             {stage === 'CALIBRATING' ? 'Calibrating Optical Sensors' : 'Synchronizing Neural Link'}
           </h2>
           <p className="text-sm tracking-widest animate-pulse">
             {stage === 'CALIBRATING' ? 'Please keep your headset stationary.' : 'Establishing geospatial orbit lock...'}
           </p>
         </div>
         <Loader className="w-12 h-12 animate-[spin_1.5s_linear_infinite]" />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black overflow-hidden font-mono"
    >
       {/* 3D Canvas Container */}
       <div ref={containerRef} className="absolute inset-0 z-0"></div>
       
       {/* HUD UI overlay */}
       <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-10">
          
          <div className="flex justify-between items-start w-full relative">
             {/* Left HUD Panel */}
             <div className="text-cyan-400 text-[10px] space-y-6">
                <div className="border-l-2 border-cyan-500 pl-4 py-2 bg-gradient-to-r from-cyan-900/50 to-transparent">
                    <h3 className="text-white font-bold text-xs uppercase mb-2 flex items-center gap-2"><Activity className="w-4 h-4"/> Vital Signs</h3>
                    <p>O2 SATURATION: 99.4%</p>
                    <p>HEART RATE: 72 BPM</p>
                    <p>SUIT PRESSURE: 4.3 PSI</p>
                </div>
                <div className="border-l-2 border-blue-500 pl-4 py-2 bg-gradient-to-r from-blue-900/50 to-transparent">
                    <h3 className="text-white font-bold text-xs uppercase mb-2 flex items-center gap-2"><Orbit className="w-4 h-4"/> Orbital Sync</h3>
                    <p>ALTITUDE: 408 KM</p>
                    <p>VELOCITY: 7.66 KM/S</p>
                    <p>PITCH/YAW: STABLE</p>
                </div>
             </div>

             {/* Center Notifications */}
             <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center gap-4">
                {!vrSupported && (
                   <div className="bg-red-900/50 border border-red-500 text-red-100 px-6 py-2 rounded-full uppercase tracking-widest text-xs animate-pulse">
                     VR Not Supported - Fallback to 3D Orbit View
                   </div>
                )}
             </div>

             {/* Right HUD Panel */}
             <div className="text-cyan-400 text-[10px] space-y-6 text-right">
                <div className="border-r-2 border-cyan-500 pr-4 py-2 bg-gradient-to-l from-cyan-900/50 to-transparent">
                    <h3 className="text-white font-bold text-xs uppercase mb-2 flex items-center justify-end gap-2"><ShieldCheck className="w-4 h-4"/> Integrity</h3>
                    <p>HULL ARMOR: 100%</p>
                    <p>RADIATION SHIELD: ACTIVE</p>
                    <p>LIFE SUPPORT: OPTIMAL</p>
                </div>
             </div>
          </div>

          {/* Central Targeting Reticle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-30">
             <div className="w-64 h-64 border border-cyan-500 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                <div className="w-60 h-60 border-t-2 border-b-2 border-cyan-400 rounded-full animate-[spin_10s_linear_infinite_reverse]"></div>
             </div>
             <Focus className="absolute w-8 h-8 text-cyan-400" />
          </div>

          <div className="flex justify-between items-end w-full">
             {/* Bottom Data Scroll */}
             <div className="w-1/2 border-b border-cyan-500/50 pb-2 text-left">
                <p className="text-[10px] text-cyan-300 uppercase tracking-[0.3em] truncate">
                  TRANSMISSION INCOMING // SECTOR 7 CLEAR // AWAITING COMMAND PROTOCOL
                </p>
             </div>
             {/* Disconnect Control */}
             <div className="pointer-events-auto">
                <button 
                  onClick={onExit}
                  className="border border-red-500 bg-black/50 text-red-500 px-6 py-3 rounded uppercase font-bold text-xs hover:bg-red-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,0,0,0.4)]"
                >
                   <Power className="w-4 h-4 inline mr-2" /> Disconnect VR
                </button>
             </div>
          </div>

       </div>
    </motion.div>
  );
};

export default VRSpaceExplore;

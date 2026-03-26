import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Settings, Cpu, Zap, Radio, Rocket, ShoppingCart, Orbit } from 'lucide-react';
import * as THREE from 'three';

const SatBuilder = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState('power');
  const [config, setConfig] = useState({
    power: { id: 'solar', name: 'Standard Solar Array', price: 50000, desc: 'Reliable 100W multi-junction solar panels.', stats: { pwr: 4, life: 6 } },
    sensor: { id: 'optical', name: 'Optical Camera Array', price: 75000, desc: '4K resolution optical earth observation.', stats: { rng: 5, res: 8 } },
    comms: { id: 'rf', name: 'RF Transceiver', price: 30000, desc: 'S-band radio-frequency communication.', stats: { bw: 4, sec: 5 } },
    propulsion: { id: 'none', name: 'No Propulsion (Passive)', price: 0, desc: 'Relies on orbital decay.', stats: { thrust: 0, fuel: 0 } }
  });

  const [orderComplete, setOrderComplete] = useState(false);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const satGroupRef = useRef(null);
  const sceneRef = useRef(null);

  // Configuration Options
  const options = {
    power: [
      { id: 'solar', name: 'Standard Solar Array', price: 50000, desc: 'Reliable 100W multi-junction solar panels.', stats: { pwr: 4, life: 6 } },
      { id: 'rtg', name: 'RTG Micro-Nuclear', price: 250000, desc: 'Deep-space nuclear isotope generator.', stats: { pwr: 9, life: 10 } }
    ],
    sensor: [
      { id: 'optical', name: 'Optical Camera Array', price: 75000, desc: '4K resolution optical earth observation.', stats: { rng: 5, res: 8 } },
      { id: 'infrared', name: 'Thermal/Infrared Array', price: 120000, desc: 'Heat-mapping and disaster observation.', stats: { rng: 7, res: 6 } },
      { id: 'radar', name: 'SAR Radar Array', price: 180000, desc: 'Synthetic Aperture Radar for cloud penetration.', stats: { rng: 9, res: 9 } }
    ],
    comms: [
      { id: 'rf', name: 'RF Transceiver', price: 30000, desc: 'S-band radio-frequency communication.', stats: { bw: 4, sec: 5 } },
      { id: 'laser', name: 'Laser Optical Link', price: 95000, desc: 'High-bandwidth secure laser communication.', stats: { bw: 10, sec: 10 } }
    ],
    propulsion: [
      { id: 'none', name: 'No Propulsion (Passive)', price: 0, desc: 'Drift orbit. Relies on natural orbital decay.', stats: { thrust: 0, fuel: 0 } },
      { id: 'ion', name: 'Hall-Effect Ion Thruster', price: 150000, desc: 'High specific impulse for orbit maintenance.', stats: { thrust: 3, fuel: 8 } },
      { id: 'chemical', name: 'Hydrazine Thruster', price: 80000, desc: 'High thrust for rapid orbital maneuvers.', stats: { thrust: 8, fuel: 4 } }
    ]
  };

  const calculateTotal = () => Object.values(config).reduce((acc, curr) => acc + curr.price, 0);
  const handleSelect = (category, item) => setConfig({ ...config, [category]: item });
  const formatPrice = (num) => '$' + num.toLocaleString();

  // Three.js Render Logic
  useEffect(() => {
    if (orderComplete || !canvasRef.current) return;

    // Initialize Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#000000');
    scene.fog = new THREE.FogExp2(0x000000, 0.05);

    const camera = new THREE.PerspectiveCamera(45, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.1, 100);
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    
    const p1 = new THREE.PointLight(0xffffff, 1.5, 50);
    p1.position.set(10, 10, 10);
    scene.add(p1);

    const p2 = new THREE.PointLight(0x00f3ff, 0.8, 50);
    p2.position.set(-10, -10, -10);
    scene.add(p2);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.8 });
    const starVerts = [];
    for(let i=0; i<1000; i++) {
        starVerts.push((Math.random()-0.5)*40, (Math.random()-0.5)*40, (Math.random()-0.5)*40);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Satellite Group
    const satGroup = new THREE.Group();
    scene.add(satGroup);
    satGroupRef.current = satGroup;

    // Build Satellite based on config
    const buildSat = () => {
      // Clear previous children
      while(satGroup.children.length > 0){ 
        const child = satGroup.children[0];
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
        satGroup.remove(child); 
      }

      // Core Box
      const coreGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const coreMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, metalness: 0.8, roughness: 0.2 });
      satGroup.add(new THREE.Mesh(coreGeo, coreMat));

      const edgeGeo = new THREE.BoxGeometry(1.55, 1.55, 1.55);
      const edgeMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.3 });
      satGroup.add(new THREE.Mesh(edgeGeo, edgeMat));

      // Power
      if(config.power.id === 'solar') {
        [-2.4, 2.4].forEach(x => {
            const panelGeo = new THREE.BoxGeometry(2.8, 0.05, 1.2);
            const panelMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.9, roughness: 0.1 });
            const panel = new THREE.Mesh(panelGeo, panelMat);
            panel.position.set(x, 0, 0);
            satGroup.add(panel);

            const gridGeo = new THREE.BoxGeometry(2.8, 0.06, 1.2);
            const gridMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.2 });
            const grid = new THREE.Mesh(gridGeo, gridMat);
            grid.position.set(x, 0, 0);
            satGroup.add(grid);
        });
      } else if (config.power.id === 'rtg') {
         const rtgGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16);
         const rtgMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.9, roughness: 0.4 });
         const rtg = new THREE.Mesh(rtgGeo, rtgMat);
         rtg.position.set(0, -1.2, 0);
         satGroup.add(rtg);

         const wg = new THREE.Mesh(rtgGeo, new THREE.MeshBasicMaterial({ color: 0xfb923c, wireframe: true }));
         wg.position.set(0, -1.2, 0);
         satGroup.add(wg);
      }

      // Comms
      if(config.comms.id === 'rf') {
         const rfGeo = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
         const rfMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.5, roughness: 0.5, side: THREE.DoubleSide });
         const rf = new THREE.Mesh(rfGeo, rfMat);
         rf.position.set(0, 1.0, 0);
         rf.rotation.x = -Math.PI / 2;
         satGroup.add(rf);
      } else if (config.comms.id === 'laser') {
         const lzrGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
         const lzrMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8, roughness: 0.2, emissive: 0xef4444, emissiveIntensity: 2 });
         const lzr = new THREE.Mesh(lzrGeo, lzrMat);
         lzr.position.set(0, 1.2, 0);
         satGroup.add(lzr);
      }

      // Sensor
      if(config.sensor.id === 'optical') {
         const optGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32);
         const optMat = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 1, roughness: 0 });
         const opt = new THREE.Mesh(optGeo, optMat);
         opt.position.set(0, 0, 0.8);
         opt.rotation.x = Math.PI / 2;
         satGroup.add(opt);
      } else if (config.sensor.id === 'radar') {
         const radGeo = new THREE.BoxGeometry(1.2, 0.1, 1.2);
         const radMat = new THREE.MeshStandardMaterial({ color: 0xfcd34d, metalness: 0.3, roughness: 0.8 });
         const rad = new THREE.Mesh(radGeo, radMat);
         rad.position.set(0, -1.0, 0.5);
         satGroup.add(rad);
      } else if (config.sensor.id === 'infrared') {
         const irGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
         const irMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.5, roughness: 0.2, emissive: 0x8b5cf6, emissiveIntensity: 1 });
         const ir = new THREE.Mesh(irGeo, irMat);
         ir.position.set(0, 0, 0.8);
         satGroup.add(ir);
      }
    };

    buildSat();

    // Animation Loop
    let time = 0;
    const animate = () => {
      const animId = requestAnimationFrame(animate);
      time += 0.02;

      // Gentle float & rotate
      if (satGroupRef.current) {
         satGroupRef.current.rotation.y += 0.005;
         satGroupRef.current.position.y = Math.sin(time) * 0.2;
         satGroupRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
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
  }, [orderComplete]); 
  // We don't re-init the whole scene on config change, we just rebuild the satellite below.

  // Rebuild the satellite group whenever config changes
  useEffect(() => {
    if (!satGroupRef.current || !sceneRef.current) return;
    
    // Clear previous children
    while(satGroupRef.current.children.length > 0){ 
      const child = satGroupRef.current.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      satGroupRef.current.remove(child); 
    }

    // Core Box
    const coreGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, metalness: 0.8, roughness: 0.2 });
    satGroupRef.current.add(new THREE.Mesh(coreGeo, coreMat));

    const edgeGeo = new THREE.BoxGeometry(1.55, 1.55, 1.55);
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.3 });
    satGroupRef.current.add(new THREE.Mesh(edgeGeo, edgeMat));

    // Power
    if(config.power.id === 'solar') {
      [-2.4, 2.4].forEach(x => {
          const panelGeo = new THREE.BoxGeometry(2.8, 0.05, 1.2);
          const panelMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.9, roughness: 0.1 });
          const panel = new THREE.Mesh(panelGeo, panelMat);
          panel.position.set(x, 0, 0);
          satGroupRef.current.add(panel);

          const gridGeo = new THREE.BoxGeometry(2.8, 0.06, 1.2);
          const gridMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.2 });
          const grid = new THREE.Mesh(gridGeo, gridMat);
          grid.position.set(x, 0, 0);
          satGroupRef.current.add(grid);
      });
    } else if (config.power.id === 'rtg') {
       const rtgGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16);
       const rtgMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.9, roughness: 0.4 });
       const rtg = new THREE.Mesh(rtgGeo, rtgMat);
       rtg.position.set(0, -1.2, 0);
       satGroupRef.current.add(rtg);

       const wg = new THREE.Mesh(rtgGeo, new THREE.MeshBasicMaterial({ color: 0xfb923c, wireframe: true }));
       wg.position.set(0, -1.2, 0);
       satGroupRef.current.add(wg);
    }

    // Comms
    if(config.comms.id === 'rf') {
       const rfGeo = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
       const rfMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.5, roughness: 0.5, side: THREE.DoubleSide });
       const rf = new THREE.Mesh(rfGeo, rfMat);
       rf.position.set(0, 1.0, 0);
       rf.rotation.x = -Math.PI / 2;
       satGroupRef.current.add(rf);
    } else if (config.comms.id === 'laser') {
       const lzrGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
       const lzrMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8, roughness: 0.2, emissive: 0xef4444, emissiveIntensity: 2 });
       const lzr = new THREE.Mesh(lzrGeo, lzrMat);
       lzr.position.set(0, 1.2, 0);
       satGroupRef.current.add(lzr);
    }

    // Sensor
    if(config.sensor.id === 'optical') {
       const optGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32);
       const optMat = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 1, roughness: 0 });
       const opt = new THREE.Mesh(optGeo, optMat);
       opt.position.set(0, 0, 0.8);
       opt.rotation.x = Math.PI / 2;
       satGroupRef.current.add(opt);
    } else if (config.sensor.id === 'radar') {
       const radGeo = new THREE.BoxGeometry(1.2, 0.1, 1.2);
       const radMat = new THREE.MeshStandardMaterial({ color: 0xfcd34d, metalness: 0.3, roughness: 0.8 });
       const rad = new THREE.Mesh(radGeo, radMat);
       rad.position.set(0, -1.0, 0.5);
       satGroupRef.current.add(rad);
    } else if (config.sensor.id === 'infrared') {
       const irGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
       const irMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.5, roughness: 0.2, emissive: 0x8b5cf6, emissiveIntensity: 1 });
       const ir = new THREE.Mesh(irGeo, irMat);
       ir.position.set(0, 0, 0.8);
       satGroupRef.current.add(ir);
    }
  }, [config]);


  if (orderComplete) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-12 text-center max-w-2xl mx-auto neon-border-blue"
      >
        <Rocket className="w-24 h-24 mx-auto text-blue-500 mb-6 animate-bounce" />
        <h2 className="text-3xl font-bold mb-4 font-italic uppercase tracking-widest text-white">Orbital Slot Secured</h2>
        <p className="text-gray-400 mb-8">Your custom satellite has entered the manufacturing queue. You will receive telemetry access coordinates upon deployment to LEO.</p>
        <button 
          onClick={onExit}
          className="px-8 py-3 bg-[var(--neon-blue)] text-black font-bold uppercase tracking-widest rounded hover:bg-white transition-all"
        >
          Return to Hub
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto space-y-6 pb-20"
    >
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 tracking-widest uppercase text-white">
            <Orbit className="w-8 h-8 neon-text-blue" />
            VyomVeda Nano-Sat Forge
          </h2>
          <p className="text-xs text-blue-400 uppercase tracking-widest mt-1">Configure your personal Low Earth Orbit satellite.</p>
        </div>
        <button onClick={onExit} className="glass-panel px-4 py-2 hover:bg-white/10 transition-all text-xs font-bold uppercase text-gray-400 hover:text-white">
          Abandon Build
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-3 space-y-2">
           {[ 
             { id: 'power', label: 'Power Core', icon: <Zap className="w-4 h-4" /> },
             { id: 'sensor', label: 'Sensor Payload', icon: <Radio className="w-4 h-4" /> },
             { id: 'comms', label: 'Communications', icon: <Cpu className="w-4 h-4" /> },
             { id: 'propulsion', label: 'Propulsion', icon: <Rocket className="w-4 h-4" /> }
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-3 p-4 border rounded transition-all text-left uppercase tracking-widest text-xs font-bold ${activeTab === tab.id ? 'bg-[var(--neon-blue)]/10 border-[var(--neon-blue)] text-[var(--neon-blue)]' : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300'}`}
             >
               {tab.icon} {tab.label}
             </button>
           ))}
        </div>

        {/* Center Panel */}
        <div className="lg:col-span-5 glass-panel p-6 border-blue-500/20">
           <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-2 text-white">
             Select {activeTab}
           </h3>
           <div className="space-y-4">
             {options[activeTab].map(item => (
               <div 
                 key={item.id}
                 onClick={() => handleSelect(activeTab, item)}
                 className={`p-4 border rounded-xl cursor-pointer transition-all ${config[activeTab].id === item.id ? 'border-[var(--neon-blue)] bg-[var(--neon-blue)]/5' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
               >
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-sm text-white">{item.name}</h4>
                   <span className="text-xs font-mono text-green-400">+{formatPrice(item.price)}</span>
                 </div>
                 <p className="text-xs text-gray-500 mb-4 h-8">{item.desc}</p>
                 
                 <div className="flex gap-4 border-t border-white/5 pt-2">
                    {Object.entries(item.stats).map(([k, v]) => (
                      <div key={k} className="flex-1">
                        <div className="text-[9px] uppercase tracking-widest text-gray-600 mb-1">{k}</div>
                        <div className="w-full h-1 bg-gray-800 rounded">
                           <div className="h-full bg-blue-500 rounded" style={{ width: `${v * 10}%` }}></div>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-4 space-y-4 flex flex-col">
          <div className="glass-panel border-white/10 p-6 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden group">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-50 z-0"></div>
             <Settings className="w-32 h-32 text-blue-500/20 group-hover:animate-[spin_10s_linear_infinite] transition-all z-10" />
             
             {/* Raw Three.js Mount Point */}
             <div ref={canvasRef} className="absolute inset-0 z-20" />
             
             <div className="absolute top-4 left-4 z-30 pointer-events-none">
                <p className="text-[10px] uppercase tracking-widest text-[#00f3ff] font-bold bg-black/50 px-2 py-1 rounded border border-[#00f3ff]/30">Live 3D Preview</p>
             </div>
          </div>

          <div className="glass-panel border-[var(--neon-blue)] p-6 space-y-4 flex-1 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                <ShoppingCart className="w-4 h-4 text-blue-400" /> Manufacturing Manifest
              </h3>
              
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                  <span className="text-gray-400 break-words w-2/3">{config.power.name}</span>
                  <span className="text-white">{formatPrice(config.power.price)}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                  <span className="text-gray-400 break-words w-2/3">{config.sensor.name}</span>
                  <span className="text-white">{formatPrice(config.sensor.price)}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                  <span className="text-gray-400 break-words w-2/3">{config.comms.name}</span>
                  <span className="text-white">{formatPrice(config.comms.price)}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                  <span className="text-gray-400 break-words w-2/3">{config.propulsion.name}</span>
                  <span className="text-white">{formatPrice(config.propulsion.price)}</span>
                </div>
                
                <div className="flex justify-between items-center p-2 rounded mt-4 border border-[var(--neon-blue)]/30 bg-[var(--neon-blue)]/10">
                  <span className="font-bold text-[var(--neon-blue)] uppercase tracking-widest font-sans">Launch Cost</span>
                  <span className="text-green-400 font-bold text-lg">{formatPrice(calculateTotal() + 150000)}</span>
                </div>
                <p className="text-[9px] text-gray-500 text-right mt-1">*Includes $150,000 baseline rocket orbital insertion fee.</p>
              </div>
            </div>

            <button 
               onClick={() => setOrderComplete(true)}
               className="mt-6 w-full py-4 bg-white hover:bg-[var(--neon-blue)] text-black font-bold uppercase tracking-widest text-sm transition-all duration-300 relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
               Initiate Build Sequence
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SatBuilder;

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      console.warn("WebGL not supported, ThreeScene will not render.");
      return;
    }
    
    if (!mountRef.current) return;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Group for the planet
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // Solid Inner Earth
    const solidGeo = new THREE.SphereGeometry(2, 32, 32);
    const solidMat = new THREE.MeshPhongMaterial({
      color: 0x000814,
      emissive: 0x001122,
      specular: 0x00f3ff,
      shininess: 50,
      transparent: true,
      opacity: 0.9
    });
    const solidEarth = new THREE.Mesh(solidGeo, solidMat);
    planetGroup.add(solidEarth);

    // Wireframe Outer Earth (Holographic effect)
    const wireGeo = new THREE.SphereGeometry(2.05, 32, 32);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const wireEarth = new THREE.Mesh(wireGeo, wireMat);
    planetGroup.add(wireEarth);

    // Orbit Rings & Satellites
    const orbits = [];
    const satellites = [];
    const numOrbits = 3;
    const colors = [0x00f3ff, 0xff00c8, 0x00ff41]; // Cyan, Pink, Green

    for (let i = 0; i < numOrbits; i++) {
       // Orbit Ring
       const radius = 3 + i * 0.8;
       const ringGeo = new THREE.TorusGeometry(radius, 0.01, 16, 100);
       const ringMat = new THREE.MeshBasicMaterial({ color: colors[i], transparent: true, opacity: 0.2 });
       const ring = new THREE.Mesh(ringGeo, ringMat);
       
       // Random orientation for the orbit
       ring.rotation.x = Math.random() * Math.PI;
       ring.rotation.y = Math.random() * Math.PI;
       
       scene.add(ring);
       orbits.push(ring);

       // Pivot object for orbiting the satellite
       const pivot = new THREE.Group();
       pivot.rotation.copy(ring.rotation);
       scene.add(pivot);

       // Satellite object
       const satGeo = new THREE.SphereGeometry(0.08, 16, 16);
       const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
       const satellite = new THREE.Mesh(satGeo, satMat);
       // Position satellite on the ring
       satellite.position.x = radius;
       
       // Add a trailing glow or simple point light to satellite
       const pointLight = new THREE.PointLight(colors[i], 1, 3);
       satellite.add(pointLight);

       pivot.add(satellite);
       satellites.push({ pivot, speed: 0.01 + Math.random() * 0.02 });
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0x00f3ff, 1);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    // Particles (Background Stars)
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.5 });
    const starVertices = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 30 - 10;
      starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    camera.position.z = 7;
    camera.position.y = 1;
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate Earth slowly
      planetGroup.rotation.y += 0.002;
      
      // Rotate stars very slowly
      stars.rotation.y -= 0.0005;

      // Move satellites along orbits
      satellites.forEach(sat => {
         sat.pivot.rotation.z += sat.speed;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
         mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeScene;

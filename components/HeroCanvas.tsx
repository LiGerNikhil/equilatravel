'use client';
import { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let THREE: typeof import('three');

    const init = async () => {
      THREE = await import('three');

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        60,
        canvas.offsetWidth / canvas.offsetHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 5);

      // Ambient light
      const ambient = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambient);

      // Gold point lights
      const goldLight1 = new THREE.PointLight(0xc9a84c, 3, 20);
      goldLight1.position.set(5, 5, 5);
      scene.add(goldLight1);

      const goldLight2 = new THREE.PointLight(0xa88830, 2, 15);
      goldLight2.position.set(-5, -3, 3);
      scene.add(goldLight2);

      const blueLight = new THREE.PointLight(0x0f2e1e, 1.5, 15);
      blueLight.position.set(0, 5, -5);
      scene.add(blueLight);

      // === Luxury Car silhouette using BufferGeometry ===
      // Main car body
      const carGroup = new THREE.Group();

      // Car body
      const bodyGeo = new THREE.BoxGeometry(3.5, 0.7, 1.5);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x0a1f14,
        metalness: 0.9,
        roughness: 0.1,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 0.2;
      carGroup.add(body);

      // Car roof
      const roofGeo = new THREE.BoxGeometry(2, 0.6, 1.3);
      const roofMesh = new THREE.Mesh(roofGeo, bodyMat);
      roofMesh.position.set(-0.2, 0.85, 0);
      carGroup.add(roofMesh);

      // Windshield (glass)
      const glassGeo = new THREE.BoxGeometry(0.05, 0.55, 1.2);
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x88ccaa,
        metalness: 0.1,
        roughness: 0.0,
        transparent: true,
        opacity: 0.4,
      });
      const windshield = new THREE.Mesh(glassGeo, glassMat);
      windshield.position.set(0.82, 0.82, 0);
      windshield.rotation.z = -0.3;
      carGroup.add(windshield);

      // Rear glass
      const rearGlass = new THREE.Mesh(glassGeo, glassMat);
      rearGlass.position.set(-1.22, 0.82, 0);
      rearGlass.rotation.z = 0.3;
      carGroup.add(rearGlass);

      // Wheels (4 cylinders)
      const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 24);
      const wheelMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.3,
        roughness: 0.8,
      });
      const rimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.32, 12);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xc9a84c,
        metalness: 1.0,
        roughness: 0.1,
      });

      const wheelPositions = [
        [1.2, -0.18, 0.85],
        [1.2, -0.18, -0.85],
        [-1.2, -0.18, 0.85],
        [-1.2, -0.18, -0.85],
      ];

      wheelPositions.forEach(([x, y, z]) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(x, y, z);
        carGroup.add(wheel);

        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.rotation.x = Math.PI / 2;
        rim.position.set(x, y, z);
        carGroup.add(rim);
      });

      // Gold trim strip
      const trimGeo = new THREE.BoxGeometry(3.5, 0.04, 0.04);
      const trimMat = new THREE.MeshStandardMaterial({
        color: 0xc9a84c,
        metalness: 1.0,
        roughness: 0.0,
        emissive: 0xc9a84c,
        emissiveIntensity: 0.3,
      });
      const trimFront = new THREE.Mesh(trimGeo, trimMat);
      trimFront.position.set(0, 0.2, 0.76);
      carGroup.add(trimFront);

      const trimBack = new THREE.Mesh(trimGeo, trimMat);
      trimBack.position.set(0, 0.2, -0.76);
      carGroup.add(trimBack);

      // Headlights
      const headlightGeo = new THREE.SphereGeometry(0.1, 12, 12);
      const headlightMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xfff0aa,
        emissiveIntensity: 2,
      });
      const headlightL = new THREE.Mesh(headlightGeo, headlightMat);
      headlightL.position.set(1.75, 0.15, 0.5);
      carGroup.add(headlightL);

      const headlightR = new THREE.Mesh(headlightGeo, headlightMat);
      headlightR.position.set(1.75, 0.15, -0.5);
      carGroup.add(headlightR);

      // Headlight glow
      const headlightGlow1 = new THREE.PointLight(0xfff0aa, 1, 3);
      headlightGlow1.position.set(2, 0.2, 0.5);
      carGroup.add(headlightGlow1);

      const headlightGlow2 = new THREE.PointLight(0xfff0aa, 1, 3);
      headlightGlow2.position.set(2, 0.2, -0.5);
      carGroup.add(headlightGlow2);

      scene.add(carGroup);

      // ===  Floating particles (stars / dust) ===
      const particleCount = 200;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 20;
        positions[i3 + 1] = (Math.random() - 0.5) * 12;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;

        const isGold = Math.random() > 0.5;
        colors[i3] = isGold ? 0.83 : 1;
        colors[i3 + 1] = isGold ? 0.63 : 1;
        colors[i3 + 2] = isGold ? 0.09 : 1;
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.04,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
      });

      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // === Orbit ring ===
      const ringGeo = new THREE.TorusGeometry(3, 0.015, 8, 80);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xc9a84c,
        emissive: 0xc9a84c,
        emissiveIntensity: 0.5,
        metalness: 1,
        roughness: 0,
        transparent: true,
        opacity: 0.4,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.5;
      scene.add(ring);

      // Ground reflection plane
      const groundGeo = new THREE.PlaneGeometry(10, 10);
      const groundMat = new THREE.MeshStandardMaterial({
        color: 0x050a08,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.5,
      });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.55;
      scene.add(ground);

      // Mouse parallax
      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;
      let cameraZ = 5;
      let targetCameraZ = 5;

      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        targetRotY = x * 0.4;
        targetRotX = y * 0.2;
      };

      // Touch parallax
      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        targetRotY = x * 0.3;
        targetRotX = y * 0.15;
      };

      // Scroll: camera travel effect
      const handleScroll = () => {
        const scroll = window.scrollY;
        const maxScroll = window.innerHeight;
        const t = Math.min(scroll / maxScroll, 1);
        targetCameraZ = 5 + t * 6; // camera travels away
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('scroll', handleScroll);

      // Animation clock
      const clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Smooth camera rotation (lerp)
        currentRotX += (targetRotX - currentRotX) * 0.05;
        currentRotY += (targetRotY - currentRotY) * 0.05;
        cameraZ += (targetCameraZ - cameraZ) * 0.03;

        // Car group rotation
        carGroup.rotation.y = elapsed * 0.3 + currentRotY;
        carGroup.rotation.x = currentRotX * 0.3;

        // Gentle float
        carGroup.position.y = Math.sin(elapsed * 0.8) * 0.15;

        // Camera travels
        camera.position.z = cameraZ;

        // Ring rotation
        ring.rotation.z = elapsed * 0.15;
        ring.rotation.y = elapsed * 0.08;

        // Particles drift
        particles.rotation.y = elapsed * 0.02;
        particles.rotation.x = elapsed * 0.01;

        // Gold light pulse
        goldLight1.intensity = 2 + Math.sin(elapsed * 2) * 1;

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!canvas.parentElement) return;
        const w = canvas.parentElement.offsetWidth;
        const h = canvas.parentElement.offsetHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
      };
    };

    let cleanup: (() => void) | undefined;
    init().then((fn) => { cleanup = fn; });
    return () => { cleanup?.(); cancelAnimationFrame(animId); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="hero-canvas"
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
}

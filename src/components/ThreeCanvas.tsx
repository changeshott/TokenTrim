"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Geometry - Torus Knot representing code/token connection
    const geometry = new THREE.TorusKnotGeometry(1.4, 0.45, 150, 20, 2, 3);

    // Material - Glossy Metallic Blue/Indigo
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5,
      roughness: 0.15,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
    });

    const mesh = new THREE.Mesh(geometry, material);
    // Start scaled down for appear animation
    mesh.scale.set(0.01, 0.01, 0.01);
    scene.add(mesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0x3b82f6, 3);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x818cf8, 2);
    directionalLight2.position.set(-5, -5, 5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0x6366f1, 5, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // Mouse Tracking (Gyro parallax effect)
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize to -1 to 1
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation (lerp) for mouse gyro tracking
      targetMouseX += (mouseX - targetMouseX) * 0.05;
      targetMouseY += (mouseY - targetMouseY) * 0.05;

      // Smooth entry scale animation (scale up to 1)
      if (mesh.scale.x < 1) {
        mesh.scale.x += (1 - mesh.scale.x) * 0.05;
        mesh.scale.y += (1 - mesh.scale.y) * 0.05;
        mesh.scale.z += (1 - mesh.scale.z) * 0.05;
      }

      // Base auto rotation + gyro influence
      mesh.rotation.y = elapsedTime * 0.2 + targetMouseX * 0.8;
      mesh.rotation.x = elapsedTime * 0.1 + targetMouseY * 0.8;

      // Floating wave motion
      mesh.position.y = Math.sin(elapsedTime * 1.5) * 0.2;
      mesh.position.x = targetMouseX * 0.3; // Parallax position shift

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[350px] md:min-h-[500px]" />;
}

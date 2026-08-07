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

    // Group to hold Torus for animation
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Geometry - Torus Knot representing code/token connection
    const torusGeometry = new THREE.TorusKnotGeometry(1.2, 0.42, 180, 24, 2, 3);

    // Material - Ultra-Glossy Chrome-like Metallic Indigo (Extreme specular reflections)
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5,
      roughness: 0.05,       // Lower roughness makes it mirror-like
      metalness: 0.95,       // Almost pure metal
      clearcoat: 1.0,        // High clearcoat for lacquer shine
      clearcoatRoughness: 0.02, // Polish finish on clearcoat
      reflectivity: 1.0,
      sheen: 1.0,
      sheenRoughness: 0.1,
      sheenColor: 0x818cf8,
    });

    const torusMesh = new THREE.Mesh(torusGeometry, material);
    torusMesh.position.set(0, 0, 0);
    mainGroup.add(torusMesh);

    // Start group scaled down for entry animation
    mainGroup.scale.set(0.01, 0.01, 0.01);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Dim ambient for high contrast
    scene.add(ambientLight);

    // Soft overhead light
    const topLight = new THREE.DirectionalLight(0x818cf8, 1);
    topLight.position.set(0, 10, 2);
    scene.add(topLight);

    // Bright White Glint Light (Tracks cursor closely to create dynamic specular gleam)
    const glintLight = new THREE.PointLight(0xffffff, 30, 10);
    glintLight.position.set(0, 0, 4);
    scene.add(glintLight);

    // Cyan volumetric fill light
    const fillLight = new THREE.PointLight(0x06b6d4, 15, 8);
    fillLight.position.set(0, 0, 3);
    scene.add(fillLight);

    // Additional deep purple backlighting
    const spotLight = new THREE.SpotLight(0x6366f1, 15);
    spotLight.position.set(0, 0, 6);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 1;
    scene.add(spotLight);

    // Mouse Tracking (Gyro parallax & Spotlight follow)
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
      targetMouseX += (mouseX - targetMouseX) * 0.08;
      targetMouseY += (mouseY - targetMouseY) * 0.08;

      // Smooth entry scale animation (scale up to 1)
      if (mainGroup.scale.x < 1) {
        mainGroup.scale.x += (1 - mainGroup.scale.x) * 0.05;
        mainGroup.scale.y += (1 - mainGroup.scale.y) * 0.05;
        mainGroup.scale.z += (1 - mainGroup.scale.z) * 0.05;
      }

      // Torus auto rotation
      torusMesh.rotation.y = elapsedTime * 0.2;
      torusMesh.rotation.x = elapsedTime * 0.1;

      // Main group slight tilt & float (gyro)
      mainGroup.rotation.y = targetMouseX * 0.6;
      mainGroup.rotation.x = -targetMouseY * 0.4;
      mainGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.15;
      mainGroup.position.x = targetMouseX * 0.4;

      // Dynamic glint/gleam light follows cursor to create sharp moving specular highlights
      glintLight.position.x = targetMouseX * 5.5;
      glintLight.position.y = targetMouseY * 4.0;
      
      // Fill light tracks loosely for color depth
      fillLight.position.x = -targetMouseX * 3;
      fillLight.position.y = -targetMouseY * 2;

      // SpotLight coordinates
      spotLight.position.x = targetMouseX * 4;
      spotLight.position.y = targetMouseY * 3;
      spotLight.target = mainGroup;

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
      torusGeometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[350px] md:min-h-[500px]" />;
}

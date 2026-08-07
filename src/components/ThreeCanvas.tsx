"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // ── Scene setup ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ── Shared chrome material ─────────────────────────────────────────
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5,
      roughness: 0.05,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 1.0,
      sheen: 1.0,
      sheenRoughness: 0.1,
      sheenColor: 0x818cf8,
    });

    // ── TorusKnot ─────────────────────────────────────────────────────
    const torusGroup = new THREE.Group();
    scene.add(torusGroup);

    const torusGeometry = new THREE.TorusKnotGeometry(1.2, 0.42, 180, 24, 2, 3);
    const torusMesh = new THREE.Mesh(torusGeometry, material);
    torusGroup.add(torusMesh);
    torusGroup.scale.set(0.01, 0.01, 0.01); // start tiny for entry animation

    // ── Text group (created after font loads) ─────────────────────────
    const textGroup = new THREE.Group();
    scene.add(textGroup);
    textGroup.scale.set(0.01, 0.01, 0.01);
    textGroup.visible = false;

    // ── Lights ────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    const topLight = new THREE.DirectionalLight(0x818cf8, 1);
    topLight.position.set(0, 10, 2);
    scene.add(topLight);

    const glintLight = new THREE.PointLight(0xffffff, 30, 10);
    glintLight.position.set(0, 0, 4);
    scene.add(glintLight);

    const fillLight = new THREE.PointLight(0x06b6d4, 15, 8);
    fillLight.position.set(0, 0, 3);
    scene.add(fillLight);

    const spotLight = new THREE.SpotLight(0x6366f1, 15);
    spotLight.position.set(0, 0, 6);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 1;
    scene.add(spotLight);

    // ── Mouse tracking ─────────────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // ── Scroll morph progress ─────────────────────────────────────────
    // morphT = 0 (torus) → 1 (TRIM text)
    let morphT = 0;
    let currentMorphT = 0; // smoothly interpolated

    const handleScroll = () => {
      const vh = window.innerHeight;
      const raw = (window.scrollY - vh * 0.4) / (vh * 0.8);
      morphT = Math.max(0, Math.min(1, raw));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // ── Load font & build text geometry ──────────────────────────────
    let textMesh: THREE.Mesh | null = null;
    let textGeometry: TextGeometry | null = null;

    const fontLoader = new FontLoader();
    fontLoader.load("/helvetiker_bold.typeface.json", (font) => {
      textGeometry = new TextGeometry("TRIM", {
        font,
        size: 1.0,
        depth: 0.4,
        curveSegments: 16,
        bevelEnabled: true,
        bevelThickness: 0.06,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 10,
      });
      textGeometry.center();

      textMesh = new THREE.Mesh(textGeometry, material);
      textGroup.add(textMesh);
    });

    // ── Easing helper ─────────────────────────────────────────────────
    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    // ── Animation loop ────────────────────────────────────────────────
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse
      targetMouseX += (mouseX - targetMouseX) * 0.08;
      targetMouseY += (mouseY - targetMouseY) * 0.08;

      // Smooth morph interpolation
      currentMorphT += (morphT - currentMorphT) * 0.06;
      const ease = easeInOut(currentMorphT);

      // Entry pop-in for torus (only before morph starts)
      if (torusGroup.scale.x < 1 && ease < 0.05) {
        const s = torusGroup.scale.x + (1 - torusGroup.scale.x) * 0.06;
        torusGroup.scale.set(s, s, s);
      }

      // ── Torus: shrink + spin out as morph progresses ───────────────
      const torusScale = Math.max(0.01, 1 - ease * 1.2);
      torusGroup.scale.set(torusScale, torusScale, torusScale);
      torusMesh.rotation.y = elapsedTime * 0.2;
      torusMesh.rotation.x = elapsedTime * 0.1;
      torusGroup.rotation.y = targetMouseX * 0.6 * (1 - ease);
      torusGroup.rotation.x = -targetMouseY * 0.4 * (1 - ease);
      torusGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.15 * (1 - ease);
      torusGroup.position.x = targetMouseX * 0.4 * (1 - ease);
      torusGroup.visible = torusScale > 0.05;

      // ── Text: grow in as morph progresses ─────────────────────────
      if (textMesh) {
        textGroup.visible = ease > 0.05;
        const textScale = Math.min(1.0, ease * 1.3);
        textGroup.scale.set(textScale, textScale, textScale);
        // Gentle idle rotation for text (slight tilt following mouse)
        textGroup.rotation.y = targetMouseX * 0.2 * ease;
        textGroup.rotation.x = -targetMouseY * 0.12 * ease;
        // Slight float in text mode
        textGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.06 * ease;
      }

      // ── Dynamic lights follow mouse ────────────────────────────────
      glintLight.position.x = targetMouseX * 5.5;
      glintLight.position.y = targetMouseY * 4.0;
      fillLight.position.x = -targetMouseX * 3;
      fillLight.position.y = -targetMouseY * 2;
      spotLight.position.x = targetMouseX * 4;
      spotLight.position.y = targetMouseY * 3;
      spotLight.target = ease > 0.5 ? textGroup : torusGroup;

      renderer.render(scene, camera);
    };

    animate();

    // ── Resize ─────────────────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      renderer.dispose();
      torusGeometry.dispose();
      textGeometry?.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[350px] md:min-h-[500px]" />;
}

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "@/lib/gsap";

/* ------------------------------------------------------------------ */
/* procedural textures (petal, soft dot, radial glow)                  */
/* ------------------------------------------------------------------ */

function petalTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, 64);
  grad.addColorStop(0, "#ffe9ee");
  grad.addColorStop(0.55, "#f7b7c6");
  grad.addColorStop(1, "#e98aa4");
  g.fillStyle = grad;
  g.beginPath();
  g.moveTo(32, 61);
  g.bezierCurveTo(9, 49, 5, 25, 14, 13);
  g.quadraticCurveTo(24, 21, 32, 10);
  g.quadraticCurveTo(40, 21, 50, 13);
  g.bezierCurveTo(59, 25, 55, 49, 32, 61);
  g.closePath();
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function radialTexture(rgb: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, rgb);
  grad.addColorStop(0.35, rgb.replace("1)", "0.45)"));
  grad.addColorStop(1, rgb.replace("1)", "0)"));
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ------------------------------------------------------------------ */
/* scene                                                               */
/* ------------------------------------------------------------------ */

export default function Scene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        // on high-DPI screens the extra pixel ratio already smooths edges;
        // skip MSAA there — big GPU saving, no visible difference in a fogged scene
        antialias: window.devicePixelRatio <= 1.5,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return; // no WebGL — the CSS gradient backdrop stands alone
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.innerWidth < 768;

    renderer.setClearColor(0x000000, 0);
    // cap DPR hard — the scene is stylized/soft, extra pixels are wasted GPU time
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a1210, 0.052);

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      80
    );
    camera.position.set(0, 1.05, 7.2);

    /* ---------- lights ---------- */
    scene.add(new THREE.AmbientLight(0x9a8676, 0.85));
    const key = new THREE.DirectionalLight(0xffd9be, 1.35);
    key.position.set(4, 7, 5);
    scene.add(key);
    const glowLight = new THREE.PointLight(0xd3492f, 26, 16, 1.8);
    glowLight.position.set(0, 2.4, -2.2);
    scene.add(glowLight);

    /* ---------- ground ---------- */
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(48, 48).rotateX(-Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x130d0a, roughness: 1 })
    );
    scene.add(ground);

    /* ---------- moon + halo ---------- */
    const moon = new THREE.Mesh(
      new THREE.CircleGeometry(1.55, 56),
      new THREE.MeshBasicMaterial({ color: 0xf4e9d2, fog: false, transparent: true, opacity: 0.96 })
    );
    moon.position.set(2.7, 4.1, -10);
    scene.add(moon);

    const moonHalo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: radialTexture("rgba(244,233,210,1)"),
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: false,
      })
    );
    moonHalo.scale.setScalar(9);
    moonHalo.position.copy(moon.position);
    moonHalo.position.z += 0.5;
    scene.add(moonHalo);

    /* ---------- sunset glow behind torii ---------- */
    const sunset = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: radialTexture("rgba(210,80,40,1)"),
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    sunset.scale.setScalar(11);
    sunset.position.set(0, 2.6, -5.2);
    scene.add(sunset);

    /* ---------- torii gate ---------- */
    const torii = new THREE.Group();
    const vermMat = new THREE.MeshStandardMaterial({
      color: 0xc9402a,
      roughness: 0.62,
      emissive: 0x3a0d06,
      emissiveIntensity: 0.5,
    });
    const inkMat = new THREE.MeshStandardMaterial({ color: 0x1b130f, roughness: 0.8 });

    const addBox = (
      w: number, h: number, d: number,
      mat: THREE.Material,
      x: number, y: number, z: number,
      rz = 0, parent: THREE.Object3D = torii
    ) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      m.rotation.z = rz;
      parent.add(m);
      return m;
    };

    // pillars with slight inward lean
    addBox(0.34, 3.5, 0.34, vermMat, -1.62, 1.75, 0, -0.028);
    addBox(0.34, 3.5, 0.34, vermMat, 1.62, 1.75, 0, 0.028);
    // stone bases
    addBox(0.56, 0.22, 0.56, inkMat, -1.58, 0.11, 0);
    addBox(0.56, 0.22, 0.56, inkMat, 1.58, 0.11, 0);
    // nuki (lower tie beam)
    addBox(3.95, 0.24, 0.26, vermMat, 0, 2.68, 0);
    // gakuzuka (center strut)
    addBox(0.24, 0.5, 0.24, vermMat, 0, 3.05, 0);
    // shimaki (secondary lintel)
    addBox(4.3, 0.28, 0.32, vermMat, 0, 3.42, 0);
    // kasagi (curved top lintel, emulated with angled end caps)
    addBox(3.9, 0.26, 0.46, inkMat, 0, 3.66, 0);
    addBox(0.62, 0.26, 0.46, inkMat, -2.1, 3.74, 0, 0.1);
    addBox(0.62, 0.26, 0.46, inkMat, 2.1, 3.74, 0, -0.1);

    torii.position.set(0, 0, -2.6);
    scene.add(torii);

    /* ---------- stone lanterns (small, flanking) ---------- */
    const lanternMat = new THREE.MeshStandardMaterial({ color: 0x3a332c, roughness: 0.95 });
    const makeLantern = (x: number) => {
      const g = new THREE.Group();
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 0.32, 8), lanternMat);
      base.position.y = 0.16;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.62, 8), lanternMat);
      post.position.y = 0.6;
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 0.26), lanternMat);
      box.position.y = 1.02;
      const roof = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.2, 4), lanternMat);
      roof.position.y = 1.24;
      roof.rotation.y = Math.PI / 4;
      g.add(base, post, box, roof);
      g.position.set(x, 0, -1.2);
      return g;
    };
    scene.add(makeLantern(-3.4), makeLantern(3.4));

    /* ---------- sakura petals (instanced, CPU flutter) ---------- */
    const PETALS = isSmall ? 200 : 440;
    const petalGeo = new THREE.PlaneGeometry(1, 1);
    const petalMat = new THREE.MeshBasicMaterial({
      map: petalTexture(),
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      opacity: 0.92,
    });
    const petals = new THREE.InstancedMesh(petalGeo, petalMat, PETALS);
    petals.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const P_FLOAT = new Float32Array(PETALS * 9); // x y z | rotX rotY rotZ | scale fallPhase swayPhase
    const P_SPEED = new Float32Array(PETALS * 4); // fallSpeed swayAmp swayFreq rotSpeed
    const pinks = [0xf7c2cf, 0xf0a0b6, 0xe98aa4, 0xfff0f2, 0xefc9d4].map(
      (c) => new THREE.Color(c)
    );
    const dummy = new THREE.Object3D();
    for (let i = 0; i < PETALS; i++) {
      P_FLOAT[i * 9] = (Math.random() - 0.5) * 19;           // x
      P_FLOAT[i * 9 + 1] = Math.random() * 10.5;             // y
      P_FLOAT[i * 9 + 2] = -7 + Math.random() * 11;          // z
      P_FLOAT[i * 9 + 3] = Math.random() * Math.PI * 2;      // rotX
      P_FLOAT[i * 9 + 4] = Math.random() * Math.PI * 2;      // rotY
      P_FLOAT[i * 9 + 5] = Math.random() * Math.PI * 2;      // rotZ
      P_FLOAT[i * 9 + 6] = 0.07 + Math.random() * 0.1;       // scale
      P_FLOAT[i * 9 + 7] = Math.random() * Math.PI * 2;      // sway phase
      P_FLOAT[i * 9 + 8] = Math.random() * Math.PI * 2;      // flutter phase
      P_SPEED[i * 4] = 0.32 + Math.random() * 0.42;          // fall speed
      P_SPEED[i * 4 + 1] = 0.4 + Math.random() * 1.1;        // sway amp
      P_SPEED[i * 4 + 2] = 0.5 + Math.random() * 0.9;        // sway freq
      P_SPEED[i * 4 + 3] = 0.6 + Math.random() * 1.6;        // rot speed
      petals.setColorAt(i, pinks[(Math.random() * pinks.length) | 0]);
    }
    if (petals.instanceColor) petals.instanceColor.needsUpdate = true;
    scene.add(petals);

    /* ---------- dust motes ---------- */
    const DUST = isSmall ? 60 : 130;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 18;
      dustPos[i * 3 + 1] = Math.random() * 7;
      dustPos[i * 3 + 2] = -6 + Math.random() * 9;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        map: radialTexture("rgba(255,214,166,1)"),
        size: 0.09,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: 0xffcf9e,
      })
    );
    scene.add(dust);

    /* ---------- interaction state ---------- */
    let mouseX = 0;
    let mouseY = 0; // -1 top .. 1 bottom
    let scrollP = 0;
    let smoothX = 0;
    let smoothY = 0;

    // The canvas is fixed and fully covered by opaque sections between the
    // hero and the contact block. While covered, the whole frame is skipped —
    // the GPU idles and page scrolling stays butter-smooth.
    let coveredFrom = Infinity; // scrollY where opaque content starts
    let coveredUntil = Infinity; // scrollY where the contact section appears
    const measureCover = () => {
      const about = document.getElementById("about");
      const contact = document.getElementById("contact");
      const y = window.scrollY;
      if (about) coveredFrom = about.getBoundingClientRect().top + y;
      if (contact) coveredUntil = contact.getBoundingClientRect().top + y;
    };
    measureCover();
    ScrollTrigger.addEventListener("refresh", measureCover);

    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollP = max > 0 ? window.scrollY / max : 0;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      measureCover();
    };
    onResize();
    onScroll();

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    /* ---------- render loop ---------- */
    const clock = new THREE.Clock();
    let raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;

      // canvas fully covered by opaque sections → skip simulation + draw
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (y >= coveredFrom && y + vh <= coveredUntil) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      smoothX += (mouseX - smoothX) * 0.04;
      smoothY += (mouseY - smoothY) * 0.04;

      // camera: mouse parallax + scroll dolly toward the torii
      camera.position.x = smoothX * 0.55;
      camera.position.y = 1.05 + scrollP * 0.5 - smoothY * 0.18;
      camera.position.z = 7.2 - scrollP * 2.1;
      camera.lookAt(smoothX * 0.4, 2.05 - scrollP * 0.55 - smoothY * 0.15, -4);

      // gentle torii breathing + stronger sway with scroll
      torii.rotation.y = Math.sin(t * 0.12) * 0.02 + scrollP * 0.1;

      // petals
      const wind = Math.sin(t * 0.25) * 0.35 + smoothX * 0.9;
      for (let i = 0; i < PETALS; i++) {
        const o = i * 9;
        P_FLOAT[o + 1] -= P_SPEED[i * 4] * dt;
        if (P_FLOAT[o + 1] < -0.2) {
          P_FLOAT[o + 1] = 10 + Math.random() * 1.5;
          P_FLOAT[o] = (Math.random() - 0.5) * 19;
        }
        P_FLOAT[o + 3] += P_SPEED[i * 4 + 3] * dt;
        P_FLOAT[o + 5] += P_SPEED[i * 4 + 3] * 0.7 * dt;

        const sway = Math.sin(t * P_SPEED[i * 4 + 2] + P_FLOAT[o + 7]) * P_SPEED[i * 4 + 1];
        const flutter = Math.sin(t * 3.1 + P_FLOAT[o + 8]);

        dummy.position.set(
          P_FLOAT[o] + sway + wind * (0.4 + (P_FLOAT[o + 6] - 0.07) * 4),
          P_FLOAT[o + 1],
          P_FLOAT[o + 2]
        );
        dummy.rotation.set(
          P_FLOAT[o + 3] + flutter * 0.4,
          P_FLOAT[o + 4],
          P_FLOAT[o + 5]
        );
        dummy.scale.setScalar(P_FLOAT[o + 6]);
        dummy.updateMatrix();
        petals.setMatrixAt(i, dummy.matrix);
      }
      petals.instanceMatrix.needsUpdate = true;

      // dust drift
      const dp = dustGeo.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < DUST; i++) {
        let y = dp.getY(i) + dt * 0.12;
        if (y > 7.5) y = 0;
        dp.setY(i, y);
        dp.setX(i, dp.getX(i) + Math.sin(t * 0.4 + i) * dt * 0.05);
      }
      dp.needsUpdate = true;

      // sunset breathing
      sunset.material.opacity = 0.3 + Math.sin(t * 0.6) * 0.05;

      renderer.render(scene, camera);
    };

    if (reduced) {
      renderer.render(scene, camera); // single static frame
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ScrollTrigger.removeEventListener("refresh", measureCover);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) mat.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="scene-wrap" aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}

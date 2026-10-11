"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Volumetric glowing-smoke background, ported from the previous
 * dark_glow portfolio (raw WebGL FBM domain-warp shader).
 *
 * Layered ABOVE the three.js scene with mix-blend-mode: screen — dark smoke
 * contributes nothing, the silver-white billows and rim highlights glow over
 * the torii/moon/petals. Visible only where the scene is visible (hero +
 * contact); opaque sections cover it and the render loop is skipped there.
 */

const VS_SOURCE = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FS_SOURCE = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float val = 0.0;
  float amp = 0.52;
  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    val += amp * noise(p);
    p = rot * p * 1.92 + vec2(13.41, 17.18);
    amp *= 0.50;
  }
  return val;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 st = uv;
  st.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.045;
  float gust = sin(t * 0.43) * 0.22 + sin(t * 0.91 + 1.7) * 0.12;
  float breeze = sin(t * 0.17 + st.y * 2.4) * 0.08;
  vec2 wind = vec2(t * 0.24 + gust + breeze, sin(t * 0.31) * 0.10);

  vec2 q = vec2(
    fbm(st * 0.85 + wind * 0.72),
    fbm(st * 0.85 + vec2(3.7, 0.0) - wind * 0.48)
  );

  vec2 r = vec2(
    fbm(st * 0.95 + 2.4 * q + vec2(1.4, 5.2) + wind * 0.34),
    fbm(st * 0.95 + 2.4 * q + vec2(6.2, 2.1) - wind * 0.26)
  );

  float primarySmoke   = fbm(st * 0.82 + 1.55 * r + wind * 0.22);
  float secondaryFolds = fbm(st * 1.45 - 1.05 * q - wind * 0.31);
  float microWisps     = fbm(st * 2.55  + 0.7  * r + wind * 0.44);
  float crossDraft     = fbm(st * 0.48 + wind * 0.16);
  float denseBillows   = fbm(st * 0.62 + 1.8 * q + wind * 0.12);

  float combinedSmoke = primarySmoke * 0.46 + secondaryFolds * 0.26 + microWisps * 0.08 + crossDraft * 0.16 + denseBillows * 0.28;

  float smokeDensity = smoothstep(0.08, 0.64, combinedSmoke);
  float edgeRim = pow(smoothstep(0.22, 0.72, combinedSmoke), 2.0);
  float whiteClouds = smoothstep(0.34, 0.68, secondaryFolds + microWisps * 0.35) * (1.0 - smokeDensity * 0.72);

  float verticalDiffusion = 1.0 - uv.y * 0.28;
  float glowA = exp(-2.0 * length((st - vec2(0.20, 0.30)) * vec2(0.78, 1.0)));
  float glowB = exp(-2.4 * length((st - vec2(0.82, 0.68)) * vec2(0.72, 1.0)));
  vec3 ambientGlow = vec3(0.52, 0.55, 0.60) * verticalDiffusion;
  ambientGlow += vec3(0.16, 0.18, 0.22) * glowA;
  ambientGlow += vec3(0.10, 0.14, 0.17) * glowB;

  vec3 deepSmokeCore = vec3(0.003, 0.004, 0.006);
  vec3 billowBody    = vec3(0.028, 0.032, 0.040);
  vec3 smokeColor    = mix(deepSmokeCore, billowBody, smokeDensity);

  float smokeOpacity = clamp(smokeDensity * 1.08, 0.0, 0.96);
  vec3 finalColor = mix(ambientGlow, smokeColor, smokeOpacity);

  vec3 edgeSilver = vec3(0.92, 0.94, 0.97);
  finalColor += edgeSilver * edgeRim * (1.0 - smokeDensity * 0.85) * 0.30;
  finalColor += vec3(0.95, 0.97, 1.0) * whiteClouds * 0.18;

  vec2 vigUV = uv * (1.0 - uv.yx);
  float vignette = vigUV.x * vigUV.y * 14.0;
  vignette = clamp(pow(vignette, 0.25), 0.0, 1.0);
  finalColor *= mix(0.72, 1.0, vignette);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default function SmokeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, depth: false, alpha: false });
    if (!gl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, VS_SOURCE);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, FS_SOURCE);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPositionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);
    const uResLoc = gl.getUniformLocation(program, "u_resolution");
    const uTimeLoc = gl.getUniformLocation(program, "u_time");

    // Smoke is soft — render well below native resolution like the original.
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1);
      const renderScale = window.innerWidth < 700 ? 0.5 : 0.66;
      canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr * renderScale));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr * renderScale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    // Skip rendering while opaque sections cover the scene (same windows as Scene.tsx)
    let coveredFrom = Infinity;
    let coveredUntil = Infinity;
    const measureCover = () => {
      const about = document.getElementById("about");
      const contact = document.getElementById("contact");
      const y = window.scrollY;
      if (about) coveredFrom = about.getBoundingClientRect().top + y;
      if (contact) coveredUntil = contact.getBoundingClientRect().top + y;
    };
    const isCovered = () => {
      const y = window.scrollY;
      return y >= coveredFrom && y + window.innerHeight <= coveredUntil;
    };

    // Pause while scrolling — same trick as the original portfolio
    let isScrolling = false;
    let scrollStopTimer = 0;
    const onScroll = () => {
      isScrolling = true;
      window.clearTimeout(scrollStopTimer);
      scrollStopTimer = window.setTimeout(() => (isScrolling = false), 160);
    };

    let resizeFrame = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resizeCanvas();
        measureCover();
      });
    };

    resizeCanvas();
    measureCover();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    ScrollTrigger.addEventListener("refresh", measureCover);

    const draw = (time: number) => {
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform1f(uTimeLoc, time);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    let raf = 0;
    let lastDraw = 0;
    const FRAME_MIN = 1000 / 30; // 30fps cap — the drift is slow, 60 wastes GPU

    if (reduced) {
      draw(12.0); // one static frame
    } else {
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (document.hidden || isCovered() || isScrolling) return;
        if (now - lastDraw < FRAME_MIN) return;
        lastDraw = now;
        draw(now / 1000);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeFrame);
      window.clearTimeout(scrollStopTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ScrollTrigger.removeEventListener("refresh", measureCover);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <div className="smoke-wrap" aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}

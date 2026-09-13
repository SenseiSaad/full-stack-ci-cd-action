import React, { useState, useEffect, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const ADMIN_URL = `${API_BASE.replace(/\/api\/?$/, '')}/admin/login/`;

const EMPTY_PORTFOLIO = {
  profile: { name: '', role: '', tagline: '', status: '', email: '', location: '', summary: '', current_work: '', future_direction: '' },
  social: [], skills: [], experiences: [], projects: [], logs: [], process: []
};

const navigateTo = (path) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

const DetailShell = ({ children }) => (
  <div className="relative min-h-screen bg-[#050507] text-gray-200 font-sans overflow-x-hidden">
    <VolumetricFogCanvas />
    <div className="fixed inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <header className="fixed top-0 left-0 w-full z-50 bg-[#050507]/85 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="/" onClick={(event) => { event.preventDefault(); navigateTo('/'); }} className="font-mono text-sm tracking-wider font-semibold text-white hover:text-cyan-400 transition-colors">
          saad<span className="text-white/40">.dev</span>
        </a>
        <a href="/" onClick={(event) => { event.preventDefault(); navigateTo('/'); }} className="font-mono text-xs text-white/60 hover:text-white transition-colors">
          ← Back to home
        </a>
      </div>
    </header>
    <main className="relative z-10 pt-32 pb-20">{children}</main>
  </div>
);

const ProjectPage = ({ project }) => (
  <DetailShell>
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <span className="text-xs uppercase tracking-wider text-cyan-300/80">{project.categoryLabel} · {project.tag}</span>
      <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight text-white">{project.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-300">{project.description}</p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <div className="rounded-xl border border-white/15 bg-black/70 p-6">
          <div className="text-xs uppercase tracking-wider text-white/40">Project metric</div>
          <div className="mt-3 text-emerald-300 font-semibold">{project.metrics}</div>
        </div>
        <div className="rounded-xl border border-white/15 bg-black/70 p-6">
          <div className="text-xs uppercase tracking-wider text-white/40">Technology</div>
          <div className="mt-3 flex flex-wrap gap-2">{project.tech.map((tech) => <span key={tech} className="rounded border border-white/15 bg-white/10 px-2.5 py-1 text-xs text-white">{tech}</span>)}</div>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-white/15 bg-black/70 p-6 sm:p-8">
        <div className="text-xs uppercase tracking-wider text-white/40">Case study</div>
        <p className="mt-4 text-gray-300 leading-relaxed">{project.caseStudy || project.description}</p>
      </div>
    </article>
  </DetailShell>
);

const ExperiencePage = ({ experience }) => (
  <DetailShell>
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <span className="text-xs uppercase tracking-wider text-cyan-300/80">{experience.period} · {experience.location}</span>
      <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight text-white">{experience.company}</h1>
      <p className="mt-3 font-mono text-cyan-300">{experience.role}</p>
      <h2 className="mt-10 text-2xl sm:text-3xl font-bold text-white">{experience.headline}</h2>
      <p className="mt-5 text-lg leading-relaxed text-gray-300">{experience.description}</p>
      <div className="mt-10 rounded-xl border border-white/15 bg-black/70 p-6 sm:p-8">
        <div className="text-xs uppercase tracking-wider text-white/40">Key contributions</div>
        <ul className="mt-5 space-y-4 list-disc list-inside text-gray-300 leading-relaxed">{experience.deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{experience.tech.map((tech) => <span key={tech} className="rounded border border-white/15 bg-white/10 px-2.5 py-1 text-xs text-white">{tech}</span>)}</div>
    </article>
  </DetailShell>
);

const LogsPage = ({ log }) => (
  <DetailShell>
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <span className="font-mono text-xs text-cyan-300/80">// {log.category} · {log.date}</span>
      <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight text-white">{log.title}</h1>
      <div className="mt-10 space-y-6 text-lg leading-relaxed text-gray-300">{log.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </article>
  </DetailShell>
);

const LogsIndexPage = () => (
  <DetailShell>
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <span className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300/75">Writing</span>
      <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight text-white">Engineering Logs</h1>
      <p className="mt-4 max-w-2xl text-gray-400">Notes from backend development, AWS operations, infrastructure, and production debugging.</p>
      <div className="mt-12 grid gap-5 md:grid-cols-2">{LOGS.map((log) => <a key={log.id} href={`/logs/${log.id}`} onClick={(event) => { event.preventDefault(); navigateTo(`/logs/${log.id}`); }} className="group rounded-xl border border-white/15 bg-black/70 p-6 hover:border-cyan-300/50 transition-colors"><span className="font-mono text-xs text-cyan-300/70">{log.date} · {log.category}</span><h2 className="mt-4 text-2xl font-bold text-white group-hover:text-cyan-200">{log.title}</h2><p className="mt-3 text-sm leading-relaxed text-gray-400">{log.excerpt}</p><span className="mt-6 block font-mono text-xs text-white/60">read_log() ↗</span></a>)}</div>
    </section>
  </DetailShell>
);

const ContentNotFoundPage = () => (
  <DetailShell>
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span className="font-mono text-xs text-cyan-300/80">// 404 database_record_not_found</span>
      <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight text-white">Content unavailable</h1>
      <p className="mt-5 text-lg leading-relaxed text-gray-400">This page only displays published records returned by the portfolio API.</p>
      <a href="/" onClick={(event) => { event.preventDefault(); navigateTo('/'); }} className="mt-8 inline-flex rounded border border-white/20 bg-white/5 px-5 py-3 text-sm text-white hover:border-cyan-300 hover:text-cyan-200 transition-colors">Back to home ↗</a>
    </section>
  </DetailShell>
);

const VolumetricFogCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    let animationFrameId;
    let isPageVisible = !document.hidden;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let resizeFrameId;
    let scrollStopTimeout;
    let isScrolling = false;
    let renderTimeout;

    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;

      // Hash function for pseudo-random gradient noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      // Smooth bicubic value noise
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      // 4-octave FBM keeps the smoke detailed without saturating the GPU.
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

        // Sideways wind drift with layered gusts for natural, non-repeating motion.
        float t = u_time * 0.045;
        float gust = sin(t * 0.43) * 0.22 + sin(t * 0.91 + 1.7) * 0.12;
        float breeze = sin(t * 0.17 + st.y * 2.4) * 0.08;
        vec2 wind = vec2(t * 0.24 + gust + breeze, sin(t * 0.31) * 0.10);

        // Omnipresent domain warping across the entire screen
        vec2 q = vec2(
          fbm(st * 0.85 + wind * 0.72),
          fbm(st * 0.85 + vec2(3.7, 0.0) - wind * 0.48)
        );

        vec2 r = vec2(
          fbm(st * 0.95 + 2.4 * q + vec2(1.4, 5.2) + wind * 0.34),
          fbm(st * 0.95 + 2.4 * q + vec2(6.2, 2.1) - wind * 0.26)
        );

        // Broad, spread-out smoke layers with a small amount of fine detail.
        float primarySmoke   = fbm(st * 0.82 + 1.55 * r + wind * 0.22);
        float secondaryFolds = fbm(st * 1.45 - 1.05 * q - wind * 0.31);
        float microWisps     = fbm(st * 2.55  + 0.7  * r + wind * 0.44);
        float crossDraft     = fbm(st * 0.48 + wind * 0.16);
        float denseBillows   = fbm(st * 0.62 + 1.8 * q + wind * 0.12);

        // Combined uniform smoke density everywhere
        float combinedSmoke = primarySmoke * 0.46 + secondaryFolds * 0.26 + microWisps * 0.08 + crossDraft * 0.16 + denseBillows * 0.28;

        // Deep, dense cinematic thresholds
        float smokeDensity = smoothstep(0.08, 0.64, combinedSmoke);
        float edgeRim = pow(smoothstep(0.22, 0.72, combinedSmoke), 2.0);
        float whiteClouds = smoothstep(0.34, 0.68, secondaryFolds + microWisps * 0.35) * (1.0 - smokeDensity * 0.72);

        // Diffused silver-grey ambient background glow.
        float verticalDiffusion = 1.0 - uv.y * 0.28;
        float glowA = exp(-2.0 * length((st - vec2(0.20, 0.30)) * vec2(0.78, 1.0)));
        float glowB = exp(-2.4 * length((st - vec2(0.82, 0.68)) * vec2(0.72, 1.0)));
        vec3 ambientGlow = vec3(0.52, 0.55, 0.60) * verticalDiffusion;
        ambientGlow += vec3(0.16, 0.18, 0.22) * glowA;
        ambientGlow += vec3(0.10, 0.14, 0.17) * glowB;

        // Thick storm smoke volume colors (inky charcoal & deep graphite).
        vec3 deepSmokeCore = vec3(0.003, 0.004, 0.006);
        vec3 billowBody    = vec3(0.028, 0.032, 0.040);
        vec3 smokeColor    = mix(deepSmokeCore, billowBody, smokeDensity);

        // 3. Volumetric opacity covering the full frame
        float smokeOpacity = clamp(smokeDensity * 1.08, 0.0, 0.96);
        vec3 finalColor = mix(ambientGlow, smokeColor, smokeOpacity);

        // Silver-white edge highlights on churning smoke fringes
        vec3 edgeSilver = vec3(0.92, 0.94, 0.97);
        finalColor += edgeSilver * edgeRim * (1.0 - smokeDensity * 0.85) * 0.30;
        finalColor += vec3(0.95, 0.97, 1.0) * whiteClouds * 0.18;

        // Subtle filmic vignette framing
        vec2 vigUV = uv * (1.0 - uv.yx);
        float vignette = vigUV.x * vigUV.y * 14.0;
        vignette = clamp(pow(vignette, 0.25), 0.0, 1.0);
        finalColor *= mix(0.72, 1.0, vignette);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0
      ]),
      gl.STATIC_DRAW
    );

    const aPositionLoc = gl.getAttribLocation(program, 'a_position');
    const uResLoc = gl.getUniformLocation(program, 'u_resolution');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');

    const resizeCanvas = () => {
      // The background is intentionally rendered below native resolution.
      // Smoke is soft, so this saves a large amount of fragment-shader work.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.0);
      const renderScale = window.innerWidth < 700 ? 0.62 : 0.72;
      canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr * renderScale));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr * renderScale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const handleResize = () => {
      cancelAnimationFrame(resizeFrameId);
      resizeFrameId = requestAnimationFrame(resizeCanvas);
    };
    window.addEventListener('resize', handleResize);
    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible && !prefersReducedMotion && !isScrolling) scheduleRender();
    };
    const handleScroll = () => {
      isScrolling = true;
      window.clearTimeout(scrollStopTimeout);
      window.clearTimeout(renderTimeout);
      scrollStopTimeout = window.setTimeout(() => {
        isScrolling = false;
        if (isPageVisible && !prefersReducedMotion) scheduleRender();
      }, 120);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleResize();

    const startTime = performance.now();
    const render = (now) => {
      animationFrameId = undefined;
      if (!isPageVisible || isScrolling || prefersReducedMotion) return;

      const currentTime = (now - startTime) / 1000.0;
      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(aPositionLoc);
      gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform1f(uTimeLoc, currentTime);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      scheduleRender();
    };
    const scheduleRender = () => {
      if (animationFrameId || renderTimeout || !isPageVisible || isScrolling || prefersReducedMotion) return;
      // Keep the decorative layer at 30fps. The page itself remains native 60fps.
      renderTimeout = window.setTimeout(() => {
        renderTimeout = undefined;
        animationFrameId = requestAnimationFrame(render);
      }, 33);
    };
    if (!prefersReducedMotion) scheduleRender();

    return () => {
      cancelAnimationFrame(animationFrameId);
      cancelAnimationFrame(resizeFrameId);
      window.clearTimeout(renderTimeout);
      window.clearTimeout(scrollStopTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
};

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [portfolio, setPortfolio] = useState(EMPTY_PORTFOLIO);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeExperience, setActiveExperience] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeProjectModal, setActiveProjectModal] = useState(null);
  const [copyStatus, setCopyStatus] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const { profile: PERSONAL_INFO, social: SOCIAL_PRESENCE, skills: EXPERTISE_AREAS, experiences: EXPERIENCES, projects: PROJECTS, logs: LOGS, process: HOW_I_WORK } = portfolio;

  useEffect(() => {
    const handleRouteChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/portfolio/`)
      .then((response) => {
        if (!response.ok) throw new Error('Portfolio API is unavailable.');
        return response.json();
      })
      .then((data) => {
        setPortfolio(data);
        setActiveExperience(data.experiences[0] || null);
      })
      .catch((error) => setLoadError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const routeParts = currentPath.split('/').filter(Boolean);
  if (routeParts[0] === 'projects') {
    const project = PROJECTS.find((item) => item.id === routeParts[1]);
    if (project) return <ProjectPage project={project} />;
    if (routeParts[1]) return <ContentNotFoundPage />;
  }
  if (routeParts[0] === 'experience') {
    const experience = EXPERIENCES.find((item) => item.id === routeParts[1]);
    if (experience) return <ExperiencePage experience={experience} />;
    if (routeParts[1]) return <ContentNotFoundPage />;
  }
  if (routeParts[0] === 'logs') {
    if (!routeParts[1]) return <LogsIndexPage />;
    const log = LOGS.find((item) => item.id === routeParts[1]);
    if (log) return <LogsPage log={log} />;
    return <ContentNotFoundPage />;
  }

  const filteredProjects = selectedFilter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === selectedFilter);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2500);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setFormError('');
    fetch(`${API_BASE}/messages/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: formData.get('name'), email: formData.get('email'), message: formData.get('message') })
    })
      .then(async (response) => {
        if (!response.ok) throw new Error((await response.json()).error || 'Message could not be sent.');
        form.reset();
        setFormSubmitted(true);
        window.setTimeout(() => setFormSubmitted(false), 6000);
      })
      .catch((error) => setFormError(error.message));
  };

  if (isLoading) return <div className="min-h-screen bg-[#050507] text-white flex items-center justify-center font-mono text-sm">loading_portfolio()</div>;
  if (loadError) return <div className="min-h-screen bg-[#050507] text-white flex items-center justify-center px-6 text-center font-mono text-sm">{loadError} Start Django with <code className="mx-1 text-cyan-300">python3 manage.py runserver</code>.</div>;

  return (
    <div className="relative min-h-screen bg-[#050507] text-gray-200 font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* Background Volumetric Billowing Fog Canvas */}
      <VolumetricFogCanvas />

      {/* Subtle Noise Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#050507]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3 group">
            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#ffffff] animate-pulse" />
            <span className="font-mono text-sm tracking-wider font-semibold text-white group-hover:text-cyan-400 transition-colors">
              saad<span className="text-white/40">ops.site</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center space-x-7 text-sm tracking-wide">
            <a href="#home" className="text-white/60 hover:text-white transition-colors">Home</a>
            <a href="#about" className="text-white/60 hover:text-white transition-colors">About</a>
            <a href="#experience" className="text-white/60 hover:text-white transition-colors">Experience</a>
            <a href="#work" className="text-white/60 hover:text-white transition-colors">Projects</a>
            <a href="/logs" onClick={(event) => { event.preventDefault(); navigateTo('/logs'); }} className="text-white/60 hover:text-white transition-colors">Logs</a>
            <a href="#contact" className="text-white/60 hover:text-white transition-colors">Contact</a>
          </nav>

          <a
            href={ADMIN_URL}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-white/5 border border-white/20 rounded-lg hover:bg-white hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.35)]"
          >
            <span>Admin</span>
            <span className="text-sm">→</span>
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 pt-20">
        
        {/* Section 1: Hero */}
        <section id="home" className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-white/80 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping" />
            <span>{PERSONAL_INFO.status}</span>
          </div>

          <div className="max-w-5xl mx-auto text-center space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.08] drop-shadow-[0_0_25px_rgba(255,255,255,0.45)]">
              Django Backend Developer | AWS &amp; DevOps
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-300 font-light leading-relaxed">
              {PERSONAL_INFO.tagline}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 font-mono text-sm">
            <a
              href="#contact"
              className="px-7 py-3.5 rounded font-semibold bg-white text-black hover:bg-gray-200 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center gap-2"
            >
              <span>Say Hello 👋</span>
              <span>→</span>
            </a>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded font-medium bg-black/60 text-white/80 border border-white/20 hover:border-white hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <span>Email</span>
              <span className="text-xs text-white/40">↗</span>
            </a>
            <a
              href="#contact"
              className="px-5 py-3.5 rounded font-medium bg-black/60 text-white/80 border border-white/20 hover:border-white hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <span>{PERSONAL_INFO.location}</span>
              <span className="text-xs text-white/40">↗</span>
            </a>
          </div>
        </section>

        {/* Section 2: About and Skills */}
        <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300/75">About</p>
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Building dependable systems from application to infrastructure</h2>
          </div>
          <div className="rounded-2xl border border-white/15 bg-black/55 p-6 sm:p-10 backdrop-blur-md">
            <div className="max-w-4xl space-y-5 text-base leading-8 text-gray-300">
              <p>{PERSONAL_INFO.summary}</p>
              <p>{PERSONAL_INFO.current_work}</p>
              <p>{PERSONAL_INFO.future_direction}</p>
            </div>
            <div className="mt-10 border-t border-white/10 pt-8">
              <h3 className="text-2xl font-bold text-white">Technical skills</h3>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                {EXPERTISE_AREAS.map((area) => (
                  <article key={area.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-5 hover:bg-white/[0.09] transition-colors">
                    <div className="h-1 w-12 rounded-full" style={{ backgroundColor: area.accentColor }} />
                    <h4 className="mt-5 text-xl font-bold text-white">{area.titlePrimary}</h4>
                    <p className="mt-1 text-sm font-medium text-cyan-200/80">{area.titleSecondary}</p>
                    <p className="mt-4 text-sm leading-7 text-gray-400">{area.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Professional Experience (Equal Fixed Height Interactive Preview) */}
        <section id="experience" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300/75">Experience</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-1 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Professional Work Experience
            </h2>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              A record of production support, application delivery, and cloud infrastructure work.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Column: Interactive Experience Titles */}
            <div className="lg:col-span-5 flex flex-col h-[580px] border border-white/20 rounded-xl bg-black/70 backdrop-blur-md overflow-hidden p-3 gap-2">
              {EXPERIENCES.map((exp) => {
                const isActive = activeExperience.id === exp.id;
                return (
                  <div
                    key={exp.id}
                    onMouseEnter={() => setActiveExperience(exp)}
                    onClick={() => navigateTo(`/experience/${exp.id}`)}
                    className={`flex-1 flex flex-col justify-center px-5 py-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.3)]'
                        : 'bg-black/40 text-white/70 border-white/10 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider ${isActive ? 'text-black/60' : 'text-white/40'}">
                        {exp.period}
                      </span>
                      <span className="text-xs">{isActive ? 'Selected' : 'View'}</span>
                    </div>

                    <h3 className="text-lg font-bold tracking-tight mt-1 leading-snug">
                      {exp.company}
                    </h3>
                    <p className={`text-xs mt-0.5 truncate ${isActive ? 'text-black/80' : 'text-white/50'}`}>
                      {exp.role}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Permanent Height Dossier Preview Card */}
            <div className="lg:col-span-7 h-[580px] border border-white/20 rounded-xl bg-black/80 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-semibold">{activeExperience.company}</span>
                  <span className="text-white/40">({activeExperience.location})</span>
                </div>
                <span className="text-xs text-white/50">{activeExperience.period}</span>
              </div>

              <div className="space-y-4 py-2 overflow-y-auto pr-1">
                <div>
                  <span className="text-xs uppercase tracking-wider text-cyan-400">{activeExperience.role}</span>
                  <h4 className="text-2xl font-black text-white mt-1">
                    {activeExperience.headline}
                  </h4>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {activeExperience.description}
                </p>

                <div className="space-y-2 bg-white/5 border border-white/10 rounded-lg p-4 text-sm">
                  <div className="text-white/50">Key responsibilities and results</div>
                  <ul className="space-y-2 text-gray-300 list-disc list-inside">
                    {activeExperience.deliverables.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {activeExperience.tech.map((t, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-white/10 text-white text-[11px] border border-white/10">
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href={`/experience/${activeExperience.id}`}
                  onClick={(event) => { event.preventDefault(); navigateTo(`/experience/${activeExperience.id}`); }}
                  
                  className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>View experience</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Section 4: Projects Showcase */}
        <section id="work" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300/75">Projects</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-1 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                Selected Engineering Projects
              </h2>
              <p className="text-gray-400 mt-2 max-w-xl text-sm sm:text-base">
                Robust transactional APIs, AWS cloud deployments, and geospatial data processing pipelines.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4 mb-8">
            <div className="font-mono text-xs text-white/50">Filter by category //</div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {[
                { id: 'all', label: 'All', count: PROJECTS.length },
                { id: 'backend', label: '/ Backend Development', count: PROJECTS.filter(p => p.category === 'backend').length },
                { id: 'cloud', label: '/ AWS DevOps', count: PROJECTS.filter(p => p.category === 'cloud').length },
                { id: 'data', label: '/ Data Engineering', count: PROJECTS.filter(p => p.category === 'data').length }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded transition-all ${
                    selectedFilter === f.id
                      ? 'bg-cyan-300 text-slate-950 border border-cyan-200 font-semibold shadow-[0_0_20px_rgba(103,232,249,0.2)]'
                      : 'bg-white/[0.04] text-white/65 border border-white/15 hover:border-cyan-300/50 hover:text-white'
                  }`}
                >
                  {f.label} <span className="opacity-60 text-[10px] ml-1">0{f.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] backdrop-blur-md p-5 flex flex-col justify-between min-h-[390px] transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-black"
              >
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl transition-all duration-500 group-hover:bg-cyan-300/5" />
                <div className="relative">
                  <div className="mb-8 flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200/30 bg-cyan-200/10 text-sm font-semibold text-cyan-200">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/55">
                      {project.categoryLabel}
                    </span>
                  </div>

                  <div className="mb-6 h-px w-16 bg-gradient-to-r from-cyan-300 to-transparent transition-all duration-300 group-hover:w-28" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/65">{project.tag}</span>
                  <h4 className="mt-3 text-2xl font-bold leading-tight text-white transition-colors group-hover:text-cyan-100">
                    {project.title}
                  </h4>
                  <p className="mt-4 text-sm leading-relaxed text-white/55">
                    {project.description}
                  </p>
                </div>

                <a
                  href={`/projects/${project.id}`}
                  onClick={(event) => { event.preventDefault(); navigateTo(`/projects/${project.id}`); }}
                  className="relative mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-white/70 transition-colors hover:text-cyan-200"
                >
                  <span className="text-emerald-300">{project.metrics}</span>
                  <span className="flex items-center gap-2">View case study <span className="text-lg transition-transform group-hover:translate-x-1">↗</span></span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Engineering Logs */}
        <section id="logs" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300/75">Writing</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-1 tracking-tight">Engineering Logs</h2>
              <p className="text-gray-400 mt-2 max-w-2xl text-sm sm:text-base">Short notes on Django, AWS, infrastructure, and production troubleshooting.</p>
            </div>
              <a href="/logs" onClick={(event) => { event.preventDefault(); navigateTo('/logs'); }} className="text-sm font-semibold text-cyan-200 hover:text-white transition-colors">View all logs ↗</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{LOGS.map((log) => <a key={log.id} href={`/logs/${log.id}`} onClick={(event) => { event.preventDefault(); navigateTo(`/logs/${log.id}`); }} className="group rounded-xl border border-white/10 bg-white/[0.035] p-6 transition-all duration-300 hover:border-cyan-200/50 hover:bg-black hover:backdrop-blur-xl hover:shadow-[0_18px_45px_rgba(0,0,0,0.35)]"><span className="text-xs uppercase tracking-wider text-cyan-300/80">{log.date} · {log.category}</span><h3 className="mt-3 text-xl font-bold text-white transition-colors group-hover:text-cyan-100">{log.title}</h3><p className="mt-3 text-sm leading-relaxed text-white/65 transition-colors group-hover:text-white/90">{log.excerpt}</p></a>)}</div>
        </section>

        {/* Section 5: How I Work */}
        <section id="how-i-work" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="mb-12 max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300/75">Delivery approach</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              How I Work
            </h2>
            <p className="text-gray-400 mt-3 text-sm sm:text-base">
              A practical, production-minded process shaped by freelance delivery, AWS operations, and backend engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HOW_I_WORK.map((step) => (
              <article key={step.number} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8 transition-all duration-300 hover:border-cyan-200/50 hover:bg-black hover:backdrop-blur-xl hover:shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                <div className="flex items-start justify-between gap-6">
                  <span className="text-4xl font-light tracking-tight text-cyan-200/70 transition-colors group-hover:text-cyan-200">{step.number}</span>
                  <span className="mt-2 h-px flex-1 bg-gradient-to-r from-cyan-200/35 to-transparent" />
                </div>
                <h3 className="mt-8 text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{step.description}</p>
                <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-cyan-200/60">{step.tools}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Section 6: Contact */}
        <section id="contact" className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-white/20 rounded-xl bg-black/85 backdrop-blur-md p-6 sm:p-12 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-white/20" />
                <span>Let’s work together</span>
              </div>
              <span className="text-emerald-400">Available for selected projects</span>
            </div>

            <div className="text-center space-y-3 max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                Available for select backend & AWS consulting
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Have an architecture question, scaling challenge, or cloud project? Reach out directly.
              </p>
            </div>

            <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {SOCIAL_PRESENCE.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('mailto:') || social.href === '#' ? undefined : '_blank'}
                  rel={social.href.startsWith('mailto:') || social.href === '#' ? undefined : 'noopener noreferrer'}
                  onClick={(event) => {
                    if (social.href === '#') event.preventDefault();
                  }}
                  className="group rounded-lg border border-white/10 bg-white/[0.035] p-4 transition-colors hover:border-cyan-200/40 hover:bg-white/[0.07]"
                >
                  <span className="flex items-center justify-between font-mono text-xs text-cyan-200/80">
                    <span className="text-base text-white">{social.icon}</span>
                    <span>↗</span>
                  </span>
                  <span className="mt-3 block text-sm font-semibold text-white group-hover:text-cyan-200">{social.label}</span>
                  <span className="mt-1 block truncate text-[11px] text-white/45">{social.value}</span>
                </a>
              ))}
            </div>

            <div className="bg-black border border-white/15 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <span className="text-emerald-400">Email</span>
                <span className="text-gray-400">{PERSONAL_INFO.email}</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="shrink-0 px-4 py-1.5 rounded bg-white/10 text-white hover:bg-white hover:text-black transition-colors"
              >
                {copyStatus ? 'Copied' : 'Copy email'}
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Your name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="w-full bg-[#0a0a0f] border border-white/15 rounded px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Email address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="jane@domain.com"
                    className="w-full bg-[#0a0a0f] border border-white/15 rounded px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">Tell me about your project</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell me about your Django backend, AWS setup, or performance targets..."
                  className="w-full bg-[#0a0a0f] border border-white/15 rounded px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-mono text-emerald-400 min-h-[1.25rem]">
                  {formSubmitted && "✓ Message sent. I'll reply promptly."}
                  {formError && <span className="text-rose-300">{formError}</span>}
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded font-mono text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                >
                  Send message ➔
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-10 text-center font-mono text-xs text-white/40 space-y-2">
          <div>Engineered with React, Tailwind, and Omnipresent Volumetric WebGL Smoke</div>
          <div>© {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.</div>
        </footer>
      </main>

      {/* Project Architecture Modal */}
      {activeProjectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-4"
          onClick={() => setActiveProjectModal(null)}
        >
          <div
            className="border border-white/20 bg-[#0a0a0f] max-w-2xl w-full rounded-xl p-6 sm:p-8 relative shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-cyan-400">{activeProjectModal.categoryLabel}</span>
                <h3 className="text-2xl font-bold text-white mt-0.5">{activeProjectModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveProjectModal(null)}
                className="text-white/60 hover:text-white p-1 text-xl font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <p className="text-gray-300 font-sans text-sm leading-relaxed">
                {activeProjectModal.description}
              </p>

              <div className="p-4 bg-white/5 border border-white/10 rounded space-y-1">
                <div className="text-white/40">Key architectural metric</div>
                <div className="text-emerald-400 font-bold text-sm">{activeProjectModal.metrics}</div>
              </div>

              <div className="space-y-2">
                <div className="text-white/40">Technology</div>
                <div className="flex flex-wrap gap-2">
                  {activeProjectModal.tech.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-white/10 text-white border border-white/10">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/15 font-mono text-xs">
              <button
                onClick={() => setActiveProjectModal(null)}
                className="px-4 py-2 text-white/70 hover:text-white border border-white/20 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, ArrowUpRight, AudioLines, AudioWaveform, Bot, Braces, Github, GraduationCap, Mail, Menu, ServerCog, X } from 'lucide-vue-next'

const mobileOpen = ref(false)
const copied = ref(false)
const cursorDot = ref<HTMLElement | null>(null)
const cursorRing = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const hero = ref<HTMLElement | null>(null)
let cleanupScene: (() => void) | undefined
let cleanupCursor: (() => void) | undefined
let lenis: Lenis | undefined

const nav = [
  { label: 'Focus', href: '#focus' },
  { label: 'Pipeline', href: '#pipeline' },
  { label: 'Missions', href: '#missions' },
  { label: 'Foundation', href: '#foundation' },
]

const pillars = [
  { id: '01', icon: Bot, title: 'LLM Application', eyebrow: 'MODEL · ORCHESTRATION', desc: '把模型能力编排成可运行的业务系统：RAG、Agent、结构化输出与多阶段工作流。', tags: ['Qwen3-32B-AWQ', 'RAG / Agent', 'Prompt Flow'], accent: 'cyan' },
  { id: '02', icon: AudioWaveform, title: 'Speech Intelligence', eyebrow: 'SIGNAL · REALTIME', desc: '以 FunASR 为核心构建实时语音链路，处理流式识别、会话状态和说话人特征。', tags: ['FunASR', 'Streaming ASR', 'CAM++'], accent: 'amber' },
  { id: '03', icon: ServerCog, title: 'Inference Engineering', eyebrow: 'GPU · SERVICE', desc: '面向生产的 Python 推理服务：模型拉起、GPU 资源编排、异步 API 与容器化部署。', tags: ['vLLM', 'MindIE', 'FastAPI / WebSocket'], accent: 'violet' },
]

const missions = [
  { index: 'M-01', title: 'Hospital Physical Examination', subtitle: '医院实时语音体检信息抽取系统', tone: 'amber', summary: '从实时语音到结构化体检表的完整算法流水线。', stack: ['FunASR', 'CAM++', 'LLM', 'FastAPI', 'MindIE'], details: ['VAD → ASR → 标点 → 同音词纠错 → 三阶段信息抽取', '字段级 matched_text 回传，支持原文追溯与前端高亮', '尝试适配 MindIE 拉起 LLM 与 ASR 服务'] },
  { index: 'M-02', title: 'MeetScribe', subtitle: '会议语音智能系统', tone: 'cyan', summary: '将音频、转写、Embedding、LLM 与 OCR 组织为可扩展的会议工作空间。', stack: ['ASR', 'Embedding', 'LLM', 'OCR', 'API'], details: ['拆分 audio / embedding / llm / ocr workspace', '围绕会议内容建立从信号到语义的处理链路'] },
  { index: 'M-03', title: 'CNOOC Voice Control', subtitle: '中海油语音调度与 ASR 服务', tone: 'blue', summary: '负责 KWS 唤醒、ASR 转写，并将语音指令接入摄像头调度链路。', stack: ['FunASR', 'KWS', 'WebSocket', 'Qwen3'], details: ['负责唤醒词 / 控制词识别与实时 ASR 转写', '通过大模型意图路由、层级检索和多轮上下文，语音调度摄像头与云台'] },
  { index: 'M-04', title: 'Audio Inference Code', subtitle: '多模型推理服务基座', tone: 'violet', summary: '统一管理语音、LLM、Embedding 与 OCR 模型服务。', stack: ['vLLM', 'Qwen3-32B-AWQ', 'GLM-OCR', 'CAM++'], details: ['多 GPU 服务拉起与端口隔离', 'OpenAI-compatible API 与 ASR/CAM++ 独立服务'] },
]

const pipeline = [
  { n: '01', title: 'Audio Signal', desc: '16k PCM / WebSocket', icon: AudioLines },
  { n: '02', title: 'FunASR Streaming', desc: 'VAD · partial / final', icon: AudioWaveform },
  { n: '03', title: 'Context Layer', desc: 'CAM++ · correction · OCR', icon: Braces },
  { n: '04', title: 'LLM Orchestration', desc: 'RAG · extraction · workflow', icon: Bot },
  { n: '05', title: 'Inference API', desc: 'vLLM · MindIE · FastAPI', icon: ServerCog },
]

const email = 'liangrx0501@gmail.com'
const year = new Date().getFullYear()
const activeLabel = computed(() => mobileOpen.value ? 'Close menu' : 'Menu')

function tiltCard(event: PointerEvent) {
  const card = event.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5
  card.style.setProperty('--tilt-x', `${-y * 5}deg`)
  card.style.setProperty('--tilt-y', `${x * 6}deg`)
  card.style.setProperty('--spot-x', `${(x + 0.5) * 100}%`)
  card.style.setProperty('--spot-y', `${(y + 0.5) * 100}%`)
}

function resetCard(event: PointerEvent) {
  const card = event.currentTarget as HTMLElement
  card.style.setProperty('--tilt-x', '0deg')
  card.style.setProperty('--tilt-y', '0deg')
}

async function copyEmail() {
  await navigator.clipboard?.writeText(email)
  copied.value = true
  window.setTimeout(() => (copied.value = false), 1800)
}

function initScene() {
  if (!canvas.value) return
  const renderer = new THREE.WebGLRenderer({ canvas: canvas.value, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
  renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight, false)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, canvas.value.clientWidth / canvas.value.clientHeight, 0.1, 100)
  camera.position.set(0, 0.15, 6.4)
  const group = new THREE.Group()
  scene.add(group)
  const particles = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: 0x75ddff, size: 0.018, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending }))
  const count = 720; const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) { const r = 1.25 + Math.random() * 1.9; const a = Math.random() * Math.PI * 2; const b = Math.acos(2 * Math.random() - 1); positions[i * 3] = r * Math.sin(b) * Math.cos(a); positions[i * 3 + 1] = r * Math.cos(b); positions[i * 3 + 2] = r * Math.sin(b) * Math.sin(a) }
  particles.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); scene.add(particles)
  const clock = new THREE.Clock(); let frame = 0; let pointerX = 0; let pointerY = 0
  const onMove = (e: MouseEvent) => { pointerX = (e.clientX / window.innerWidth - 0.5) * 0.25; pointerY = (e.clientY / window.innerHeight - 0.5) * 0.18 }
  const resize = () => { if (!canvas.value) return; camera.aspect = canvas.value.clientWidth / canvas.value.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight, false) }
  const render = () => { const t = clock.getElapsedTime(); group.rotation.y = t * 0.018; group.rotation.x = pointerY + Math.sin(t * 0.3) * 0.03; group.position.x += (pointerX - group.position.x) * 0.03; particles.rotation.y = t * 0.012; renderer.render(scene, camera); frame = requestAnimationFrame(render) }
  window.addEventListener('mousemove', onMove); window.addEventListener('resize', resize); resize(); render()
  cleanupScene = () => { cancelAnimationFrame(frame); window.removeEventListener('mousemove', onMove); window.removeEventListener('resize', resize); renderer.dispose(); particles.geometry.dispose() }
}

onMounted(() => {
  initScene()
  gsap.registerPlugin(ScrollTrigger)
  lenis = new Lenis({ lerp: 0.08 })
  lenis.on('scroll', ScrollTrigger.update)
  const raf = (time: number) => { lenis?.raf(time); requestAnimationFrame(raf) }; requestAnimationFrame(raf)
  gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => gsap.fromTo(el, { opacity: 0, y: 42 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } }))
  gsap.utils.toArray<HTMLElement>('.section-heading h2').forEach((el) => gsap.fromTo(el, { x: -35, rotateX: 8 }, { x: 0, rotateX: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%' } }))
  gsap.utils.toArray<HTMLElement>('.mission-card').forEach((el, index) => gsap.fromTo(el, { x: index % 2 ? 40 : -40, opacity: 0 }, { x: 0, opacity: 1, duration: .85, delay: index * .06, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }))
  gsap.utils.toArray<HTMLElement>('.section').forEach((section) => {
    gsap.timeline({ scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.1 } })
      .fromTo(section, { scale: .955, y: 42, opacity: .56 }, { scale: 1, y: 0, opacity: 1, ease: 'power1.out', duration: .48 })
      .to(section, { scale: .982, y: -24, opacity: .76, ease: 'power1.in', duration: .52 })
  })
  gsap.fromTo('.pillar-card', { y: 70, opacity: 0, rotateX: 10 }, { y: 0, opacity: 1, rotateX: 0, stagger: .13, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.pillar-grid', start: 'top 84%' } })
  gsap.fromTo('.pipeline-node', { y: 45, opacity: 0 }, { y: 0, opacity: 1, stagger: .1, duration: .85, ease: 'power3.out', scrollTrigger: { trigger: '.pipeline-track', start: 'top 84%' } })
  gsap.to('.hero-backdrop', { scale: 1.12, yPercent: 7, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
  gsap.to('.hero-portrait', { y: 150, scale: 1.1, opacity: .1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
  gsap.fromTo('.hero-copy', { y: 0, opacity: 1 }, { y: -34, opacity: .35, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1, invalidateOnRefresh: true } })
  const moveCursor = (event: MouseEvent) => { if (!cursorDot.value || !cursorRing.value) return; cursorDot.value.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`; cursorRing.value.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)` }
  const hoverCursor = (event: MouseEvent) => { const target = event.target as HTMLElement; const active = Boolean(target.closest('a,button,.pillar-card,.mission-card,.tech-item')); cursorDot.value?.classList.toggle('cursor-active', active); cursorRing.value?.classList.toggle('cursor-active', active) }
  window.addEventListener('mousemove', moveCursor); window.addEventListener('mouseover', hoverCursor)
  cleanupCursor = () => { window.removeEventListener('mousemove', moveCursor); window.removeEventListener('mouseover', hoverCursor) }
})
onBeforeUnmount(() => { cleanupScene?.(); cleanupCursor?.(); lenis?.destroy(); ScrollTrigger.getAll().forEach((trigger) => trigger.kill()) })
</script>

<template>
  <div class="site-shell">
    <div class="noise"></div><div ref="cursorDot" class="cursor-dot"></div><div ref="cursorRing" class="cursor-ring"></div>
    <header class="topbar">
      <a href="#top" class="brand"><span class="brand-script">Rixi's Space<span>@2026</span></span></a>
      <nav class="desktop-nav"><a v-for="item in nav" :key="item.href" :href="item.href">{{ item.label }}</a></nav>
      <div class="top-actions"><a class="github-link" href="https://github.com/hellolrx" target="_blank" rel="noreferrer"><Github :size="17" /> GitHub</a><button class="menu-button" :aria-label="activeLabel" @click="mobileOpen = !mobileOpen"><X v-if="mobileOpen" :size="19" /><Menu v-else :size="19" /></button></div>
    </header>
    <div v-if="mobileOpen" class="mobile-nav"><a v-for="item in nav" :key="item.href" :href="item.href" @click="mobileOpen = false">{{ item.label }}</a></div>

    <main id="top">
      <section ref="hero" class="hero section-pad">
        <img class="hero-backdrop" src="/首屏氛围背景.png" alt="" />
        <img class="hero-portrait" src="/人物.png" alt="" aria-hidden="true" />
        <div class="hero-vignette"></div>
        <canvas ref="canvas" class="signal-canvas" aria-hidden="true"></canvas>
        <div class="hero-copy">
          <div class="eyebrow"><span class="status-dot"></span> ALGORITHM ENGINEER · SYSTEM ONLINE</div>
          <h1>Turning<br /><em>Signals</em> into<br /><strong>Intelligence.</strong></h1>
          <p class="hero-sub">LLM Application &amp; Speech Intelligence</p>
          <p class="hero-desc">专注于实时语音、大模型应用编排与 GPU 推理服务。把音频、文本和模型组织成真正可运行的智能系统。</p>
          <div class="hero-actions"><a href="#missions" class="button button-primary">Explore missions <ArrowDown :size="16" /></a><button class="button button-ghost" @click="copyEmail"><Mail :size="16" /> {{ copied ? 'Email copied' : 'Open channel' }}</button></div>
          <div class="hero-caption">A personal observatory for applied intelligence<br /><span>audio → context → action</span></div>
        </div>
        <div class="hero-meta"><span>24° 58′ N</span><span class="meta-line"></span><span>113° 32′ E</span><span>AI / 2026</span></div>
      </section>

      <section id="focus" class="section section-pad reveal"><div class="section-kicker">01 / CORE FOCUS</div><div class="section-heading"><h2>Three layers.<br /><span>One intelligent system.</span></h2><p>从信号采集到模型推理，再到业务编排，我关注的是完整链路，而不是孤立的模型调用。</p></div><div class="pillar-grid"><article v-for="pillar in pillars" :key="pillar.id" class="pillar-card" :class="`accent-${pillar.accent}`" @pointermove="tiltCard" @pointerleave="resetCard"><div class="card-top"><span>{{ pillar.id }}</span><span class="card-icon-3d"><component :is="pillar.icon" :size="24" /></span></div><div class="card-eyebrow">{{ pillar.eyebrow }}</div><h3>{{ pillar.title }}</h3><p>{{ pillar.desc }}</p><div class="tag-row"><span v-for="tag in pillar.tags" :key="tag">{{ tag }}</span></div></article></div></section>

      <section id="pipeline" class="section pipeline-section section-pad"><div class="section-kicker">02 / INTELLIGENCE PIPELINE</div><div class="section-heading"><h2>From signal<br /><span>to structured intelligence.</span></h2><p>一条真实存在于项目中的算法链路：实时、可追溯，并且可以被部署。</p></div><div class="pipeline-track"><div v-for="(node, index) in pipeline" :key="node.n" class="pipeline-node"><div class="node-index">{{ node.n }}</div><div class="node-icon"><component :is="node.icon" :size="22" /></div><h3>{{ node.title }}</h3><p>{{ node.desc }}</p><div v-if="index < pipeline.length - 1" class="node-connector"><span></span></div></div></div></section>

      <section id="missions" class="section section-pad reveal"><div class="section-kicker">03 / PRODUCTION MISSIONS</div><div class="section-heading"><h2>Built for the<br /><span>real world.</span></h2><p>主导开发或核心参与的项目，覆盖会议、行业语音与医疗信息抽取场景。</p></div><div class="mission-list"><article v-for="mission in missions" :key="mission.index" class="mission-card" :class="`mission-${mission.tone}`"><div class="mission-index">{{ mission.index }}</div><div class="mission-main"><div class="mission-title-row"><div><div class="card-eyebrow">{{ mission.subtitle }}</div><h3>{{ mission.title }}</h3></div><ArrowUpRight :size="20" /></div><p class="mission-summary">{{ mission.summary }}</p><ul><li v-for="detail in mission.details" :key="detail">{{ detail }}</li></ul><div class="tag-row"><span v-for="tag in mission.stack" :key="tag">{{ tag }}</span></div></div></article></div></section>

      <section id="foundation" class="section foundation section-pad reveal"><div class="section-kicker">04 / FOUNDATION</div><div class="foundation-grid"><div><h2>Research gave me<br /><span>the instinct to verify.</span></h2><p>现在，我把这种严谨带进大模型应用与语音系统的生产环境。</p><a class="text-link" href="mailto:liangrx0501@gmail.com">Start a conversation <ArrowUpRight :size="16" /></a></div><div class="foundation-card"><GraduationCap :size="28" /><div><div class="card-eyebrow">MACAU CITY UNIVERSITY</div><h3>Master of Computer Science</h3><div class="foundation-stats"><span><b>3.96</b><small>GPA / 4.0</small></span><span><b>1 / 58</b><small>ACADEMIC RANK</small></span></div><div class="scholarship">霍英東獎基金會獎學金</div></div></div></div></section>
    </main>
    <footer class="footer section-pad"><div class="footer-top"><div><div class="section-kicker">05 / OPEN CHANNEL</div><h2>Let’s build the<br /><span>next layer.</span></h2></div><div class="footer-contact"><a href="mailto:liangrx0501@gmail.com"><Mail :size="17" /> {{ email }}</a><a href="https://github.com/hellolrx" target="_blank" rel="noreferrer"><Github :size="17" /> github.com/hellolrx</a></div></div><div class="footer-bottom"><span>Rixi Liang / Algorithm Engineer</span><span>© {{ year }} · Built with curiosity</span></div></footer>
  </div>
</template>

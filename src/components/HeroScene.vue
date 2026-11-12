<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowDown, Mail } from 'lucide-vue-next'
import { email } from '../data/content'
import { DESKTOP, gsap, scrollToTarget } from '../composables/useMotion'

const root = ref<HTMLElement | null>(null)
const copied = ref(false)
let media: gsap.MatchMedia | undefined

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(email)
    copied.value = true
    window.setTimeout(() => (copied.value = false), 1800)
  } catch {
    window.location.href = `mailto:${email}`
  }
}

onMounted(() => {
  media = gsap.matchMedia(root.value ?? undefined)
  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero-backdrop', { scale: 1.18, opacity: 0, duration: 2.4, ease: 'power2.out' })
      .from('.hero-portrait', { opacity: 0, x: 60, duration: 2.6, ease: 'power2.out' }, 0.5)
      .from('.hero-line > span', { yPercent: 110, duration: 1.2, stagger: 0.12 }, 0.35)
      .from('.hero-fade', { opacity: 0, y: 18, duration: 1, stagger: 0.1 }, 0.9)
  })
  media.add(DESKTOP, () => {
    const timeline = gsap.timeline({ scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom bottom', scrub: 0.6 } })
    timeline
      .to('.hero-zoom', { scale: 1.75, yPercent: 6, ease: 'none', duration: 1 }, 0)
      .to('.hero-portrait-wrap', { scale: 1.45, xPercent: 14, opacity: 0, ease: 'power1.in', duration: 0.85 }, 0)
      .to('.hero-copy', { yPercent: -28, opacity: 0, ease: 'power1.in', duration: 0.7 }, 0)
      .to('.hero-meta, .hero-scroll', { opacity: 0, duration: 0.2 }, 0)
      .to('.hero-backdrop, .hero-vignette', { opacity: 0, ease: 'power1.in', duration: 0.25 }, 0.75)
  })
})

onBeforeUnmount(() => media?.revert())
</script>

<template>
  <section id="top" ref="root" class="hero">
    <div class="hero-stage">
      <div class="hero-zoom"><img class="hero-backdrop" src="/hero-backdrop.webp" alt="" /></div>
      <div class="hero-vignette"></div>
      <div class="hero-portrait-wrap"><img class="hero-portrait" src="/portrait.webp" alt="" aria-hidden="true" /></div>
      <div class="hero-copy gutter">
        <div class="hero-eyebrow hero-fade"><span class="status-dot"></span> APPLIED ALGORITHM ENGINEER · SYSTEM ONLINE</div>
        <h1>
          <span class="hero-line"><span>Engineering</span></span>
          <span class="hero-line"><span><em class="grad">Intelligence</em></span></span>
          <span class="hero-line"><span><strong>into Production.</strong></span></span>
        </h1>
        <p class="hero-sub hero-fade">LLM Applications · Retrieval · Speech · Inference Serving</p>
        <p class="hero-desc hero-fade">应用方向算法工程师。把大模型、检索与语音模型编排成可上线的算法链路：从模型选型、RAG 与结构化抽取，到 GPU 推理服务。</p>
        <div class="hero-actions hero-fade">
          <a href="#missions" class="button button-primary" @click.prevent="scrollToTarget('#missions')">Explore missions <ArrowDown :size="16" /></a>
          <button class="button button-ghost" @click="copyEmail"><Mail :size="16" /> {{ copied ? 'Email copied' : 'Open channel' }}</button>
        </div>
      </div>
      <div class="hero-scroll mono"><span class="scroll-line"></span>Scroll to push in</div>
      <div class="hero-meta mono"><span>24° 58′ N</span><span class="meta-line"></span><span>113° 32′ E</span><span>AI / 2026</span></div>
    </div>
  </section>
</template>

<style scoped>
.hero { position: relative; z-index: 1; height: 100svh; min-height: 620px; }
.hero-stage { position: relative; height: 100svh; min-height: 620px; overflow: hidden; isolation: isolate; display: flex; align-items: center; }
.hero-zoom { position: absolute; inset: 0; z-index: -4; transform-origin: 62% 68%; will-change: transform; }
.hero-backdrop { width: 100%; height: 100%; object-fit: cover; object-position: center; opacity: 0.6; filter: saturate(0.85) contrast(1.1); }
.hero-vignette { position: absolute; inset: 0; z-index: -3; background: linear-gradient(90deg, var(--bg) 0%, rgba(3, 9, 20, 0.82) 24%, rgba(3, 9, 20, 0.12) 62%, rgba(3, 9, 20, 0.6) 100%), linear-gradient(0deg, var(--bg) 0%, transparent 30%, rgba(3, 9, 20, 0.35) 100%); }
.hero-portrait-wrap { position: absolute; z-index: -2; right: 0; bottom: 0; height: 100%; width: min(48vw, 760px); transform-origin: 40% 40%; will-change: transform, opacity; }
.hero-portrait { position: absolute; right: -4%; bottom: -16%; height: 112%; width: auto; max-width: none; opacity: 0.34; mix-blend-mode: screen; filter: saturate(0.75) contrast(1.08); -webkit-mask-image: radial-gradient(ellipse 62% 60% at 55% 44%, #000 38%, transparent 78%); mask-image: radial-gradient(ellipse 62% 60% at 55% 44%, #000 38%, transparent 78%); animation: portrait-breathe 9s ease-in-out infinite; }
@keyframes portrait-breathe { 0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.3; } 50% { transform: translate3d(-10px, -8px, 0); opacity: 0.4; } }

.hero-copy { position: relative; width: 100%; padding-top: 76px; will-change: transform, opacity; }
.hero-eyebrow { display: flex; align-items: center; gap: 0.65rem; margin-bottom: clamp(1rem, 2.4vh, 1.8rem); font: 0.7rem var(--mono); letter-spacing: 0.16em; color: #a6c8d7; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--mint); box-shadow: 0 0 13px var(--mint); animation: pulse 2.4s ease-in-out infinite; }
@keyframes pulse { 50% { opacity: 0.35; } }
h1 { font-size: clamp(2.9rem, min(8.2vw, 14.5vh), 9.5rem); line-height: 1; letter-spacing: -0.045em; font-weight: 700; color: var(--ink); }
.hero-line { display: block; overflow: hidden; padding-bottom: 0.12em; margin-bottom: -0.12em; }
.hero-line > span { display: block; }
h1 em { font-style: normal; }
h1 strong { font-weight: 700; color: transparent; background: linear-gradient(180deg, #eef8ff 20%, #86a9c2); -webkit-background-clip: text; background-clip: text; }
.hero-sub { margin-top: clamp(1.1rem, 3vh, 2.2rem); font-size: clamp(0.95rem, 1.25vw, 1.2rem); font-weight: 600; color: #d8ecf8; }
.hero-desc { margin-top: 0.7rem; max-width: 34rem; color: var(--ink-soft); line-height: 1.85; font-size: clamp(0.86rem, 1vw, 1rem); }
.hero-actions { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: clamp(1.2rem, 3.4vh, 2.4rem); }
.button { display: inline-flex; align-items: center; gap: 0.55rem; height: 46px; padding: 0 1.3rem; border-radius: 999px; font-size: 0.82rem; font-weight: 600; border: 1px solid transparent; transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease; }
.button:hover { transform: translateY(-2px); }
.button-primary { background: #e9f8ff; color: #04121f; }
.button-primary:hover { background: #fff; }
.button-ghost { background: rgba(3, 9, 20, 0.35); border-color: rgba(190, 228, 245, 0.28); color: #d8ecf8; backdrop-filter: blur(8px); }
.button-ghost:hover { border-color: rgba(190, 228, 245, 0.7); }

.hero-meta { position: absolute; right: var(--gutter); bottom: 2.4rem; display: flex; align-items: center; gap: 0.7rem; letter-spacing: 0.12em; }
.meta-line { width: 54px; height: 1px; background: #597488; }
.hero-scroll { position: absolute; left: var(--gutter); bottom: 2.4rem; display: flex; align-items: center; gap: 0.8rem; }
.scroll-line { position: relative; width: 54px; height: 1px; background: rgba(158, 205, 224, 0.25); overflow: hidden; }
.scroll-line::after { content: ''; position: absolute; inset: 0; background: var(--cyan); transform: translateX(-100%); animation: scroll-hint 2.2s ease-in-out infinite; }
@keyframes scroll-hint { 60%, 100% { transform: translateX(100%); } }

@media (min-width: 901px) and (prefers-reduced-motion: no-preference) {
  .hero { height: 160vh; }
  .hero-stage { position: sticky; top: 0; height: 100vh; }
}
@media (max-width: 900px) {
  .hero-stage { align-items: flex-end; padding-bottom: 5.5rem; }
  .hero-portrait-wrap { width: 100%; }
  .hero-portrait { right: -22%; height: 86%; bottom: auto; top: 4%; opacity: 0.2; }
  .hero-backdrop { object-position: 60% center; }
  .hero-vignette { background: linear-gradient(0deg, var(--bg) 4%, rgba(3, 9, 20, 0.7) 45%, rgba(3, 9, 20, 0.2) 100%); }
  h1 { font-size: clamp(2.7rem, 13.5vw, 5.4rem); }
  .hero-meta { display: none; }
  .hero-scroll { bottom: 1.6rem; }
}
</style>

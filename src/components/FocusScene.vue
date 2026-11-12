<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { layers } from '../data/content'
import { COMPACT, DESKTOP, gsap } from '../composables/useMotion'

const root = ref<HTMLElement | null>(null)
let media: gsap.MatchMedia | undefined

const scatter = [
  { x: -12, y: -30 }, { x: 10, y: -36 }, { x: 16, y: -10 }, { x: 12, y: 20 }, { x: -6, y: 34 }, { x: -20, y: 6 }, { x: 2, y: 4 },
]

onMounted(() => {
  media = gsap.matchMedia(root.value ?? undefined)
  media.add(DESKTOP, () => {
    const planes = gsap.utils.toArray<HTMLElement>('.plane')
    const timeline = gsap.timeline({ scrollTrigger: { trigger: root.value, start: 'top 50%', end: 'bottom bottom', scrub: 0.6 } })
    timeline.fromTo('.focus-intro', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, ease: 'power2.out', duration: 0.5 }, 0)
      .to('.focus-intro', { opacity: 0, scale: 2.2, filter: 'blur(12px)', ease: 'power2.in', duration: 0.5 }, 1)
    planes.forEach((plane, index) => {
      const start = 1.3 + index * 1.5
      const tags = plane.querySelectorAll('.float-tag')
      timeline
        .fromTo(plane, { z: -2400, autoAlpha: 0 }, { z: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.8 }, start)
        .fromTo(tags, { opacity: 0, scale: 0.4, xPercent: -50, yPercent: -50 }, { opacity: 1, scale: 1, xPercent: -50, yPercent: -50, stagger: 0.04, ease: 'power2.out', duration: 0.5 }, start + 0.3)
        .to('.focus-progress i', { scaleX: (index + 1) / planes.length, ease: 'none', duration: 0.8 }, start)
      if (index < planes.length - 1) {
        timeline.to(plane, { z: 900, autoAlpha: 0, ease: 'power2.in', duration: 0.7 }, start + 1.1)
      } else {
        timeline.to(plane, { autoAlpha: 0, yPercent: -10, ease: 'power1.in', duration: 0.4 }, start + 1.2)
      }
    })
  })
  media.add(COMPACT, () => {
    gsap.utils.toArray<HTMLElement>('.plane').forEach((plane) => {
      gsap.from(plane, { opacity: 0, y: 50, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: plane, start: 'top 80%' } })
    })
  })
})

onBeforeUnmount(() => media?.revert())
</script>

<template>
  <section id="focus" ref="root" class="focus" data-anchor="0.1">
    <div class="focus-stage">
      <div class="focus-intro gutter">
        <div class="mono">03 / CORE FOCUS</div>
        <h2>Three layers.<br /><span class="grad">One intelligent system.</span></h2>
        <p>选对模型，把它编排成链路，再让它稳定跑在 GPU 上。我关注的是完整链路，而不是孤立的模型调用。</p>
      </div>
      <div class="planes">
        <article v-for="layer in layers" :key="layer.id" class="plane gutter" :style="{ '--accent': layer.accent }">
          <div class="plane-index">{{ layer.id }}</div>
          <div class="plane-copy">
            <div class="mono plane-eyebrow">{{ layer.eyebrow }}</div>
            <h3>{{ layer.title }}</h3>
            <p>{{ layer.desc }}</p>
          </div>
          <ul class="plane-tags">
            <li v-for="(tag, index) in layer.tags" :key="tag" class="float-tag" :style="{ '--x': `${scatter[index % scatter.length].x}vw`, '--y': `${scatter[index % scatter.length].y}vh`, '--size': index % 3 === 0 ? 1.35 : index % 3 === 1 ? 1 : 0.8 }">{{ tag }}</li>
          </ul>
        </article>
      </div>
      <div class="focus-progress"><i></i></div>
    </div>
  </section>
</template>

<style scoped>
.focus { position: relative; z-index: 1; }
.focus-intro h2 { margin-top: 1.4rem; font-size: clamp(2.6rem, 7vw, 7.6rem); line-height: 1.02; letter-spacing: -0.045em; font-weight: 700; }
.focus-intro p { margin-top: 2rem; max-width: 30rem; color: var(--ink-soft); line-height: 1.9; }
.plane-index { font-size: clamp(7rem, 30vw, 34rem); font-weight: 800; line-height: 0.8; letter-spacing: -0.07em; color: transparent; -webkit-text-stroke: 1px color-mix(in srgb, var(--accent) 38%, transparent); }
.plane-eyebrow { color: var(--accent); }
.plane h3 { margin-top: 0.8rem; font-size: clamp(2.6rem, 8vw, 9rem); line-height: 1; letter-spacing: -0.05em; font-weight: 700; }
.plane-copy p { margin-top: 1.5rem; max-width: 31rem; color: var(--ink-soft); line-height: 1.9; }
.float-tag { font-family: var(--mono); color: color-mix(in srgb, var(--accent) 75%, #fff); white-space: nowrap; }
.focus-progress { display: none; }

@media (min-width: 901px) and (prefers-reduced-motion: no-preference) {
  .focus { height: 640vh; }
  .focus-stage { position: sticky; top: 0; height: 100vh; overflow: hidden; perspective: 1400px; }
  .focus-intro { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; }
  .planes { position: absolute; inset: 0; transform-style: preserve-3d; }
  .plane { position: absolute; inset: 0; display: flex; align-items: center; visibility: hidden; will-change: transform, opacity; }
  .plane-index { position: absolute; right: 4vw; bottom: -4vh; opacity: 0.4; }
  .plane-copy { position: relative; z-index: 2; max-width: 46vw; }
  .plane-tags { position: absolute; left: 70%; top: 50%; width: 0; height: 0; }
  .float-tag { position: absolute; left: var(--x); top: var(--y); font-size: calc(var(--size) * clamp(0.8rem, 1.15vw, 1.25rem)); opacity: 0; text-shadow: 0 0 24px color-mix(in srgb, var(--accent) 50%, transparent); }
  .focus-progress { display: block; position: absolute; left: var(--gutter); right: var(--gutter); bottom: 2.6rem; height: 1px; background: var(--line); }
  .focus-progress i { display: block; height: 100%; background: var(--cyan); transform: scaleX(0); transform-origin: left; }
}
@media (max-width: 900px), (prefers-reduced-motion: reduce) {
  .focus-stage { padding: 6rem 0; }
  .plane { position: relative; margin-top: 5rem; padding-top: 2rem; border-top: 1px solid var(--line); }
  .plane-index { font-size: 5.5rem; margin-bottom: 1rem; }
  .plane-tags { display: flex; flex-wrap: wrap; gap: 0.5rem 1.2rem; margin-top: 1.6rem; }
  .float-tag { font-size: 0.78rem; }
}
</style>

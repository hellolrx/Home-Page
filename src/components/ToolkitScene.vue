<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { aiWorkflow, toolRows } from '../data/content'
import { gsap, scrollState } from '../composables/useMotion'

const root = ref<HTMLElement | null>(null)
const rows = ref<HTMLElement[]>([])
let media: gsap.MatchMedia | undefined

onMounted(() => {
  media = gsap.matchMedia(root.value ?? undefined)
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const offsets = rows.value.map(() => 0)
    let boost = 0
    const tick = (_time: number, delta: number) => {
      boost += (scrollState.velocity - boost) * 0.1
      rows.value.forEach((row, index) => {
        const direction = index % 2 === 0 ? -1 : 1
        const half = row.scrollWidth / 2
        if (!half) return
        offsets[index] += direction * (0.13 * delta + boost * 0.35)
        offsets[index] = ((offsets[index] % half) - half) % half
        row.style.transform = `translate3d(${offsets[index]}px, 0, 0) skewX(${Math.max(-8, Math.min(8, boost * -0.12))}deg)`
      })
    }
    gsap.ticker.add(tick)
    gsap.from('.toolkit-head > *', { opacity: 0, y: 40, stagger: 0.1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: root.value, start: 'top 75%' } })
    return () => gsap.ticker.remove(tick)
  })
})

onBeforeUnmount(() => media?.revert())
</script>

<template>
  <section id="toolkit" ref="root" class="toolkit">
    <div class="toolkit-head gutter">
      <div class="mono">05 / TOOLKIT</div>
      <h2>Tools I work with,<br /><span class="grad">and things I run myself.</span></h2>
    </div>
    <div v-for="(group, index) in toolRows" :key="group.label" class="marquee">
      <div class="mono marquee-label gutter">{{ group.label }}</div>
      <div class="marquee-window">
        <div :ref="(element) => { if (element) rows[index] = element as HTMLElement }" class="marquee-row" :class="{ outline: index % 2 === 1 }">
          <template v-for="copy in 2" :key="copy">
            <span v-for="item in group.items" :key="`${copy}-${item}`" :aria-hidden="copy === 2">{{ item }}<i>✦</i></span>
          </template>
        </div>
      </div>
    </div>
    <div class="workflow gutter">
      <div class="mono">AI WORKFLOW</div>
      <ul>
        <li v-for="(item, index) in aiWorkflow" :key="item.stage">
          <span class="mono">0{{ index + 1 }} · {{ item.stage }}</span>
          <strong>{{ item.tools }}</strong>
          <p>{{ item.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.toolkit { position: relative; z-index: 1; padding: clamp(6rem, 18vh, 12rem) 0; overflow: hidden; }
h2 { margin-top: 1.4rem; margin-bottom: clamp(2.5rem, 8vh, 5rem); font-size: clamp(2rem, 4.6vw, 5rem); line-height: 1.06; letter-spacing: -0.04em; font-weight: 700; }
.marquee { padding: 1.2rem 0; border-top: 1px solid var(--line); }
.workflow { padding-top: 1.6rem; border-top: 1px solid var(--line); }
.workflow ul { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1.5rem, 4vw, 4rem); margin-top: 1.6rem; }
.workflow li { display: grid; gap: 0.7rem; }
.workflow li .mono { color: var(--cyan); }
.workflow strong { font-size: clamp(1.7rem, 3.6vw, 3.6rem); font-weight: 700; letter-spacing: -0.04em; line-height: 1.1; }
.workflow p { color: var(--ink-soft); }
@media (max-width: 700px) { .workflow ul { grid-template-columns: 1fr; } }
.marquee-label { margin-bottom: 0.4rem; }
.marquee-window { overflow: hidden; }
.marquee-row { display: flex; width: max-content; will-change: transform; }
.marquee-row span { display: inline-flex; align-items: center; font-size: clamp(3rem, 9vw, 9.5rem); font-weight: 700; letter-spacing: -0.05em; line-height: 1.15; white-space: nowrap; color: var(--ink); }
.marquee-row i { font-style: normal; font-size: 0.22em; margin: 0 0.9em; color: var(--amber); }
.marquee-row.outline span { color: transparent; -webkit-text-stroke: 1px rgba(190, 228, 245, 0.55); }
.marquee-row.outline i { -webkit-text-stroke: 0; color: var(--cyan); }
</style>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { foundation } from '../data/content'
import { COMPACT, DESKTOP, gsap } from '../composables/useMotion'

const root = ref<HTMLElement | null>(null)
const counters = reactive(foundation.stats.map(() => ({ value: 0 })))
let media: gsap.MatchMedia | undefined

const format = (index: number) => counters[index].value.toFixed(foundation.stats[index].decimals)

function countTo(timeline: gsap.core.Timeline | null, position?: number) {
  foundation.stats.forEach((stat, index) => {
    const from = stat.decimals ? 0 : 58
    counters[index].value = from
    const tween = { value: stat.value, ease: 'power2.out', duration: timeline ? 0.4 : 1.6 }
    if (timeline) timeline.to(counters[index], tween, position)
    else gsap.to(counters[index], { ...tween, scrollTrigger: { trigger: root.value, start: 'top 70%' } })
  })
}

onMounted(() => {
  media = gsap.matchMedia(root.value ?? undefined)
  media.add(DESKTOP, () => {
    const timeline = gsap.timeline({ scrollTrigger: { trigger: root.value, start: 'top 15%', end: 'bottom bottom', scrub: 0.5 } })
    timeline
      .fromTo('.foundation-head > *', { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.05, ease: 'power2.out', duration: 0.2 }, 0)
      .fromTo('.foundation-rule', { scaleX: 0 }, { scaleX: 1, ease: 'power2.out', duration: 0.25 }, 0.12)
      .fromTo('.stat', { scale: 3, opacity: 0, filter: 'blur(26px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', stagger: 0.1, ease: 'power3.out', duration: 0.36 }, 0.2)
      .fromTo('.foundation-award', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.15 }, 0.55)
      .to('.foundation-inner', { scale: 0.86, opacity: 0, yPercent: -8, ease: 'power2.in', duration: 0.18 }, 0.82)
    countTo(timeline, 0.25)
  })
  media.add(COMPACT, () => {
    countTo(null)
    gsap.from('.foundation-head > *, .stat, .foundation-award', { opacity: 0, y: 40, stagger: 0.1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: root.value, start: 'top 70%' } })
  })
})

onBeforeUnmount(() => media?.revert())
</script>

<template>
  <section id="foundation" ref="root" class="foundation" data-anchor="1.05">
    <div class="foundation-stage gutter">
      <div class="foundation-inner">
        <div class="foundation-head">
          <div class="mono">01 / FOUNDATION</div>
          <h2>{{ foundation.school }}<span>{{ foundation.schoolZh }}</span></h2>
          <p class="degree">{{ foundation.degree }}</p>
        </div>
        <div class="foundation-rule"></div>
        <div class="stats">
          <div v-for="(stat, index) in foundation.stats" :key="stat.label" class="stat">
            <div class="stat-value"><span class="grad">{{ format(index) }}</span><small>{{ stat.suffix }}</small></div>
            <div class="mono">{{ stat.label }}</div>
          </div>
          <div class="foundation-award">
            <div class="mono">SCHOLARSHIP</div>
            <p>{{ foundation.award }}</p>
            <div class="mono honors-label">HONORS</div>
            <ul class="honors">
              <li v-for="honor in foundation.honors" :key="honor">{{ honor }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.foundation { position: relative; z-index: 1; }
.foundation-stage { display: flex; align-items: center; padding-top: 6rem; padding-bottom: 6rem; }
.foundation-inner { width: 100%; will-change: transform, opacity; }
h2 { margin-top: 1.4rem; font-size: clamp(2.2rem, 5.6vw, 6rem); line-height: 1.04; letter-spacing: -0.045em; font-weight: 700; }
h2 span { margin-left: 0.6em; font-size: 0.36em; font-weight: 500; letter-spacing: 0.08em; color: var(--ink-soft); white-space: nowrap; }
.degree { margin-top: 1rem; font-size: clamp(1.1rem, 1.9vw, 1.9rem); font-weight: 500; letter-spacing: -0.02em; color: #d8ecf8; }
.foundation-rule { height: 1px; margin: clamp(1.6rem, 4vh, 3rem) 0; background: linear-gradient(90deg, var(--cyan), rgba(103, 214, 255, 0)); transform-origin: left; }
.stats { display: flex; flex-wrap: wrap; align-items: flex-end; gap: clamp(2rem, 7vw, 8rem); }
.stat { transform-origin: left center; will-change: transform, opacity, filter; }
.stat-value { font-size: clamp(4rem, min(12vw, 21vh), 12rem); font-weight: 800; line-height: 0.95; letter-spacing: -0.06em; font-variant-numeric: tabular-nums; white-space: nowrap; }
.stat-value small { font-size: 0.34em; font-weight: 600; letter-spacing: -0.03em; color: var(--ink-mute); }
.stat .mono { margin-top: 0.9rem; }
.foundation-award { margin-left: auto; padding-bottom: 0.2rem; text-align: right; }
.foundation-award p { margin-top: 0.7rem; color: #ffc29f; font-size: clamp(1.05rem, 1.6vw, 1.6rem); font-weight: 500; }
.honors-label { margin-top: clamp(1rem, 2.4vh, 1.6rem); }
.honors { display: grid; gap: 0.35rem; margin-top: 0.7rem; color: var(--ink-soft); font-size: clamp(0.82rem, 1vw, 0.98rem); line-height: 1.5; }

@media (min-width: 901px) and (prefers-reduced-motion: no-preference) {
  .foundation { height: 260vh; margin-top: -100vh; }
  .foundation-stage { position: sticky; top: 0; height: 100vh; overflow: hidden; padding-top: 0; padding-bottom: 0; }
}
@media (max-width: 900px) {
  h2 span { display: block; margin: 0.6rem 0 0; }
  .foundation-award { margin-left: 0; text-align: left; }
}
</style>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { missions, missionsIntro } from '../data/content'
import { COMPACT, DESKTOP, gsap } from '../composables/useMotion'

const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const current = ref(1)
let media: gsap.MatchMedia | undefined

const total = String(missions.length).padStart(2, '0')

onMounted(() => {
  media = gsap.matchMedia(root.value ?? undefined)
  media.add(DESKTOP, () => {
    const distance = () => (track.value ? track.value.scrollWidth - window.innerWidth : 0)
    const travel = gsap.to(track.value, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: root.value,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const panels = missions.length + 1
          current.value = Math.min(missions.length, Math.max(1, Math.round(self.progress * (panels - 1))))
        },
      },
    })
    gsap.fromTo('.signal', { clipPath: () => `inset(0% ${100 - (window.innerWidth * 75) / (track.value?.scrollWidth || 1)}% 0% 0%)` }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true } })
    gsap.fromTo('.missions-bar i', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom bottom', scrub: 0.3 } })
    gsap.utils.toArray<HTMLElement>('.panel-mission').forEach((panel) => {
      const trigger = { trigger: panel, containerAnimation: travel, start: 'left right', end: 'right left', scrub: true }
      gsap.fromTo(panel.querySelector('.mission-index'), { xPercent: 45 }, { xPercent: -45, ease: 'none', scrollTrigger: trigger })
      gsap.fromTo(panel.querySelector('.mission-body'), { scale: 0.86, opacity: 0.15 }, { scale: 1, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: panel, containerAnimation: travel, start: 'left 85%', end: 'left 15%', scrub: true } })
      gsap.from(panel.querySelectorAll('.mission-steps li'), { opacity: 0, x: 50, stagger: 0.12, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: panel, containerAnimation: travel, start: 'left 45%', toggleActions: 'play none none reverse' } })
    })
  })
  media.add(COMPACT, () => {
    gsap.utils.toArray<HTMLElement>('.panel').forEach((panel) => {
      gsap.from(panel, { opacity: 0, y: 50, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: panel, start: 'top 82%' } })
    })
  })
})

onBeforeUnmount(() => media?.revert())
</script>

<template>
  <section id="missions" ref="root" class="missions">
    <div class="missions-stage">
      <div ref="track" class="track">
        <svg class="signal" viewBox="0 0 5000 200" preserveAspectRatio="none" aria-hidden="true">
          <path class="signal-path" d="M0 100 H700 l30 -60 l40 120 l40 -150 l40 170 l40 -110 l30 30 H1700 l30 -80 l40 150 l40 -130 l40 90 l30 -30 H2700 l30 -50 l40 130 l40 -170 l40 160 l40 -90 l30 20 H3700 l30 -70 l40 140 l40 -120 l40 80 l30 -30 H5000" />
        </svg>
        <div class="panel panel-intro gutter">
          <div class="mono">04 / PRODUCTION MISSIONS</div>
          <h2>Built for the<br /><span class="grad">real world.</span></h2>
          <p>{{ missionsIntro }}</p>
        </div>
        <article v-for="mission in missions" :key="mission.index" class="panel panel-mission gutter" :style="{ '--accent': mission.accent }">
          <div class="mission-index" aria-hidden="true">{{ mission.index }}</div>
          <div class="mission-body">
            <div class="mission-head">
              <div class="mono mission-sub">{{ mission.index }} · {{ mission.subtitle }}</div>
              <h3>{{ mission.title }}</h3>
              <p class="mission-summary">{{ mission.summary }}</p>
              <div class="mission-stack mono">{{ mission.stack.join('  /  ') }}</div>
              <div class="mission-role mono">ROLE · {{ mission.role }}</div>
            </div>
            <ol class="mission-steps">
              <li v-for="(step, index) in mission.steps" :key="step.label"><span class="mono step-label"><i>0{{ index + 1 }}</i>{{ step.label }}</span><p>{{ step.text }}</p></li>
            </ol>
          </div>
        </article>
      </div>
      <div class="missions-hud gutter">
        <div class="mono"><b>{{ String(current).padStart(2, '0') }}</b> / {{ total }}</div>
        <div class="missions-bar"><i></i></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.missions { position: relative; z-index: 1; }
.panel-intro h2 { margin-top: 1.4rem; font-size: clamp(2.6rem, 7vw, 7.6rem); line-height: 1.02; letter-spacing: -0.045em; font-weight: 700; }
.panel-intro p { margin-top: 2rem; max-width: 28rem; color: var(--ink-soft); line-height: 1.9; }
.mission-index { font-size: clamp(6rem, 34vw, 38rem); font-weight: 800; line-height: 0.8; letter-spacing: -0.07em; white-space: nowrap; color: transparent; -webkit-text-stroke: 1px color-mix(in srgb, var(--accent) 30%, transparent); pointer-events: none; }
.mission-sub { color: var(--accent); }
.mission-head h3 { margin-top: 1rem; font-size: clamp(2.2rem, 5.4vw, 6rem); line-height: 1.02; letter-spacing: -0.045em; font-weight: 700; }
.mission-summary { margin-top: 1.4rem; max-width: 30rem; font-size: clamp(1rem, 1.3vw, 1.25rem); color: #d8ecf8; line-height: 1.7; }
.mission-stack { margin-top: 1.8rem; max-width: 34rem; line-height: 2; letter-spacing: 0.08em; text-transform: none; color: color-mix(in srgb, var(--accent) 65%, #9fb6c8); }
.mission-role { margin-top: 1.1rem; color: var(--ink-soft); }
.step-label { display: grid; gap: 0.35rem; letter-spacing: 0.1em; }
.step-label i { font-style: normal; opacity: 0.55; }
.mission-steps li { display: grid; grid-template-columns: 5.2rem 1fr; gap: 1rem; padding: 1.3rem 0; border-top: 1px solid var(--line); }
.mission-steps li:last-child { border-bottom: 1px solid var(--line); }
.mission-steps .mono { color: var(--accent); padding-top: 0.3rem; }
.mission-steps p { color: var(--ink-soft); line-height: 1.8; font-size: clamp(0.88rem, 1vw, 1rem); }
.signal, .missions-hud { display: none; }

@media (min-width: 901px) and (prefers-reduced-motion: no-preference) {
  .missions { height: 560vh; }
  .missions-stage { position: sticky; top: 0; height: 100vh; overflow: hidden; }
  .track { position: relative; display: flex; width: max-content; height: 100%; will-change: transform; }
  .panel { position: relative; flex: none; width: 100vw; height: 100%; display: flex; flex-direction: column; justify-content: center; overflow: hidden; padding-bottom: 12vh; }
  .panel-intro { width: 70vw; }
  .mission-index { position: absolute; left: 0; top: 9vh; z-index: 0; font-size: 26vw; opacity: 0.6; }
  .mission-body { position: relative; z-index: 1; display: grid; grid-template-columns: 1.15fr 1fr; gap: clamp(2rem, 6vw, 7rem); align-items: center; transform-origin: left center; will-change: transform, opacity; }
  .signal { display: block; position: absolute; left: 0; bottom: 7vh; width: 100%; height: 16vh; z-index: 0; opacity: 0.55; pointer-events: none; }
  .signal-path { fill: none; stroke: var(--cyan); stroke-width: 1.2; vector-effect: non-scaling-stroke; }
  .missions-hud { display: flex; align-items: center; gap: 1.5rem; position: absolute; left: 0; right: 0; bottom: 2.4rem; }
  .missions-hud b { color: var(--ink); font-weight: 500; }
  .missions-bar { flex: 1; height: 1px; background: var(--line); }
  .missions-bar i { display: block; height: 100%; background: var(--cyan); transform-origin: left; }
}
@media (max-width: 900px), (prefers-reduced-motion: reduce) {
  .missions-stage { padding: 6rem 0; }
  .panel-mission { margin-top: 5rem; padding-top: 2rem; border-top: 1px solid var(--line); }
  .mission-index { font-size: 5rem; margin-bottom: 1.4rem; }
  .mission-steps { margin-top: 2rem; }
}
</style>

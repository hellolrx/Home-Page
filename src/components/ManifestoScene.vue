<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { manifesto } from '../data/content'
import { COMPACT, DESKTOP, gsap } from '../composables/useMotion'

const root = ref<HTMLElement | null>(null)
const words = manifesto.line.split(' ')
let media: gsap.MatchMedia | undefined

onMounted(() => {
  media = gsap.matchMedia(root.value ?? undefined)
  media.add(DESKTOP, () => {
    gsap.timeline({ scrollTrigger: { trigger: root.value, start: 'top 50%', end: 'bottom bottom', scrub: 0.5 } })
      .fromTo('.manifesto-inner', { scale: 0.82, opacity: 0 }, { scale: 1, opacity: 1, ease: 'power2.out', duration: 0.18 }, 0)
      .fromTo('.word', { opacity: 0.12 }, { opacity: 1, stagger: 0.07, ease: 'none', duration: 0.08 }, 0.1)
      .fromTo('.manifesto-note', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.12 }, 0.62)
      .to('.manifesto-inner', { scale: 1.5, opacity: 0, filter: 'blur(10px)', ease: 'power2.in', duration: 0.2 }, 0.8)
  })
  media.add(COMPACT, () => {
    gsap.fromTo('.word', { opacity: 0.15 }, { opacity: 1, stagger: 0.08, scrollTrigger: { trigger: root.value, start: 'top 75%', end: 'center 45%', scrub: true } })
  })
})

onBeforeUnmount(() => media?.revert())
</script>

<template>
  <section id="manifesto" ref="root" class="manifesto" data-anchor="1.2">
    <div class="manifesto-stage gutter">
      <div class="manifesto-inner">
        <div class="mono">02 / MANIFESTO</div>
        <h2><span v-for="(word, index) in words" :key="index" class="word" :class="{ grad: index >= manifesto.accentFrom }">{{ word }}&nbsp;</span></h2>
        <p class="manifesto-note">{{ manifesto.note }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.manifesto { position: relative; z-index: 1; }
.manifesto-stage { display: flex; align-items: center; padding-top: 7rem; padding-bottom: 7rem; }
.manifesto-inner { max-width: 78rem; will-change: transform, opacity; }
h2 { margin-top: 1.6rem; font-size: clamp(2.4rem, 7.4vw, 8rem); line-height: 1.04; letter-spacing: -0.045em; font-weight: 700; }
.word { display: inline-block; }
.manifesto-note { margin-top: 2.4rem; max-width: 34rem; color: var(--ink-soft); line-height: 1.9; font-size: clamp(0.95rem, 1.2vw, 1.15rem); }

@media (min-width: 901px) and (prefers-reduced-motion: no-preference) {
  .manifesto { height: 300vh; }
  .manifesto-stage { position: sticky; top: 0; height: 100vh; overflow: hidden; padding-top: 0; padding-bottom: 0; }
}
</style>

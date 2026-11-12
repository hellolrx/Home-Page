<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowUpRight, GitMerge } from 'lucide-vue-next'
import { openSource } from '../data/content'
import { gsap } from '../composables/useMotion'

const root = ref<HTMLElement | null>(null)
let media: gsap.MatchMedia | undefined

onMounted(() => {
  media = gsap.matchMedia(root.value ?? undefined)
  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.open-source-inner > *', { opacity: 0, y: 30, stagger: 0.1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: root.value, start: 'top 80%' } })
  })
})

onBeforeUnmount(() => media?.revert())
</script>

<template>
  <section ref="root" class="open-source gutter">
    <a class="open-source-inner" :href="openSource.url" target="_blank" rel="noreferrer">
      <div class="open-source-meta">
        <span class="mono">OPEN SOURCE</span>
        <span class="mono repo">{{ openSource.repo }} {{ openSource.pull }}</span>
        <span class="mono status"><GitMerge :size="13" /> {{ openSource.status }}</span>
      </div>
      <div class="open-source-body">
        <h3>{{ openSource.title }}</h3>
        <p>{{ openSource.note }}</p>
      </div>
      <ArrowUpRight class="arrow" />
    </a>
  </section>
</template>

<style scoped>
.open-source { position: relative; z-index: 1; padding-top: clamp(4rem, 12vh, 8rem); }
.open-source-inner { display: grid; grid-template-columns: minmax(0, 15rem) minmax(0, 1fr) auto; align-items: start; gap: clamp(1.2rem, 4vw, 4rem); padding: clamp(1.6rem, 4vh, 2.6rem) 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.open-source-meta { display: grid; gap: 0.7rem; justify-items: start; }
.repo { color: var(--ink-soft); }
.status { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.3rem 0.65rem; border: 1px solid color-mix(in srgb, var(--violet) 55%, transparent); border-radius: 999px; color: var(--violet); }
h3 { font-family: var(--mono); font-size: clamp(1rem, 1.7vw, 1.6rem); font-weight: 500; line-height: 1.35; letter-spacing: -0.02em; overflow-wrap: anywhere; }
p { margin-top: 0.8rem; max-width: 46rem; color: var(--ink-soft); line-height: 1.7; }
.arrow { width: clamp(1.6rem, 2.4vw, 2.4rem); height: auto; color: var(--ink-mute); transition: transform 0.35s ease, color 0.35s ease; }
.open-source-inner:hover .arrow { transform: translate(4px, -4px); color: var(--cyan); }
.open-source-inner:hover h3 { color: var(--cyan); }
h3 { transition: color 0.35s ease; }
@media (max-width: 900px) {
  .open-source-inner { grid-template-columns: minmax(0, 1fr) auto; }
  .open-source-meta { grid-column: 1 / -1; }
}
</style>

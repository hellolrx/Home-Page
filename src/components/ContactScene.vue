<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowUpRight, Github } from 'lucide-vue-next'
import { email, githubUrl } from '../data/content'
import { gsap, scrollToTarget } from '../composables/useMotion'

const root = ref<HTMLElement | null>(null)
const year = new Date().getFullYear()
let media: gsap.MatchMedia | undefined

onMounted(() => {
  media = gsap.matchMedia(root.value ?? undefined)
  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.timeline({ scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } })
      .fromTo('.contact-zoom', { scale: 2.1 }, { scale: 1, ease: 'power1.out', duration: 1 }, 0)
      .fromTo('.contact-backdrop', { opacity: 0 }, { opacity: 0.55, ease: 'none', duration: 0.7 }, 0.15)
      .fromTo('.contact-copy', { scale: 1.3, opacity: 0 }, { scale: 1, opacity: 1, ease: 'power2.out', duration: 0.5 }, 0.5)
  })
})

onBeforeUnmount(() => media?.revert())
</script>

<template>
  <footer id="contact" ref="root" class="contact">
    <div class="contact-zoom"><img class="contact-backdrop" src="/hero-backdrop.webp" alt="" loading="lazy" /></div>
    <div class="contact-vignette"></div>
    <div class="contact-copy gutter">
      <div class="mono">06 / OPEN CHANNEL</div>
      <h2>Let’s build the<br /><span class="grad">next layer.</span></h2>
      <a class="contact-mail" :href="`mailto:${email}`">{{ email }} <ArrowUpRight class="arrow" /></a>
      <a class="contact-github mono" :href="githubUrl" target="_blank" rel="noreferrer"><Github :size="15" /> github.com/hellolrx</a>
    </div>
    <div class="contact-bottom gutter mono">
      <span>Rixi Liang / Algorithm Engineer</span>
      <a href="#top" @click.prevent="scrollToTarget('#top')">Back to origin ↑</a>
      <span>© {{ year }} · Built with curiosity</span>
    </div>
  </footer>
</template>

<style scoped>
.contact { position: relative; z-index: 1; min-height: 100svh; display: flex; flex-direction: column; justify-content: center; overflow: hidden; isolation: isolate; padding: 8rem 0 6rem; }
.contact-zoom { position: absolute; inset: 0; z-index: -2; transform-origin: 50% 70%; will-change: transform; }
.contact-backdrop { width: 100%; height: 100%; object-fit: cover; opacity: 0.55; filter: saturate(0.85) contrast(1.1); }
.contact-vignette { position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, var(--bg) 0%, rgba(3, 9, 20, 0.35) 40%, rgba(3, 9, 20, 0.5) 70%, var(--bg-deep) 100%); }
.contact-copy { transform-origin: left center; will-change: transform, opacity; }
h2 { margin-top: 1.4rem; font-size: clamp(2.8rem, 8.4vw, 9.5rem); line-height: 1; letter-spacing: -0.05em; font-weight: 700; }
.contact-mail { display: inline-flex; align-items: center; gap: 0.3em; margin-top: clamp(2rem, 6vh, 4rem); padding-bottom: 0.25em; font-size: clamp(1.15rem, 3.4vw, 3.4rem); font-weight: 600; letter-spacing: -0.03em; color: var(--ink); background: linear-gradient(var(--cyan), var(--cyan)) left bottom / 100% 1px no-repeat; transition: color 0.3s ease, background-size 0.4s ease; word-break: break-all; }
.contact-mail:hover { color: var(--cyan); background-size: 100% 3px; }
.arrow { width: 0.9em; height: 0.9em; flex: none; transition: transform 0.3s ease; }
.contact-mail:hover .arrow { transform: translate(0.15em, -0.15em); }
.contact-github { display: flex; align-items: center; gap: 0.6rem; width: max-content; margin-top: 1.8rem; text-transform: none; color: var(--ink-soft); transition: color 0.3s ease; }
.contact-github:hover { color: var(--ink); }
.contact-bottom { position: absolute; left: 0; right: 0; bottom: 1.8rem; display: flex; justify-content: space-between; gap: 1rem; font-size: 0.64rem; }
.contact-bottom a:hover { color: var(--ink); }
@media (max-width: 700px) {
  .contact-bottom { flex-direction: column; gap: 0.5rem; }
  .contact { padding-bottom: 8rem; }
}
</style>

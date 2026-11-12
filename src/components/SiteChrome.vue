<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Github, Menu, X } from 'lucide-vue-next'
import { chapters, githubUrl, navLinks } from '../data/content'
import { ScrollTrigger, scrollToTarget } from '../composables/useMotion'

const mobileOpen = ref(false)
const scrolled = ref(false)
const active = ref(0)
const triggers: ScrollTrigger[] = []

function go(target: string) {
  mobileOpen.value = false
  scrollToTarget(target)
}

onMounted(() => {
  triggers.push(ScrollTrigger.create({ start: 80, end: 'max', onToggle: (self) => (scrolled.value = self.isActive) }))
  chapters.forEach((chapter, index) => {
    const pinned = document.getElementById(chapter.id)?.dataset.anchor !== undefined
    triggers.push(ScrollTrigger.create({ trigger: `#${chapter.id}`, start: pinned ? 'top 10%' : 'top center', end: 'bottom center', onToggle: (self) => { if (self.isActive) active.value = index }, onLeaveBack: () => { if (index > 0 && active.value === index) active.value = index - 1 } }))
  })
})

onBeforeUnmount(() => triggers.forEach((trigger) => trigger.kill()))
</script>

<template>
  <header class="topbar" :class="{ scrolled }">
    <a href="#top" class="brand" @click.prevent="go('#top')">Rixi's Space<span>@2026</span></a>
    <nav class="desktop-nav mono">
      <a v-for="item in navLinks" :key="item.href" :href="item.href" @click.prevent="go(item.href)">{{ item.label }}</a>
    </nav>
    <div class="top-actions">
      <a class="github-link" :href="githubUrl" target="_blank" rel="noreferrer"><Github :size="17" /> GitHub</a>
      <button class="menu-button" :aria-label="mobileOpen ? 'Close menu' : 'Menu'" @click="mobileOpen = !mobileOpen"><X v-if="mobileOpen" :size="20" /><Menu v-else :size="20" /></button>
    </div>
  </header>
  <nav v-if="mobileOpen" class="mobile-nav mono">
    <a v-for="item in navLinks" :key="item.href" :href="item.href" @click.prevent="go(item.href)">{{ item.label }}</a>
  </nav>
  <nav class="chapters" aria-label="Chapters">
    <a v-for="(chapter, index) in chapters" :key="chapter.id" :href="`#${chapter.id}`" :class="{ active: index === active }" @click.prevent="go(`#${chapter.id}`)">
      <span class="mono">{{ chapter.label }}</span><i></i>
    </a>
  </nav>
</template>

<style scoped>
.topbar { position: fixed; z-index: 50; top: 0; left: 0; width: 100%; height: 76px; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(1.25rem, 4vw, 4.5rem); border-bottom: 1px solid transparent; transition: height 0.4s ease, background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease; }
.topbar.scrolled { height: 58px; background: rgba(3, 9, 20, 0.6); border-bottom-color: var(--line); backdrop-filter: blur(18px); }
.brand { color: transparent; background: linear-gradient(105deg, #43d69c 0%, #67d6ff 48%, #a58bff 100%); -webkit-background-clip: text; background-clip: text; font: 1.5rem var(--script); letter-spacing: -0.04em; white-space: nowrap; transition: font-size 0.4s ease; padding: 0.2em 0.15em; }
.brand span { font-size: 0.82em; }
.scrolled .brand { font-size: 1.2rem; }
.desktop-nav { position: absolute; left: 50%; transform: translateX(-50%); display: flex; gap: 2.2rem; color: #8ea2b6; }
.desktop-nav a, .github-link { transition: color 0.25s ease; }
.desktop-nav a:hover, .github-link:hover { color: var(--ink); }
.top-actions { display: flex; align-items: center; gap: 1.25rem; }
.github-link { display: flex; align-items: center; gap: 0.45rem; color: #a6bacf; font-size: 0.8rem; }
.menu-button { display: none; border: 0; background: transparent; padding: 0.4rem; }
.mobile-nav { position: fixed; z-index: 49; inset: 58px 0 auto; display: grid; gap: 1.2rem; padding: 1.6rem var(--gutter) 2rem; background: rgba(3, 9, 20, 0.96); border-bottom: 1px solid var(--line); color: var(--ink-soft); }

.chapters { position: fixed; z-index: 40; right: clamp(0.9rem, 1.6vw, 1.8rem); top: 50%; transform: translateY(-50%); display: grid; gap: 0.2rem; }
.chapters a { display: flex; align-items: center; justify-content: flex-end; gap: 0.7rem; height: 1.3rem; }
.chapters i { width: 14px; height: 1px; background: rgba(158, 205, 224, 0.35); transition: width 0.35s ease, background 0.35s ease; }
.chapters span { font-size: 0.6rem; opacity: 0; transform: translateX(6px); transition: opacity 0.3s ease, transform 0.3s ease; }
.chapters a:hover span, .chapters a.active span { opacity: 1; transform: none; }
.chapters a.active i { width: 34px; background: var(--cyan); }
.chapters a.active span { color: var(--ink); }

@media (max-width: 900px) {
  .desktop-nav, .github-link, .chapters { display: none; }
  .menu-button { display: block; }
  .topbar { height: 58px; }
  .brand { font-size: 1.2rem; }
}
</style>

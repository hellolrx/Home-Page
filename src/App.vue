<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { ScrollTrigger, startSmoothScroll } from './composables/useMotion'
import StarField from './components/StarField.vue'
import SiteChrome from './components/SiteChrome.vue'
import HeroScene from './components/HeroScene.vue'
import ManifestoScene from './components/ManifestoScene.vue'
import FoundationScene from './components/FoundationScene.vue'
import FocusScene from './components/FocusScene.vue'
import MissionsScene from './components/MissionsScene.vue'
import OpenSourceScene from './components/OpenSourceScene.vue'
import ToolkitScene from './components/ToolkitScene.vue'
import ContactScene from './components/ContactScene.vue'

let stopScroll: (() => void) | undefined

onMounted(() => {
  stopScroll = startSmoothScroll()
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
})

onBeforeUnmount(() => stopScroll?.())
</script>

<template>
  <div class="noise"></div>
  <StarField />
  <SiteChrome />
  <main>
    <HeroScene />
    <FoundationScene />
    <ManifestoScene />
    <FocusScene />
    <MissionsScene />
    <OpenSourceScene />
    <ToolkitScene />
  </main>
  <ContactScene />
</template>

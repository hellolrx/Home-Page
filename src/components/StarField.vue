<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { scrollState } from '../composables/useMotion'

const canvas = ref<HTMLCanvasElement | null>(null)
let dispose: (() => void) | undefined

const DEPTH = 150
const COUNT = 2600

function createWebglRenderer(target: HTMLCanvasElement) {
  try {
    return new THREE.WebGLRenderer({ canvas: target, alpha: true, antialias: false })
  } catch {
    return null
  }
}

function startFlatField(target: HTMLCanvasElement, reduced: boolean) {
  const context = target.getContext('2d')
  if (!context) return undefined
  const count = 900
  const tints = ['117,221,255', '213,244,255', '74,141,255', '255,156,103']
  const stars = Array.from({ length: count }, () => {
    const radius = 2.2 + Math.pow(Math.random(), 0.7) * 15
    const angle = Math.random() * Math.PI * 2
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius * 0.72, z: Math.random() * DEPTH, tint: tints[Math.random() < 0.08 ? 3 : Math.floor(Math.random() * 3)] }
  })
  const range = 60
  let width = 0
  let height = 0
  let cameraZ = 0
  let frame = 0
  const resize = () => {
    width = target.width = window.innerWidth
    height = target.height = window.innerHeight
  }
  const render = () => {
    cameraZ += (scrollState.progress * (DEPTH - 40) - cameraZ) * 0.08
    context.clearRect(0, 0, width, height)
    const focal = height * 0.87
    const spin = scrollState.progress * 0.5
    const cos = Math.cos(spin)
    const sin = Math.sin(spin)
    for (const star of stars) {
      const depth = ((((star.z - cameraZ) % range) + range) % range) + 0.3
      const px = ((star.x * cos - star.y * sin) / depth) * focal + width / 2
      const py = ((star.x * sin + star.y * cos) / depth) * focal + height / 2
      if (px < 0 || px > width || py < 0 || py > height) continue
      const fade = Math.min(1, (range - depth) / 14) * Math.min(1, depth / 3)
      const size = Math.min(3.2, (0.07 / depth) * focal * 0.5)
      context.fillStyle = `rgba(${star.tint},${(fade * 0.8).toFixed(3)})`
      context.beginPath()
      context.arc(px, py, Math.max(0.5, size), 0, Math.PI * 2)
      context.fill()
    }
    if (!reduced) frame = requestAnimationFrame(render)
  }
  window.addEventListener('resize', resize)
  resize()
  render()
  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('resize', resize)
  }
}

onMounted(() => {
  if (!canvas.value) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = createWebglRenderer(canvas.value)
  if (!renderer) {
    const fallback = document.createElement('canvas')
    fallback.className = canvas.value.className
    fallback.setAttribute('aria-hidden', 'true')
    for (const attribute of Array.from(canvas.value.attributes)) if (attribute.name.startsWith('data-v-')) fallback.setAttribute(attribute.name, '')
    canvas.value.replaceWith(fallback)
    const stop = startFlatField(fallback, reduced)
    dispose = () => {
      stop?.()
      fallback.remove()
    }
    return
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6))
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x030914, 0.03)
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 90)

  const positions = new Float32Array(COUNT * 3)
  const colors = new Float32Array(COUNT * 3)
  const palette = [new THREE.Color(0x75ddff), new THREE.Color(0xd5f4ff), new THREE.Color(0x4a8dff), new THREE.Color(0xff9c67)]
  for (let index = 0; index < COUNT; index++) {
    const radius = 2.2 + Math.pow(Math.random(), 0.7) * 15
    const angle = Math.random() * Math.PI * 2
    positions[index * 3] = Math.cos(angle) * radius
    positions[index * 3 + 1] = Math.sin(angle) * radius * 0.72
    positions[index * 3 + 2] = -Math.random() * DEPTH
    const color = palette[Math.random() < 0.08 ? 3 : Math.floor(Math.random() * 3)]
    colors.set([color.r, color.g, color.b], index * 3)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const sprite = document.createElement('canvas')
  sprite.width = sprite.height = 64
  const context = sprite.getContext('2d')
  if (context) {
    const glow = context.createRadialGradient(32, 32, 0, 32, 32, 32)
    glow.addColorStop(0, 'rgba(255,255,255,1)')
    glow.addColorStop(0.25, 'rgba(255,255,255,0.7)')
    glow.addColorStop(1, 'rgba(255,255,255,0)')
    context.fillStyle = glow
    context.fillRect(0, 0, 64, 64)
  }
  const texture = new THREE.CanvasTexture(sprite)
  const material = new THREE.PointsMaterial({ map: texture, size: 0.16, vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true })
  const points = new THREE.Points(geometry, material)
  scene.add(points)

  let pointerX = 0
  let pointerY = 0
  let cameraZ = 0
  let warp = 0
  let frame = 0
  const clock = new THREE.Clock()

  const onPointer = (event: PointerEvent) => {
    pointerX = event.clientX / window.innerWidth - 0.5
    pointerY = event.clientY / window.innerHeight - 0.5
  }
  const resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight, false)
  }
  const render = () => {
    const elapsed = clock.getElapsedTime()
    const targetZ = -scrollState.progress * (DEPTH - 40)
    cameraZ += (targetZ - cameraZ) * 0.08
    warp += (Math.min(Math.abs(scrollState.velocity), 60) / 60 - warp) * 0.08
    camera.position.set(pointerX * 0.9, -pointerY * 0.6, cameraZ)
    camera.rotation.z = Math.sin(elapsed * 0.05) * 0.04 + scrollState.progress * 0.5
    camera.fov = 60 + warp * 16
    camera.updateProjectionMatrix()
    points.rotation.z = elapsed * 0.006
    renderer.render(scene, camera)
    if (!reduced) frame = requestAnimationFrame(render)
  }
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('resize', resize)
  resize()
  render()
  dispose = () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('resize', resize)
    geometry.dispose()
    material.dispose()
    texture.dispose()
    renderer.dispose()
  }
})

onBeforeUnmount(() => dispose?.())
</script>

<template>
  <canvas ref="canvas" class="star-field" aria-hidden="true"></canvas>
</template>

<style scoped>
.star-field { position: fixed; inset: 0; z-index: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0.75; }
</style>

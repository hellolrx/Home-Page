import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const DESKTOP = '(min-width: 901px) and (prefers-reduced-motion: no-preference)'
export const COMPACT = '(max-width: 900px), (prefers-reduced-motion: reduce)'

export const scrollState = { progress: 0, velocity: 0 }

let lenis: Lenis | undefined

export function startSmoothScroll() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const readProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    scrollState.progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
  }
  if (reduced) {
    window.addEventListener('scroll', readProgress, { passive: true })
    readProgress()
    return () => window.removeEventListener('scroll', readProgress)
  }
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 })
  lenis.on('scroll', (instance: Lenis) => {
    scrollState.velocity = instance.velocity
    readProgress()
    ScrollTrigger.update()
  })
  const tick = (time: number) => {
    lenis?.raf(time * 1000)
    scrollState.velocity = lenis?.velocity ?? 0
  }
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  readProgress()
  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = undefined
  }
}

export function scrollToTarget(target: string) {
  const element = document.querySelector<HTMLElement>(target)
  if (!element) return
  const anchor = window.matchMedia(DESKTOP).matches ? Number(element.dataset.anchor ?? 0) * window.innerHeight : 0
  const top = target === '#top' ? 0 : element.getBoundingClientRect().top + window.scrollY + anchor
  if (lenis) lenis.scrollTo(top, { duration: 1.6 })
  else window.scrollTo({ top })
}

export { gsap, ScrollTrigger }

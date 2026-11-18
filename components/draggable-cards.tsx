"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { gsap } from "gsap"
import { Draggable } from "gsap/Draggable"

gsap.registerPlugin(Draggable)

export function DraggableCards({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = container.current
    if (!root) return
    const cards = Array.from(root.children) as HTMLElement[]
    const context = gsap.context(() => {
      Draggable.create(cards, {
        type: "x,y",
        bounds: root,
        edgeResistance: 1,
        cursor: "grab",
        activeCursor: "grabbing",
        zIndexBoost: true,
      })
    }, root)
    const resize = new ResizeObserver(() => {
      cards.forEach(card => Draggable.get(card)?.applyBounds(root))
    })
    resize.observe(root)
    return () => {
      resize.disconnect()
      cards.forEach(card => Draggable.get(card)?.kill())
      context.revert()
    }
  }, [])

  return (
    <div
      ref={container}
      aria-label="Foto minuman. Geser card atau gunakan tombol panah saat card dipilih."
      className="relative isolate row-start-1 aspect-[1.65] w-full md:col-start-1 [&>div]:cursor-grab [&>div]:touch-none [&>div]:select-none [&>div]:focus-visible:outline-2 [&>div]:focus-visible:outline-offset-4 [&>div]:focus-visible:outline-[#53672A] [&_img]:pointer-events-none"
      onKeyDown={event => {
        const directions: Record<string, [number, number]> = {
          ArrowLeft: [-16, 0], ArrowRight: [16, 0],
          ArrowUp: [0, -16], ArrowDown: [0, 16],
        }
        const direction = directions[event.key]
        const card = event.target as HTMLElement
        const drag = Draggable.get(card)
        if (!direction || !drag) return
        event.preventDefault()
        gsap.set(card, { x: drag.x + direction[0], y: drag.y + direction[1], zIndex: 20 })
        drag.update(true)
      }}
    >
      {children}
    </div>
  )
}

import { Droplet, Hexagon, Sprout, Tag } from "lucide-react"

import { Marquee } from "@/components/ui/marquee"

const highlights = [
  { label: "Teh Pilihan", icon: Sprout },
  { label: "Diseduh Segar", icon: Droplet },
  { label: "Manis Sesukamu", icon: Hexagon },
  { label: "Harga Bersahabat", icon: Tag },
]

export function Highlights() {
  return (
    <section aria-label="Keunggulan Es Teh" className="px-5 pt-8 md:px-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-border">
        <ul className="sr-only">
          {highlights.map(({ label }) => <li key={label}>{label}</li>)}
        </ul>
        <Marquee aria-hidden="true" pauseOnHover className="[--duration:32s] [--gap:0px] [&>div]:motion-reduce:animate-none">
          {highlights.map(({ label, icon: Icon }) => (
            <div key={label} className="flex min-w-45 items-center justify-center gap-3 border-r border-border px-6 py-3 sm:min-w-55">
              <Icon aria-hidden="true" strokeWidth={1.5} className="size-6 shrink-0 text-primary-foreground dark:text-primary" />
              <span className="whitespace-nowrap text-sm font-medium text-foreground">{label}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  )
}

import { ArrowUpRight, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function Contact() {
  return (
    <section id="kontak" aria-labelledby="contact-heading" className="scroll-mt-24 px-5 pb-16 md:px-10 md:pb-24">
      <div className="mx-auto grid max-w-6xl gap-10 border-t border-border pt-14 md:grid-cols-2 md:gap-20 md:pt-20">
        <div>
          <p className="mb-4 text-xs font-bold tracking-[0.12em] text-primary-foreground dark:text-primary sm:text-sm">/ HUBUNGI KAMI</p>
          <h2 id="contact-heading" className="font-heading text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
            Ada cerita? <span className="block">Mari ngobrol.</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Punya pertanyaan, saran, atau ingin berbagi cerita? Kami senang mendengarnya.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 text-sm font-medium text-foreground">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary-foreground dark:text-primary"><MessageCircle aria-hidden="true" className="size-5" /></span>
            Setiap cerita berarti untuk kami.
          </div>
        </div>
        <form aria-describedby="contact-notice" className="rounded-3xl border border-border bg-card p-6 text-card-foreground sm:p-8">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="contact-name">Nama</FieldLabel>
              <Input id="contact-name" name="name" autoComplete="name" placeholder="Nama kamu" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-email">Email</FieldLabel>
              <Input id="contact-email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-message">Pesan</FieldLabel>
              <Textarea id="contact-message" name="message" placeholder="Tulis pesanmu di sini..." rows={5} required />
            </Field>
            <Field>
              <Button type="submit" disabled>Kirim Pesan <ArrowUpRight data-icon="inline-end" /></Button>
              <FieldDescription id="contact-notice">Pengiriman pesan belum tersedia.</FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </section>
  )
}

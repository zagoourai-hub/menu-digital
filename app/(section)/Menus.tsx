'use client'
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { ShineBorder } from "@/components/ui/shine-border"
import { Variants, motion } from "motion/react";
import type { Produk } from "@/generated/prisma/client"

type Menu = Pick<Produk, "id" | "title" | "description" | "price" | "imageUrl">

export function Menus({ menus }: { menus: Menu[] }) {

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      
      },
    
    },
  };


  return (
    <section id="menu" aria-labelledby="menu-heading" className="scroll-mt-8 px-5 pb-14 text-foreground md:px-10 md:pb-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-xs font-bold tracking-[0.12em] text-primary-foreground dark:text-primary sm:text-sm">/ MENU FAVORIT</p>
        <h2 id="menu-heading" className="font-heading text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
          Pilih segarmu hari ini.
        </h2>
        <motion.div variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: false,
            amount: 0.2,
          }} className="mt-7 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">

          {menus.map((menu) => (
            <motion.article key={menu.id} variants={cardVariants} className="h-full">
              <Card className="relative h-full gap-0 rounded-2xl py-0 shadow-sm">
                <Link href={`/menu/${encodeURIComponent(menu.id)}`} aria-label={`Lihat detail ${menu.title}`} className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring" />
                <ShineBorder aria-hidden="true" duration={18} shineColor="var(--primary)" />
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  {menu.imageUrl ? <Image src={menu.imageUrl} alt={menu.title} fill sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 45vw" className="object-cover" /> : <div className="flex size-full items-center justify-center text-sm text-muted-foreground">Gambar belum tersedia</div>}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-base font-bold">{menu.title}</h3>
                  <CardDescription className="mt-1 line-clamp-2 leading-snug">{menu.description || "Menu Es Teh pilihan."}</CardDescription>
                  <p className="mt-3 text-sm font-semibold">Rp {menu.price.toLocaleString("id-ID")}</p>
                </CardContent>
              </Card>
            </motion.article>
          ))}
          {menus.length === 0 && <p className="col-span-full text-muted-foreground">Belum ada menu yang dipublikasikan.</p>}
        </motion.div>
      </div>
    </section>
  )
}

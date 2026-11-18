import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { DraggableCards } from "@/components/draggable-cards";
import { ShineBorder } from "@/components/ui/shine-border";
import { FadeUpList } from "@/components/animation/fade-up";
import { cn } from "@/lib/utils";

export function About() {
  return (
    <section
      id="tentang-kami"
      aria-labelledby="about-heading"
      className="scroll-mt-8 px-5 py-14 text-[#24211D] md:px-10 md:py-20"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">

        {/* Animated Content */}
      <FadeUpList
  once={false}
  className="flex flex-col gap-5 md:col-start-2 md:row-start-1"
>
  <p className="text-sm font-semibold tracking-wide text-[#53672A]">
    / TENTANG KAMI
  </p>

  <h2
    id="about-heading"
    className="font-heading text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]"
  >
    Sederhana bahannya.
    <span className="block text-[#53672A]">
      Istimewa rasanya.
    </span>
  </h2>

  <p className="max-w-[55ch] text-pretty text-base leading-7 text-primary-foreground">
    Kami menghadirkan es teh dengan teh pilihan yang diseduh
    dengan cermat, menghasilkan rasa yang seimbang, segar,
    dan pas di setiap tegukan. Teman yang pas untuk menemani
    aktivitas, berkumpul, atau sekadar menikmati waktu sendiri.
  </p>

  <details className="group">
    <summary
      className={cn(
        buttonVariants({
          variant: "outline",
          size: "lg",
        }),
        "w-fit cursor-pointer list-none gap-4 rounded-xl border-[#667745] bg-transparent px-6 text-base text-[#4E6227] hover:bg-[#E9ECCB] hover:text-[#4E6227] focus-visible:ring-[#53672A] [&::-webkit-details-marker]:hidden"
      )}
    >
      Cerita Kami
      <ArrowRight
        aria-hidden="true"
        className="size-5 transition-transform group-open:rotate-90"
      />
    </summary>

    <p className="mt-4 max-w-lg border-l-2 border-[#A6AF78] pl-4 text-sm leading-7 text-[#535044]">
      Bagi kami, menikmati teh adalah cara sederhana
      untuk mengambil jeda.
    </p>
  </details>
</FadeUpList>

        {/* Draggable Cards */}
        <DraggableCards>
          <div
            tabIndex={0}
            role="group"
            aria-label="Card minuman, gunakan tombol panah untuk menggeser"
            className="absolute top-[13%] left-[5%] aspect-square w-[43%] -rotate-12 overflow-hidden rounded-2xl border-4 border-[#FFFCF7] bg-[#EAD8C0] shadow-xl"
          >
            <Image
              src="/assets/kecil.png"
              alt="Es teh original dengan warna teh keemasan"
              fill
              sizes="(min-width: 768px) 290px, 40vw"
              className="object-cover"
            />
          </div>

          <div
            tabIndex={0}
            role="group"
            aria-label="Card minuman, gunakan tombol panah untuk menggeser"
            className="absolute top-[13%] right-[5%] aspect-square w-[43%] rotate-12 overflow-hidden rounded-2xl border-4 border-[#FFFCF7] bg-[#EAD8C0] shadow-xl"
          >
            <Image
              src="/assets/matcha.png"
              alt="Matcha latte dingin dengan warna hijau lembut"
              fill
              sizes="(min-width: 768px) 290px, 40vw"
              className="object-cover"
            />
          </div>

          <div
            tabIndex={0}
            role="group"
            aria-label="Card minuman, gunakan tombol panah untuk menggeser"
            className="absolute top-0 left-1/4 z-10 aspect-square w-1/2 overflow-hidden rounded-2xl border-4 border-[#FFFCF7] bg-[#EAD8C0] shadow-[0_20px_35px_-12px_rgba(58,46,27,0.4)]"
          >
            <Image
              src="/assets/tarik.png"
              alt="Segelas es teh tarik dingin dengan daun teh pilihan di sisinya"
              fill
              sizes="(min-width: 768px) 336px, 45vw"
              className="object-cover"
            />

            <ShineBorder
              aria-hidden="true"
              borderWidth={2}
              duration={18}
              shineColor={[
                "#53672A",
                "#E9D9A8",
                "#A6AF78",
              ]}
            />
          </div>
        </DraggableCards>
      </div>
    </section>
  );
}
'use client'
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import Autoplay from "embla-carousel-autoplay"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Carousel = {
    id: number
    src: string
    alt: string
}

type HeadingTypes = {
    id: number
    badge: string
    title: string
    highlight: string
    description: string
}

const CarouselImage: Carousel[] = [
    {
        id: 1,
        alt: "Es teh original dingin",
        src: "/assets/hero-01-original.png"
    },
    {
        id: 2,
        alt: "Es teh lemon segar",
        src: "/assets/hero-02-lemon.png"
    },
    {
        id: 3,
        alt: "Matcha latte dan teh tarik dingin",
        src: "/assets/hero-03-matcha-tarik.png"
    }
]


const heading: HeadingTypes[] =
    [
        {
            id: 1,
            badge: "DISEDUH SEGAR, SETIAP HARI",
            title: "SEGARNYA TEH MELATI ORIGINAL",
            highlight: "MANISNYA HARI INI.",
            description: "Dari teh original hingga favorit.",
        },
        {
            id: 2,
            badge: "KESEGARAN ALAMI",
            title: "NIKMATNYA LEMON.",
            highlight: "SEGARKAN HARIMU.",
            description: "Perpaduan lemon dan teh yang menyegarkan.",
        },
        {
            id: 3,
            badge: "RASA YANG ISTIMEWA",
            title: "LEMBUTNYA MATCHA.",
            highlight: "NIKMAT SETIAP SAAT.",
            description: "Rasakan kelembutan matcha di setiap tegukan.",
        },
    ]


export default function HeroPage() {

    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)

    const [plugin] = React.useState(() =>
        Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: false, playOnInit: true })
    )

    React.useEffect(() => {
        if (!api) {
            return
        }

        const UpdateCurrent = () => {

            setCurrent(api.selectedScrollSnap())
        }

        UpdateCurrent()

        api.on("select", UpdateCurrent)
        api.on("reInit", UpdateCurrent)

        return () => {
            api.off("select", UpdateCurrent);
            api.off("reInit", UpdateCurrent);
        }
    }, [api])

    const activeHeading = heading[current];

    return (
        <section className="relative  w-full  ">
            <Carousel
                plugins={[plugin]}
                setApi={setApi}
                opts={{
                    loop: true,
                    align: "start",
                }}
                className="w-full  "
            >
                <CarouselContent className="ml-0 ">
                    {CarouselImage.map((image) => (
                        <CarouselItem key={image.id} className="pl-0 md:p-5" >
                            <div className="relative min-h-[540px] w-full overflow-hidden md:h-[800px] md:rounded-3xl">
                                <Image fill sizes="100vw" alt={image.alt} src={image.src} loading={image.id === 1 ? "eager" : "lazy"} fetchPriority={image.id === 1 ? "high" : "auto"} className="object-cover object-center shadow-2xl" />
                                
                                <div
                                    className="
                                    pointer-events-none
                                    absolute inset-0 z-10
                                    bg-gradient-to-r
                                    from-[#FBF8F3]/95
                                    via-[#FBF8F3]/75
                                    to-transparent
                                    md:from-black/55
                                    md:via-black/20
                                    "
                                />
                                <div className="pointer-events-none absolute inset-0 z-20 flex items-center px-6 pb-14 md:-top-20 md:px-16 md:pb-0 lg:px-44">
                                    <div className="max-w-[20rem] space-y-4 md:max-w-xl md:space-y-5">

                                        <span className="inline-block rounded-full bg-[#E9ECCB] px-4 py-2 text-xs font-semibold text-[#445C20]">
                                            {activeHeading?.badge}
                                        </span>

                                        <h1 className="text-3xl font-black leading-tight text-[#24211D] sm:text-4xl md:text-6xl">
                                            {activeHeading?.title}

                                            <span className="block text-[#4E6825]">
                                                {activeHeading?.highlight}
                                            </span>
                                        </h1>

                                        <p className="max-w-md text-base text-[#383838]">
                                            {activeHeading?.description}
                                        </p>

                                        <div className="pointer-events-auto flex flex-wrap gap-3">
                                            <Link
                                                href="/#menu"
                                                className={cn(buttonVariants({ size: "lg" }), "rounded-xl px-6 py-3 text-black")}
                                            >
                                                Lihat Menu
                                            </Link>

                                            <Link
                                                href="/#tentang-kami"
                                                className={cn(buttonVariants({ variant: "ghost" }), "rounded-xl hover:scale-105 not-hover border border-[#4E6825] px-6 py-3 text-[#4E6825]")}
                                            >
                                                Kenali Kami
                                            </Link>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="top-auto bottom-5 left-6 z-20 translate-y-0 bg-white/80 shadow-md hover:bg-white md:top-1/2 md:bottom-auto md:left-20 md:-translate-y-1/2" />
                <CarouselNext className="top-auto bottom-5 right-auto left-18 z-20 translate-y-0 bg-white/80 shadow-md hover:bg-white md:top-1/2 md:right-20 md:bottom-auto md:left-auto md:-translate-y-1/2" />
            </Carousel>


        </section>
    )
}

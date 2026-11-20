import Image from "next/image"

export function ProfileAvatar({ name, image, size }: { name: string; image?: string | null; size: number }) {
  return image ? (
    <Image src={image} alt="" width={size} height={size} unoptimized className="size-full object-cover" />
  ) : (
    <span aria-hidden="true">{name.trim().charAt(0).toUpperCase() || "?"}</span>
  )
}

import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { getCurrentActor } from "@/lib/server/authorize"

export async function DashboardMenuTable() {
  const actor = await getCurrentActor()
  if (!actor) redirect("/login")

  const menus = await prisma.produk.findMany({
    select: { id: true, title: true, imageUrl: true, price: true, published: true },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 10,
  })

  return (
    <section aria-labelledby="dashboard-menu-title" className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 id="dashboard-menu-title" className="font-heading text-xl font-bold">Daftar menu terbaru</h2>
        <Link href="/dashboard/produk" className="rounded-sm text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">
          Lihat semua produk
        </Link>
      </div>
      {menus.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">Belum ada menu di katalog.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table aria-labelledby="dashboard-menu-title" className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-muted-foreground">
              <tr>
                <th scope="col" className="px-3 py-3 font-medium sm:px-5">Menu</th>
                <th scope="col" className="px-3 py-3 font-medium sm:px-5">Harga</th>
                <th scope="col" className="px-3 py-3 font-medium sm:px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {menus.map((menu) => (
                <tr key={menu.id}>
                  <th scope="row" className="px-3 py-3 font-semibold sm:px-5">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {menu.imageUrl && (
                        <Image src={menu.imageUrl} alt="" width={40} height={40} unoptimized className="size-8 shrink-0 rounded-lg object-cover sm:size-10" />
                      )}
                      <span className="wrap-anywhere">{menu.title}</span>
                    </div>
                  </th>
                  <td className="px-3 py-3 whitespace-nowrap tabular-nums sm:px-5">Rp {menu.price.toLocaleString("id-ID")}</td>
                  <td className="px-3 py-3 text-muted-foreground sm:px-5">{menu.published ? "Tayang" : "Draft"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

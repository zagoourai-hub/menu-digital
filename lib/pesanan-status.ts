export const statusLabels = {
  PENDING: "Menunggu",
  DIBUAT: "Sedang dibuat",
  DIANTAR: "Diantar",
  SELESAI: "Selesai",
} as const

export type StatusProses = keyof typeof statusLabels

export const nextStatus: Partial<Record<StatusProses, StatusProses>> = {
  PENDING: "DIBUAT",
  DIBUAT: "DIANTAR",
  DIANTAR: "SELESAI",
}

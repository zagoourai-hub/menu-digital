import "server-only"

import { Snap } from "midtrans-client"
import { z } from "zod"

const midtransConfigSchema = z.object({
  serverKey: z.string().trim().min(1),
  clientKey: z.string().trim().min(1),
})

export class MidtransService {
  readonly snap: Snap

  constructor() {
    const config = midtransConfigSchema.safeParse({
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    })

    if (!config.success) {
      throw new Error("MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY sandbox harus diisi.")
    }

    this.snap = new Snap({ ...config.data, isProduction: false })
  }
}

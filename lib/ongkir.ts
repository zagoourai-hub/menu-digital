export const DELIVERY_RATE_PER_KM = 2000
export const MAX_DELIVERY_KM = 100

export function calculateDeliveryFee(distanceKm: number) {
  return Math.ceil(distanceKm) * DELIVERY_RATE_PER_KM
}

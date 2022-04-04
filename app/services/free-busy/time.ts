import { addMinutes, set } from "date-fns"

export function sliderToDate(sliderValue: number): Date {
  const hours = Math.floor(sliderValue / 2)
  const minutes = (sliderValue % 2) * 30
  const date = set(new Date(), { hours, minutes })
  return sliderValue === 48 ? addMinutes(date, -1) : date
}

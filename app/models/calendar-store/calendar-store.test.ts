import { CalendarStoreModel } from "./calendar-store"

test("can be created", () => {
  const instance = CalendarStoreModel.create({})

  expect(instance).toBeTruthy()
})

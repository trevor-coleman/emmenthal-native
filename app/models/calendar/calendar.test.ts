import { CalendarModel } from "./calendar"

test("can be created", () => {
  const instance = CalendarModel.create({})

  expect(instance).toBeTruthy()
})

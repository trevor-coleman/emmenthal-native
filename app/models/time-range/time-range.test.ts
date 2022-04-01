import { TimeRangeModel } from "./time-range"

test("can be created", () => {
  const instance = TimeRangeModel.create({})

  expect(instance).toBeTruthy()
})

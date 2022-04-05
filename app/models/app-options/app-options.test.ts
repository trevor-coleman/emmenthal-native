import { AppOptionsModel } from "./app-options"

test("can be created", () => {
  const instance = AppOptionsModel.create({})

  expect(instance).toBeTruthy()
})

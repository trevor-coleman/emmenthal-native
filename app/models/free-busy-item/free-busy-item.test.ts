import { FreeBusyItemModel } from "./free-busy-item"

test("can be created", () => {
  const instance = FreeBusyItemModel.create({})

  expect(instance).toBeTruthy()
})

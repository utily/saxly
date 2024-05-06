import "jest"
import { saxly } from "../index"

describe("saxly.Parser", () => {
	it("parse empty root", async () => {
		expect(await saxly.Parser.parse("<root/>")).toMatchInlineSnapshot()
	})
})

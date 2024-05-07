import "jest"
import { saxly } from "../index"

describe("saxly.Parser", () => {
	it("parse <root/>", async () => expect(await saxly.Parser.parse("<root/>")).toMatchSnapshot())
	it("parse <root></root>", async () => expect(await saxly.Parser.parse("<root></root>")).toMatchSnapshot())
	it('parse <root attribute="value"></root>', async () =>
		expect(await saxly.Parser.parse('<root attribute="value"></root>')).toMatchSnapshot())
	it('parse <root attribute="value">\nText<element key="value" readonly>last name</element></root>', async () =>
		expect(
			await saxly.Parser.parse('<root attribute="value">\nText<element key="value" readonly>last name</element></root>')
		).toMatchSnapshot())
})

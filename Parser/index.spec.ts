import "jest"
import { saxly } from "../index"

describe("saxly.Parser", () => {
	it("parse <root/>", async () => expect(await saxly.Parser.parse("<root/>")).toMatchSnapshot())
	it("parse <root></root>", async () => expect(await saxly.Parser.parse("<root></root>")).toMatchSnapshot())
	it('parse <root attribute="value"></root>', async () =>
		expect(await saxly.Parser.parse('<root attribute="value"></root>')).toMatchSnapshot())
	it("parse <root readonly></root>", async () =>
		expect(await saxly.Parser.parse("<root readonly></root>")).toMatchSnapshot())
	it("parse <root>text</root>", async () => expect(await saxly.Parser.parse("<root>text</root>")).toMatchSnapshot())
	it("parse <root>first name</root>", async () =>
		expect(await saxly.Parser.parse("<root>first name</root>")).toMatchSnapshot())
	it('parse <?xml version="1.0" language="en/US"?>\n<root/>', async () =>
		expect(await saxly.Parser.parse('<?xml version="1.0" language="en/US"?>\n<root/>')).toMatchSnapshot())
	it("parse <root><nested/></root>", async () =>
		expect(await saxly.Parser.parse("<root><nested/></root>")).toMatchSnapshot())
	it("parse <root><nested></nested></root>", async () =>
		expect(await saxly.Parser.parse("<root><nested></nested></root>")).toMatchSnapshot())
	it("parse <root>first<nested></nested>last</root>", async () =>
		expect(await saxly.Parser.parse("<root>first<nested></nested>last</root>")).toMatchSnapshot())
	it("parse <root><nested><inner/></nested></root>", async () =>
		expect(await saxly.Parser.parse("<root><nested><inner/></nested></root>")).toMatchSnapshot())
	it("parse <root>first<nested>middle</nested>last</root>", async () =>
		expect(await saxly.Parser.parse("<root>first<nested>middle</nested>last</root>")).toMatchSnapshot())
	it('parse <root attribute="value">\nText<element key="value" readonly>last name</element></root>', async () =>
		expect(
			await saxly.Parser.parse('<root attribute="value">\nText<element key="value" readonly>last name</element></root>')
		).toMatchSnapshot())
})

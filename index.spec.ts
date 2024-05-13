import "jest"
import { saxly } from "./index"

describe("saxly", () => {
	it("parse <root/>", async () => expect(await saxly.parse("<root/>")).toMatchSnapshot())
	it("parse <root></root>", async () => expect(await saxly.parse("<root></root>")).toMatchSnapshot())
	it('parse <root attribute="value"></root>', async () =>
		expect(await saxly.parse('<root attribute="value"></root>')).toMatchSnapshot())
	it("parse <root readonly></root>", async () => expect(await saxly.parse("<root readonly></root>")).toMatchSnapshot())
	it("parse <root>text</root>", async () => expect(await saxly.parse("<root>text</root>")).toMatchSnapshot())
	it("parse <root>first name</root>", async () =>
		expect(await saxly.parse("<root>first name</root>")).toMatchSnapshot())
	it('parse <?xml version="1.0" language="en/US"?>\n<root/>', async () =>
		expect(await saxly.parse('<?xml version="1.0" language="en/US"?>\n<root/>')).toMatchSnapshot())
	it("parse <root><nested/></root>", async () => expect(await saxly.parse("<root><nested/></root>")).toMatchSnapshot())
	it("parse <root><nested></nested></root>", async () =>
		expect(await saxly.parse("<root><nested></nested></root>")).toMatchSnapshot())
	it("parse <root>first<nested></nested>last</root>", async () =>
		expect(await saxly.parse("<root>first<nested></nested>last</root>")).toMatchSnapshot())
	it("parse <root><nested><inner/></nested></root>", async () =>
		expect(await saxly.parse("<root><nested><inner/></nested></root>")).toMatchSnapshot())
	it("parse <root>first<nested>middle</nested>last</root>", async () =>
		expect(await saxly.parse("<root>first<nested>middle</nested>last</root>")).toMatchSnapshot())
	it('parse <root attribute="value">\nText<element key="value" readonly>last name</element></root>', async () =>
		expect(
			await saxly.parse('<root attribute="value">\nText<element key="value" readonly>last name</element></root>')
		).toMatchSnapshot())
	it("parse <root>  first middle last</root>", async () =>
		expect(await saxly.parse("<root>\n  first middle last\n</root>")).toMatchSnapshot())
})

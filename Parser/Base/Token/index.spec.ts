import "jest"
import { Token } from "./"

async function tokenize(data: string): Promise<Token[]> {
	const result: Token[] = []
	for await (const token of Token.tokenize(data))
		result.push(token)
	return result
}

describe("saxly.Parser.Base.Token", () => {
	it("parse <root/>", async () => expect(await tokenize("<root/>")).toMatchSnapshot())
	it("parse <root></root>", async () => expect(await tokenize("<root></root>")).toMatchSnapshot())
})

import "jest"
import { Token } from "./"

async function tokenize(data: string): Promise<Token[]> {
	const result: Token[] = []
	for await (const token of Token.tokenize(data))
		result.push(token)
	return result
}

describe("saxly.Parser.Base.Token", () => {
	it("parse empty root", async () => {
		expect(await tokenize("<root/>")).toMatchInlineSnapshot()
	})
})

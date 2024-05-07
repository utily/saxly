import { Position } from "../../../Position"
import { Range } from "../../../Range"

export class Token {
	constructor(readonly type: "whitespace" | "symbol" | "text", readonly content: string, readonly range: Range) {}
	private append(character: string): Token {
		return new Token(this.type, this.content + character, this.range)
	}
	merge(token: Token | undefined): Token {
		return !token ? this : new Token(this.type, this.content + token.content, Range.merge(this.range, token.range))
	}
	static async *tokenize(data: AsyncIterable<string> | string): AsyncIterable<Token> {
		if (typeof data == "string") {
			const d = data
			data = (async function* () {
				yield Promise.resolve(d)
			})()
		}
		let last: Token | undefined
		let start = { row: 0, column: 0 }
		for await (const chunk of data) {
			for (const character of chunk) {
				const type = characterType(character)
				if (last && type == last?.type && (type != "symbol" || combinedSymbol(last.content + character)))
					last = last.append(character)
				else {
					if (last)
						yield last
					last = new Token(type, character, { start, end: Position.add(start, character) })
				}
				start = last.range.end
			}
		}
		if (last)
			yield last
	}
}

function characterType(character: string): Token["type"] {
	return character.match(/\s/) ? "whitespace" : character.match(/[<>/"=]/) ? "symbol" : "text"
}
function combinedSymbol(symbol: string): boolean {
	return (
		{
			"</": true,
			"/>": true,
			'\\"': true,
			"\\'": true,
			"<?": true,
			"?>": true,
			"<!": true,
		}[symbol] ?? false
	)
}

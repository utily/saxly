import { Position } from "./Position"

export class Token {
	constructor(
		readonly type: "whitespace" | "symbol" | "text",
		readonly content: string,
		readonly start: Position,
		readonly end: Position
	) {}
	private append(character: string): Token {
		return new Token(this.type, this.content + character, this.start, this.end)
	}
	merge(token: Token | undefined): Token {
		return !token ? this : new Token(this.type, this.content + token.content, this.start, token.end)
	}
	static async *tokenize(data: AsyncIterable<string>): AsyncIterable<Token> {
		let last: Token | undefined
		let position = { row: 0, column: 0 }
		for await (const chunk of data) {
			for (const character of chunk) {
				const type = characterType(character)
				if (!last || type != last?.type) {
					if (last)
						yield last
					last = new Token(type, character, position, Position.add(position, character))
				} else
					last = last.append(character)
				position = last.end
			}
		}
		if (last)
			yield last
	}
}

function characterType(character: string): Token["type"] {
	return character.match(/\s/) ? "whitespace" : character.match(/[<>/"=]/) ? "symbol" : "text"
}

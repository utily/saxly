import { AsyncEnumerator } from "./AsyncEnumerator"
import { Position } from "./Position"
import { Token } from "./Token"

export class Tokens extends AsyncEnumerator<Token> {
	#start: Position | undefined
	get start(): Position {
		return this.#start ?? { row: 0, column: 0 }
	}
	#end: Position | undefined
	get end(): Position {
		return this.#end ?? { row: 0, column: 0 }
	}
	protected onRead(token: Token): void {
		this.#start = token.start
		this.#end = token.end
	}
	private constructor(tokens: AsyncIterator<Token>) {
		super(tokens)
	}
	async is(type: Token["type"]): Promise<boolean> {
		return (await this.peek())?.type == type
	}
	async readWhitespace(): Promise<Token | undefined> {
		let result: Token | undefined
		if (await this.is("whitespace")) {
			result = await this.read()
			while (result && (await this.is("whitespace")))
				result = result.merge(await this.read())
		}
		return result
	}
	async readIfContent(content: string): Promise<Token | undefined> {
		return this.readIf(token => token.content == content)
	}
	async readIfSymbol(...content: string[]): Promise<Token | undefined> {
		return this.readIf(token => token.type == "symbol" && content.some(c => c == token.content))
	}
	async readIfName(): Promise<Token | undefined> {
		return this.readIf(token => /^[a-zA-Z_][a-zA-Z0-9_\-\\.]*$/.test(token.content))
	}
	static tokenize(data: AsyncIterable<string>): Tokens {
		return new Tokens(Token.tokenize(data)[Symbol.iterator])
	}
}

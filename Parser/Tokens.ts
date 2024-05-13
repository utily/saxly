import { AsyncEnumerator } from "../AsyncEnumerator"
import { Range } from "../Range"
import { Token } from "./Token"

export class Tokens extends AsyncEnumerator<Token> {
	#range: Range | undefined
	get range(): Range {
		return this.#range ?? { start: { row: 0, column: 0 }, end: { row: 0, column: 0 } }
	}
	protected onRead(token: Token): void {
		this.#range = token.range
	}
	async is(type: Token["type"], ...contents: string[]): Promise<boolean> {
		const peeked = await this.peek()
		return peeked?.type == type && (!contents.length || contents.some(c => c == peeked?.content))
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
	private async readIfType(type: Token["type"], ...contents: string[]): Promise<Token | undefined> {
		return this.readIf(this.getPredicate(type, contents))
	}
	private getPredicate(type: string, contents: string[]): (element: Token) => boolean {
		return !contents.length
			? token => token.type == type
			: contents.length == 1
			? token => token.type == type && token.content == contents[0]
			: token => token.type == type && contents.some(c => c == token.content)
	}

	async readIfSymbol(...contents: string[]): Promise<Token | undefined> {
		return this.readIfType("symbol", ...contents)
	}
	async readIfText(...contents: string[]): Promise<Token | undefined> {
		return this.readIfType("text", ...contents)
	}
	async readIfName(): Promise<Token | undefined> {
		return this.readIf(token => /^[a-zA-Z_][a-zA-Z0-9_\-\\.]*$/.test(token.content))
	}
	async readAll(): Promise<Token | undefined> {
		let result = new Token("text", "", this.range)
		while (await this.peek())
			result = result.merge(await this.read())
		return result.content != "" ? result : undefined
	}
	untilSymbol(...contents: string[]): this {
		return this.until(this.getPredicate("symbol", contents))
	}
	static tokenize(data: AsyncIterable<string> | string): Tokens {
		return new Tokens(Token.tokenize(data)[Symbol.asyncIterator]())
	}
}

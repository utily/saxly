import { Position } from "./Position"
import { Tokens } from "./Tokens"

export abstract class Parser<D, E, A, T> {
	protected abstract createDocument(content: E): Promise<D>
	protected abstract createElement(name: string, attributes: A[], children: (E | T)[]): Promise<E>
	protected abstract createAttribute(name: string, value: string): Promise<A>
	protected abstract createText(content: string): Promise<E>
	protected abstract onError(error: "unknown" | "no element" | "expected name", start: Position, end: Position)

	private async parseElement(tokens: Tokens): Promise<E | undefined> {
		let result: E | undefined
		const start = tokens.start
		if (await tokens.readIfSymbol("<")) {
			await tokens.readWhitespace()
			const name = await tokens.readIfName()
			if (!name)
				this.onError("expected name", start, tokens.end)
			const attributes = await this.parseAttributes(tokens)
			if (await tokens.readIfSymbol(">")) {
				result = await this.createElement(name?.content ?? "", attributes, [])
			} else if (await tokens.readIfSymbol("/>"))
				result = await this.createElement(name?.content ?? "", attributes, [])
		} else
			result = undefined
		return result
	}
	private async parseAttributes(tokens: Tokens): Promise<A[]> {
		const result: A[] = []
		let attribute: A | undefined
		while ((attribute = await this.parseAttribute(tokens)))
			result.push(attribute)
		return result
	}
	private async parseAttribute(tokens: Tokens): Promise<A | undefined> {
		const name = await tokens.readIfName()
		await tokens.readWhitespace()
		let value: string | undefined
		if (await tokens.readIfSymbol("=")) {
			const quote = (await tokens.readIfSymbol('"', "'"))?.content
			value = tok
			await tokens.readWhitespace()
		}
		return undefined
	}
	private async parseText(tokens: Tokens): Promise<T | undefined> {
		return undefined
	}
	async parse(data: AsyncIterable<string>): Promise<void> {
		const tokens = Tokens.tokenize(data)
		const start = tokens.start
		tokens.readWhitespace()
		const element = await this.parseElement(tokens)
		if (element)
			this.createDocument(element)
		else
			this.onError("no element", start, tokens.end)
	}
}

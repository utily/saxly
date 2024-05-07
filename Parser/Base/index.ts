import { Range } from "../../Range"
import { ErrorType } from "../ErrorType"
import { Tokens } from "./Tokens"

export abstract class Base {
	protected abstract onStartElement(name: string, attributes: Record<string, string | undefined>): void
	protected abstract onEndElement(name: string): void
	protected abstract onText(text: string): void
	protected abstract onDeclaration(type: string, attributes: { version?: string; encoding?: string }): void
	protected abstract onError(error: ErrorType, range: Range): void
	async parse(data: AsyncIterable<string> | string): Promise<void> {
		const tokens = Tokens.tokenize(data)
		while (await tokens.peek()) {
			await tokens.readWhitespace()
			if (await tokens.readIfSymbol("<")) {
				await tokens.readWhitespace()
				const name = (await tokens.readIfName())?.content ?? ""
				if (!name)
					this.onError("expected element name", tokens.range)
				const attributes = await this.parseAttributes(tokens)
				const end = (await tokens.readIfSymbol(">", "/>"))?.content
				if (!end)
					this.onError("expected start element end", tokens.range)
				this.onStartElement(name, attributes)
				if (end == "/>")
					this.onEndElement(name)
			} else if (await tokens.readIfSymbol("</")) {
				await tokens.readWhitespace()
				const name = (await tokens.readIfName())?.content ?? ""
				if (!name)
					this.onError("expected element name", tokens.range)
				await tokens.readWhitespace()
				if (!(await tokens.readIfSymbol(">")))
					this.onError("expected end element end", tokens.range)
				this.onEndElement(name)
			} else if (await tokens.readIfSymbol("<?")) {
				await tokens.readWhitespace()
				const type = (await tokens.readIfText("xml"))?.content ?? ""
				if (!type)
					this.onError("expected declaration type", tokens.range)
				const attributes = await this.parseAttributes(tokens)
				if (!(await tokens.readIfSymbol("?>")))
					this.onError("expected declaration end", tokens.range)
				this.onDeclaration(type, attributes)
			} else {
				this.onError("unknown", tokens.range)
				await tokens.read()
			}
		}
	}
	private async parseAttributes(tokens: Tokens): Promise<Record<string, string | undefined>> {
		const result: Record<string, string | undefined> = {}
		let attribute: [string, string | undefined] | undefined
		while ((attribute = await this.parseAttribute(tokens)))
			if (attribute)
				result[attribute[0]] = attribute[1]
		return result
	}
	private async parseAttribute(tokens: Tokens): Promise<[string, string | undefined] | undefined> {
		await tokens.readWhitespace()
		const name = await tokens.readIfName()
		let quote: string | undefined
		const value =
			name &&
			(await tokens.readIfSymbol("=")) &&
			// eslint-disable-next-line no-cond-assign
			(await ((quote = (await tokens.readIfSymbol('"', "'"))?.content)
				? tokens.untilSymbol(quote).readAll()
				: tokens.readIfText()))
		return name && [name.content, value?.content]
	}
}

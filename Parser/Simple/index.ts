import { isly } from "isly"
import { Type } from "../../Error/Type"
import { Range } from "../../Range"
import { Token } from "./Token"
import { Tokens } from "./Tokens"

export abstract class Simple {
	protected abstract onStartElement(name: string, attributes: Record<string, string | undefined>, range: Range): void
	protected abstract onEndElement(name: string, range: Range): void
	protected abstract onText(text: string, range: Range): void
	protected abstract onDeclaration(
		type: string,
		attributes: { version?: string; encoding?: string },
		range: Range
	): void
	protected abstract onError(error: Type, range: Range): void
	async parse(data: AsyncIterable<string> | string): Promise<void> {
		const tokens = Tokens.tokenize(data)
		while (await tokens.peek()) {
			if (await tokens.readIfSymbol("<")) {
				await tokens.readWhitespace()
				const name = (await tokens.readIfName())?.content ?? ""
				if (!name)
					this.onError("expected element name", tokens.range)
				const attributes = await this.parseAttributes(tokens)
				const end = (await tokens.readIfSymbol(">", "/>"))?.content
				if (!end)
					this.onError("expected start element end", tokens.range)
				this.onStartElement(name, attributes, tokens.range)
				if (end == "/>")
					this.onEndElement(name, tokens.range)
			} else if (await tokens.readIfSymbol("</")) {
				await tokens.readWhitespace()
				const name = (await tokens.readIfName())?.content ?? ""
				if (!name)
					this.onError("expected element name", tokens.range)
				await tokens.readWhitespace()
				if (!(await tokens.readIfSymbol(">")))
					this.onError("expected end element end", tokens.range)
				this.onEndElement(name, tokens.range)
			} else if ((await tokens.is("text")) || (await tokens.is("whitespace"))) {
				const text = await tokens.read()
				if (text?.type == "text" || text?.type == "whitespace")
					this.onText(text.content, tokens.range)
			} else if (await tokens.readIfSymbol("<?")) {
				await tokens.readWhitespace()
				const type = (await tokens.readIfText())?.content ?? ""
				if (!type)
					this.onError("expected declaration type", tokens.range)
				const attributes = await this.parseAttributes(tokens)
				if (!(await tokens.readIfSymbol("?>")))
					this.onError("expected declaration end", tokens.range)
				this.onDeclaration(type, attributes, tokens.range)
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
		let value: Token | undefined
		if (await tokens.readIfSymbol("=")) {
			const quote = (await tokens.readIfSymbol('"', "'"))?.content
			if (!quote)
				value = await tokens.readIfText()
			else {
				value = await tokens.untilSymbol(quote).readAll()
				if (!(await tokens.readIfSymbol(quote)))
					this.onError("expected end quote", tokens.range)
			}
		}
		return name && [name.content, value?.content]
	}
	static create(callbacks: Simple.Callbacks): Simple {
		return new FromCallbacks(
			callbacks.onStartElement,
			callbacks.onEndElement,
			callbacks.onText,
			callbacks.onError,
			callbacks.onDeclaration
		)
	}
}
export namespace Simple {
	export interface Callbacks {
		onStartElement: Simple["onStartElement"]
		onEndElement: Simple["onEndElement"]
		onText?: Simple["onText"]
		onError?: Simple["onError"]
		onDeclaration?: Simple["onDeclaration"]
	}
	export namespace Callbacks {
		export const type = isly.object<Callbacks>({
			onStartElement: isly.function(),
			onEndElement: isly.function(),
			onText: isly.function<Simple["onText"]>().optional(),
			onError: isly.function<Simple["onError"]>().optional(),
			onDeclaration: isly.function<Simple["onDeclaration"]>().optional(),
		})
		export const is = type.is
		export const flaw = type.flaw
	}
}
class FromCallbacks extends Simple {
	constructor(
		protected onStartElement: Simple["onStartElement"],
		protected onEndElement: Simple["onEndElement"],
		protected onText: Simple["onText"] = () => {
			return
		},
		protected onError: Simple["onError"] = () => {
			return
		},
		protected onDeclaration: Simple["onDeclaration"] = () => {
			return
		}
	) {
		super()
	}
}

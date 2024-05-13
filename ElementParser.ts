import { Type } from "./Error/Type"
import { Parser } from "./Parser"
import { Range } from "./Range"

interface ItemStart {
	type: "start"
	name: string
	attributes: Record<string, string | undefined>
	range: Range
}
interface ItemElement<Element> {
	type: "element"
	content: Element
	range: Range
}
interface ItemText<Text = string> {
	type: "text"
	content: Text
	range: Range
}
interface ItemError<Error = void> {
	type: "error"
	content: Error
	range: Range
}
type Item<Element, Text, Error> = ItemStart | ItemElement<Element> | ItemText<Text> | ItemError<Error>

export class ElementParser<Element, Text = string, Error = void> {
	private readonly stack: Item<Element, Text, Error>[] = []
	private readonly backend = Parser.create({
		onStartElement: (name: string, attributes: Record<string, string | undefined>, range: Range): void => {
			this.stack.push({ type: "start", name, attributes, range })
		},
		onEndElement: this.onEndElement.bind(this),
		onText: (text: string, range: Range): void => {
			this.stack.push({ type: "text", content: this.onText(text), range })
		},
		onError: (error: Type, range: Range): void => {
			this.stack.push({ type: "error", content: this.onError(error, range), range })
		},
	})
	private constructor(
		private onElement: ElementParser.Callbacks<Element, Text, Error>["onElement"],
		private onText: ElementParser.Callbacks<Element, Text, Error>["onText"],
		private onError: ElementParser.Callbacks<Element, Text, Error>["onError"]
	) {}
	private onEndElement(name: string, range: Range): void {
		const content: (Element | Text)[] = []
		const errors: Error[] = []
		let node = this.stack.pop()
		while (node?.type != "start") {
			if (node?.type == "error")
				errors.unshift(node.content)
			else if (node)
				content.unshift(node.content)
			else
				errors.unshift(this.onError("expected element or text", range))
			node = this.stack.pop()
		}
		if (node.type != "start" || node.name != name)
			errors.unshift(this.onError("expected start tag", node.range))
		this.stack.push({
			type: "element",
			content: this.onElement(name, node.attributes, content, errors),
			range: Range.merge(node.range, range),
		})
	}
	async parse(data: AsyncIterable<string> | string): Promise<Element | Error> {
		await this.backend.parse(data)
		if (this.stack.length > 1) {
			const startElements = this.stack
				.filter(
					(
						item
					): item is { type: "start"; name: string; attributes: Record<string, string | undefined>; range: Range } =>
						item.type == "start"
				)
				.reverse()
			for (const start of startElements) {
				this.stack.unshift({
					type: "error",
					content: this.onError("expected end tag", start.range),
					range: start.range,
				})
				this.onEndElement(start.name, start.range)
			}
		}
		const result = this.stack.pop()
		return result?.type == "element" ? result.content : this.onError("expected start tag", result?.range ?? Range.zero)
	}
	static create<Element, Text, Error>(
		callbacks: ElementParser.Callbacks<Element, Text, Error>
	): ElementParser<Element, Text, Error> {
		return new ElementParser(callbacks.onElement, callbacks.onText, callbacks.onError)
	}
}
export namespace ElementParser {
	export interface Callbacks<Element, Text = string, Error = void> {
		onElement: (
			name: string,
			attributes: Record<string, string | undefined>,
			content: (Element | Text)[],
			errors: Error[]
		) => Element
		onText: (value: string) => Text
		onError: (error: Type, range: Range) => Error
	}
}

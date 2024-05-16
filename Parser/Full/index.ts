import { isly } from "isly"
import { Type } from "../../Error/Type"
import { Range } from "../../Range"
import { Simple } from "../Simple"
import { Item } from "./Item"

export class Full<Element, Text = string, Error = void> {
	private readonly stack: Item<Element, Text, Error>[] = []
	private readonly backend = Simple.create({
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
		private onElement: Full.Callbacks<Element, Text, Error>["onElement"],
		private onText: Full.Callbacks<Element, Text, Error>["onText"],
		private onError: Full.Callbacks<Element, Text, Error>["onError"]
	) {}
	private onEndElement(name: string, range: Range): void {
		const content: (Element | Text)[] = []
		const errors: Error[] = []
		let node = this.stack.pop()
		while (!Item.Start.is(node)) {
			if (Item.Error.is(node))
				errors.unshift(node.content)
			else if (node)
				content.unshift(node.content)
			else
				errors.unshift(this.onError("expected element or text", range))
			node = this.stack.pop()
		}
		if (!Item.Start.is(node) || node.name != name)
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
			const startElements = this.stack.filter(Item.Start.is).reverse()
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
	static create<Element, Text, Error>(callbacks: Full.Callbacks<Element, Text, Error>): Full<Element, Text, Error> {
		return new Full(callbacks.onElement, callbacks.onText, callbacks.onError)
	}
}
export namespace Full {
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
	export namespace Callbacks {
		export const type = isly.object<Callbacks<any, any, any>>({
			onElement: isly.function(),
			onText: isly.function(),
			onError: isly.function(),
		})
		export const is = type.is
		export const flaw = type.flaw
	}
}

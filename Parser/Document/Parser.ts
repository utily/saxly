import { Range } from "../../Range"
import { Base } from "../Base"
import { ErrorType } from "../ErrorType"
import type { Document } from "."
import { Element } from "./Element"
import { ElementStart } from "./ElementStart"

export class Parser extends Base {
	private readonly stack: (Document.Element | ElementStart | string | Document.Declaration)[] = []
	private readonly errors: Document.Error[] = []
	protected onStartElement(name: string, attributes: Record<string, string | undefined>): void {
		this.stack.push({ name, attributes })
	}
	protected onEndElement(name: string): void {
		const content: Document.Element["content"] = []
		let node = this.stack.pop()
		while (!ElementStart.is(node) || Element.is(node) /* as ElementStart.is(Element) == true */) {
			if (Element.is(node) || typeof node == "string")
				content.unshift(node)
			else {
				const a = [ElementStart.is(node), Element.is(node), !(ElementStart.is(node) && !Element.is(node))]
				console.log(a)
				this.errors.push({ error: "expected element or text", node })
			}
			node = this.stack.pop()
		}
		if (!(ElementStart.is(node) && !Element.is(node) && node.name == name))
			this.errors.push({ error: "expected start element", node })
		this.stack.push({
			...node,
			content,
		})
	}
	protected onText(text: string): void {
		this.stack.push(text)
	}
	protected onDeclaration(
		type: string,
		attributes: { version?: string | undefined; encoding?: string | undefined }
	): void {
		this.stack.push({ type, attributes })
	}
	protected onError(error: ErrorType, range: Range): void {
		this.errors.push({ error, range })
	}
	async parseDocument(data: AsyncIterable<string> | string): Promise<Document | undefined> {
		await this.parse(data)
		const declaration = typeof this.stack[0] == "object" && "type" in this.stack[0] ? this.stack[0] : undefined
		const root = this.stack.at(-1) as Document.Element
		return { declaration, root, errors: this.errors }
	}
}

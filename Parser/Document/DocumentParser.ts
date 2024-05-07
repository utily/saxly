import { Range } from "../../Range"
import { Base } from "../Base"
import { ErrorType } from "../ErrorType"
import type { Document } from "."
import { Element } from "./Element"
import { ElementStart } from "./ElementStart"

export class DocumentParser extends Base {
	private readonly stack: (Document.Element | ElementStart | string | Document.Declaration)[] = []
	private readonly errors: Document.Error[] = []
	protected onStartElement(name: string, attributes: Record<string, string | undefined>): void {
		this.stack.push({ name, attributes })
	}
	protected onEndElement(name: string): void {
		const content: Document.Element["content"] = []
		while ((item => Element.is(item) || typeof item == "string")(this.stack.at(-1)))
			content.push(this.stack.pop() as any as Document.Element["content"][number])
		const start = this.stack.pop()
		if (!(ElementStart.is(start) && start.name == name))
			this.errors.push({ error: "expected start element", node: start })
		this.stack.push({
			name,
			attributes: typeof start == "object" && "attributes" in start ? start.attributes : {},
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

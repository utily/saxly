import { Range } from "../Range"
import { Base } from "./Base"
import { ErrorType } from "./ErrorType"

export interface Document {
	declaration?: Document.Declaration
	root?: Document.Element
	errors: Document.Error[]
}
export namespace Document {
	export function parse(data: AsyncIterable<string> | string): Promise<Document | undefined> {
		return new DocumentParser().parseDocument(data)
	}
	interface ElementStart {
		name: string
		attributes: Record<string, string | undefined>
	}
	export interface Element extends ElementStart {
		content: (Element | string)[]
	}
	export interface Declaration {
		type: string
		attributes: Record<string, string | undefined>
	}
	export interface Error {
		error: ErrorType
		range: Range
	}
	class DocumentParser extends Base {
		private readonly stack: (Element | ElementStart | string | Declaration)[] = []
		private readonly errors: Error[] = []
		protected onStartElement(name: string, attributes: Record<string, string | undefined>): void {
			this.stack.push({ name, attributes })
		}
		protected onEndElement(name: string): void {
			const content: Element["content"] = []
			while ((item => typeof item == "string" || (item && "name" in item && !("content" in item)))(this.stack.at(-1)))
				content.push(this.stack.pop() as any as Element["content"][number])
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
			const root = this.stack.at(-1) as Element
			return { declaration, root, errors: this.errors }
		}
	}
}

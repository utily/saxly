import { isly } from "isly"
import { Declaration, Declaration as DocumentDeclaration } from "./Declaration"
import { Element as DocumentElement, Element } from "./Element"
import { Error as DocumentError, Error } from "./Error"
import { Parser } from "./Parser"

export interface Document {
	declaration?: Document.Declaration
	root?: Document.Element
	errors: Document.Error[]
}
export namespace Document {
	export const type = isly.object<Document>(
		{ declaration: Declaration.type.optional(), root: Element.type.optional(), errors: isly.array(Error.type) },
		"Document"
	)
	export const is = type.is
	export const flaw = type.flaw
	export type Element = DocumentElement
	export type Error = DocumentError
	export type Declaration = DocumentDeclaration
	export function parse(data: AsyncIterable<string> | string): Promise<Document | undefined> {
		return new Parser().parseDocument(data)
	}
}

import { isly } from "isly"
import { Error as DocumentError } from "../Error"
import { Parser } from "../Parser"
import { Declaration as DocumentDeclaration } from "./Declaration"
import { Element as DocumentElement } from "./Element"

export interface Document {
	declaration?: Document.Declaration
	root: Document.Element
}
export namespace Document {
	export const type = isly.object<Document>(
		{ declaration: DocumentDeclaration.type.optional(), root: DocumentElement.type },
		"Document"
	)
	export const is = type.is
	export const flaw = type.flaw
	export type Element = DocumentElement
	export const Element = DocumentElement
	export type Error = DocumentError
	export const Error = DocumentError
	export type Declaration = DocumentDeclaration
	export const Declaration = DocumentDeclaration
	export async function parse(data: AsyncIterable<string> | string): Promise<Document | Error> {
		const parser = Parser.create<Element, string, Error>({
			onElement: (name, attributes, content, errors) => ({
				name,
				attributes,
				content,
				errors,
			}),
			onText: (value: string) => value,
			onError: (error, range) => ({
				error,
				range,
			}),
		})
		const result = await parser.parse(data)
		return Error.is(result) ? result : { root: result }
	}
}

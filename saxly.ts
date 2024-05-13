import { Document } from "./Document"
import { Error } from "./Error"
import { Parser } from "./Parser"
import { Position } from "./Position"
import { Range } from "./Range"

function parse(data: AsyncIterable<string> | string): Promise<Document | Document.Error> {
	return Document.parse(data)
}

export const saxly = {
	Document,
	Error,
	Parser,
	Position,
	Range,
	parse,
}

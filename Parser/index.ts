import { Base } from "./Base"
import { CallbackParser } from "./CallbackParser"
import { Document } from "./Document"

export abstract class Parser extends Base {
	static create(
		onStartElement: Parser["onStartElement"],
		onEndElement: Parser["onEndElement"],
		onText: Parser["onText"],
		onDeclaration: Parser["onDeclaration"] = () => {
			return
		},
		onError: Parser["onError"] = () => {
			return
		}
	): Parser {
		return new CallbackParser(onStartElement, onEndElement, onText, onDeclaration, onError)
	}
	static parse(data: AsyncIterable<string> | string): Promise<Document | undefined> {
		return Document.parse(data)
	}
}

import { Base } from "./Base"

export class CallbackParser extends Base {
	constructor(
		protected onStartElement: Base["onStartElement"],
		protected onEndElement: Base["onEndElement"],
		protected onText: Base["onText"],
		protected onDeclaration: Base["onDeclaration"],
		protected onError: Base["onError"]
	) {
		super()
	}
}

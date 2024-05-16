import { isly } from "isly"
import { Range } from "../../../Range"

export interface Element<E> {
	type: "element"
	content: E
	range: Range
}
export namespace Element {
	export const type = isly.object<Element<any>>({
		type: isly.string("element"),
		content: isly.any(),
		range: Range.type,
	})
	export const is = type.is
	export const flaw = type.flaw
}

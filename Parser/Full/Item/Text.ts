import { isly } from "isly"
import { Range } from "../../../Range"

export interface Text<T = string> {
	type: "text"
	content: T
	range: Range
}
export namespace Text {
	export const type = isly.object<Text<any>>({
		type: isly.string("text"),
		content: isly.any(),
		range: Range.type,
	})
	export const is = type.is
	export const flaw = type.flaw
}

import { isly } from "isly"
import { Range } from "../../../Range"

export interface Error<P = void> {
	type: "error"
	content: P
	range: Range
}
export namespace Error {
	export const type = isly.object<Error<any>>({
		type: isly.string("error"),
		content: isly.any(),
		range: Range.type,
	})
	export const is = type.is
	export const flaw = type.flaw
}

import { isly } from "isly"
import { Range } from "../../Range"
import { ErrorType } from "../ErrorType"
import { Declaration } from "./Declaration"
import { Element } from "./Element"
import { ElementStart } from "./ElementStart"

export type Error =
	| {
			error: ErrorType
			range: Range
	  }
	| {
			error: "expected start element"
			node: Element | ElementStart | string | Declaration | undefined
	  }
export namespace Error {
	export const type = isly.named<Error>(
		"Error",
		isly.union(
			isly.object({ error: isly.string(), range: Range.type }),
			isly.object({
				error: isly.string("expected start element"),
				node: isly.union(Element.type, ElementStart.type, isly.string(), Declaration.type, isly.undefined()),
			})
		)
	)
	export const is = type.is
	export const flaw = type.flaw
}

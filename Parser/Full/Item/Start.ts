import { isly } from "isly"
import { Range } from "../../../Range"

export interface Start {
	type: "start"
	name: string
	attributes: Record<string, string | undefined>
	range: Range
}
export namespace Start {
	export const type = isly.object<Start>({
		type: isly.string("start"),
		name: isly.string(),
		attributes: isly.record(isly.string(), isly.union(isly.string(), isly.undefined())),
		range: Range.type,
	})
	export const is = type.is
	export const flaw = type.flaw
}

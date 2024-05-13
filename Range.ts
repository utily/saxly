import { isly } from "isly"
import { Position } from "./Position"

export interface Range {
	start: Position
	end: Position
}

export namespace Range {
	export const type = isly.object<Range>({ start: Position.type, end: Position.type }, "Range")
	export const is = type.is
	export const flaw = type.flaw
	export const zero: Range = { start: Position.zero, end: Position.zero } as const
	export function merge(left: Range, right: Range): Range {
		return { start: Position.min(left.end, right.end), end: Position.max(left.end, right.end) }
	}
}

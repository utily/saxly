import { Position } from "./Position"

export interface Range {
	start: Position
	end: Position
}

export namespace Range {
	export function merge(left: Range, right: Range): Range {
		return { start: Position.min(left.end, right.end), end: Position.max(left.end, right.end) }
	}
}

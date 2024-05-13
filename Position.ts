import { isly } from "isly"

export interface Position {
	readonly row: number
	readonly column: number
}

export namespace Position {
	export const type = isly.object<Position>({ row: isly.number(), column: isly.number() }, "Position")
	export const is = type.is
	export const flaw = type.flaw
	export const zero: Position = { row: 0, column: 0 } as const
	export function add(left: Position, right: string): Position {
		const splitted = right.split("\n")
		return splitted.length > 1
			? { row: left.row + (splitted.length - 1), column: splitted.at(-1)?.length ?? 0 }
			: { row: left.row, column: left.column + right.length }
	}
	export function min(left: Position, right: Position): Position {
		return left.row == right.row ? (left.column < right.column ? left : right) : left.row < right.row ? left : right
	}
	export function max(left: Position, right: Position): Position {
		return left.row == right.row ? (left.column > right.column ? left : right) : left.row > right.row ? left : right
	}
}

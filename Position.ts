export interface Position {
	readonly row: number
	readonly column: number
}
export namespace Position {
	export function add(left: Position, right: string): Position {
		const splitted = right.split("\n")
		return splitted.length > 1
			? { row: left.row + (splitted.length - 1), column: splitted.at(-1)?.length ?? 0 }
			: { row: left.row, column: left.column + right.length }
	}
}

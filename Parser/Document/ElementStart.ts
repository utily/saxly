import { isly } from "isly"

export interface ElementStart {
	name: string
	attributes: Record<string, string | undefined>
}

export namespace ElementStart {
	export const type = isly.object<ElementStart>({ name: isly.string(), attributes: isly.record(isly.string(), isly.union(isly.string(), isly.undefined()))})
	export const is = type.is
	export const flaw = type.flaw
}

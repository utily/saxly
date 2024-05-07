import { isly } from "isly"

export interface Declaration {
	type: string
	attributes: Record<string, string | undefined>
}

export namespace Declaration {
	export const type = isly.object<Declaration>({
		type: isly.string(),
		attributes: isly.record(isly.string(), isly.union(isly.string(), isly.undefined())),
	})
	export const is = type.is
	export const flaw = type.flaw
}

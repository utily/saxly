import { isly } from "isly"

export type Type = typeof Type.values[number]

export namespace Type {
	export const values = [
		"unknown",
		"expected element name",
		"expected start element end",
		"expected end element end",
		"expected attribute value",
		"expected declaration type",
		"expected declaration end",
		"expected end quote",
		"expected start tag" /* only ElementParser & DocumentParser */,
		"expected element or text" /* only ElementParser & DocumentParser */,
		"expected end tag" /* only ElementParser & DocumentParser */,
	] as const
	export const type = isly.string(values)
	export const is = type.is
	export const flaw = type.flaw
}

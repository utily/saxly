import { isly } from "isly"
import { Error } from "../Error"

export interface Element {
	name: string
	attributes: Record<string, string | undefined>
	content: (Element | string)[]
	errors: Error[]
}

export namespace Element {
	export const type: isly.object.ExtendableType<Element> = isly.object<Element>(
		{
			name: isly.string(),
			attributes: isly.record(isly.string(), isly.union(isly.string(), isly.undefined())),
			content: isly
				.union(
					isly.lazy<Element>(() => Element.type, "Element"),
					isly.string()
				)
				.array(),
			errors: Error.type.array(),
		},
		"Element"
	)
	export const is = type.is
	export const flaw = type.flaw
}

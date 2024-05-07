import { ElementStart } from "./ElementStart"

export interface Element extends ElementStart {
	content: (Element | string)[]
}

import { isly } from "isly"
export namespace Element {
	export const type: isly.object.ExtendableType<Element> = ElementStart.type.extend<Element>({ content: isly.union<Element | string, Element, string>(Element.type, isly.string()).array() })
	export const is = type.is
	export const flaw = type.flaw
}

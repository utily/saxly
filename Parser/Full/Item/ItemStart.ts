import { Range } from "../../../Range"

export interface ItemStart {
	type: "start"
	name: string
	attributes: Record<string, string | undefined>
	range: Range
}

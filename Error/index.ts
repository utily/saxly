import { isly } from "isly"
import { Range } from "../Range"
import { Type as ErrorType } from "./Type"

export interface Error {
	error: Error.Type
	range: Range
}
export namespace Error {
	export const type = isly.object<Error>({ error: ErrorType.type, range: Range.type }, "Error")
	export const is = type.is
	export const flaw = type.flaw
	export type Type = ErrorType
	export const Type = ErrorType
}

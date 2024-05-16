import { isly } from "isly"
import { Element as ItemElement } from "./Element"
import { Error as ItemError } from "./Error"
import { Start as ItemStart } from "./Start"
import { Text as ItemText } from "./Text"

export type Item<E, T, P> = Item.Element<E> | Item.Error<P> | Item.Start | Item.Text<T>

export namespace Item {
	export type Element<E> = ItemElement<E>
	export const Element = ItemElement
	export type Error<P> = ItemError<P>
	export const Error = ItemError
	export type Start = ItemStart
	export const Start = ItemStart
	export type Text<T> = ItemText<T>
	export const Text = ItemText
	export const type = isly.union(Element.type, Error.type, Start.type, Text.type)
}

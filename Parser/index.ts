import { Full } from "./Full"
import { Simple } from "./Simple"

export abstract class Parser extends Simple {
	static create(callbacks: Simple.Callbacks): Parser
	static create<Element, Text, Error>(
		callbacks: Simple.Callbacks | Full.Callbacks<Element, Text, Error>
	): Full<Element, Text, Error>
	static create<Element, Text = string, Error = void>(
		callbacks: Simple.Callbacks | Full.Callbacks<Element, Text, Error>
	): Parser | Full<Element, Text, Error> {
		return Simple.Callbacks.is(callbacks) ? Simple.create(callbacks) : Full.create(callbacks)
	}
}

export class AsyncEnumerator<T> {
	private current: IteratorResult<T> | undefined
	protected onRead(element: T): void {
		return
	}
	constructor(
		private readonly backend: AsyncIterator<T>,
		private readonly type: { new (backend: AsyncIterator<T>): AsyncEnumerator<T> }
	) {}
	async peek(): Promise<T | undefined> {
		return !this.current ? await this.read() : this.current.done ? undefined : this.current.value
	}
	async read(): Promise<T | undefined> {
		const result = this.current
		this.current = await this.backend.next()
		if (!this.current.done)
			this.onRead(this.current.value)
		return !result ? this.read() : result.done ? undefined : result.value
	}
	async readIf(predicate: (element: T) => boolean): Promise<T | undefined> {
		const peeked = await this.peek()
		return peeked && predicate(peeked) ? await this.read() : undefined
	}
	until(predicate: (element: T) => boolean): ThisType<T> {
		return new this.type(
			(async function* () {
				let result: T | undefined = await this.peek()
				while (result && predicate(result)) {
					yield this.read()
					result = await this.peek()
				}
			})()
		)
	}
}

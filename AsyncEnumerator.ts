export class AsyncEnumerator<T> {
	private current: IteratorResult<T> | undefined
	protected onRead(element: T): void {
		return
	}
	constructor(private readonly backend: AsyncIterator<T>) {}
	async peek(): Promise<T | undefined> {
		const result: IteratorResult<T> = (this.current ??= await this.backend.next())
		return result.done ? undefined : result.value
	}
	async read(): Promise<T | undefined> {
		const result = await this.peek()
		this.current = await this.backend.next()
		if (result)
			this.onRead(result)
		return result
	}
	async readIf(predicate: (element: T) => boolean): Promise<T | undefined> {
		const peeked = await this.peek()
		return peeked && predicate(peeked) ? await this.read() : undefined
	}
	private async *generator(predicate: (element: T) => boolean): AsyncGenerator<T> {
		let result: T | undefined = await this.peek()
		while (result && predicate(result)) {
			yield result
			await this.read()
			result = await this.peek()
		}
	}
	until(predicate: (element: T) => boolean): this {
		return new (this.constructor as { new (backend: AsyncIterator<T>): AsyncEnumerator<T> })(
			this.generator(predicate)
		) as this
	}
}

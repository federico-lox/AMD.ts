export class NumericValue {
    constructor(private val: number) { }
    get value(): number {
        return this.val;
    }
}

export const five = new NumericValue(5);

export function compare(value1: NumericValue, value2: NumericValue): boolean {
    return value1.value === value2.value;
}
import {Matcher} from "../type/Matcher";
import {Operator} from "./Operator";

export class OrOperator extends Operator {
    public readonly name = "OR";

    public isMatching(value: any): boolean {
        return this.calculateBinary(this.name, (left: Matcher, right: Matcher) =>
            left.isMatching(value) || right.isMatching(value),
        );
    }

    public toString(): string {
        return this.stringify(this.name);
    }
}

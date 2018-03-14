import {Matcher} from "../type/Matcher";
import {Operator} from "./Operator";

export class AndOperator extends Operator {
    public readonly name = "AND";

    public isMatching(value: any): boolean {
        return this.calculateBinary(this.name, (left: Matcher, right: Matcher) =>
            left.isMatching(value) && right.isMatching(value),
        );
    }

    public toString(): string {
        return this.stringify(this.name);
    }
}

import {Matcher} from "../type/Matcher";
import {Operator} from "./Operator";

export class NotOperator extends Operator {
    public readonly name = "NOT";

    public constructor() {
        super(null);
    }

    public isMatching(value: any): boolean {
        return this.calculateUnary(this.name, (right: Matcher) =>
            !right.isMatching(value),
        );
    }

    public toString(): string {
        return this.stringify(this.name);
    }
}

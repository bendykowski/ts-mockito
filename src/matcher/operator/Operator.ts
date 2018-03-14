import {AnyFunctionMatcher} from "../type/AnyFunctionMatcher";
import {AnyNumberMatcher} from "../type/AnyNumberMatcher";
import {AnyOfClassMatcher} from "../type/AnyOfClassMatcher";
import {AnyStringMatcher} from "../type/AnyStringMatcher";
import {AnythingMatcher} from "../type/AnythingMatcher";
import {BetweenMatcher} from "../type/BetweenMatcher";
import {DeepEqualMatcher} from "../type/DeepEqualMatcher";
import {IsNullMatcher} from "../type/IsNullMatcher";
import {Matcher} from "../type/Matcher";
import {MatchMatcher} from "../type/MatchMatcher";
import {NotNullMatcher} from "../type/NotNullMatcher";
import {ObjectContainingMatcher} from "../type/ObjectContainingMatcher";
import {StrictEqualMatcher} from "../type/StrictEqualMatcher";
import {AndOperator} from "./AndOperator";
import {NotOperator} from "./NotOperator";
import {OrOperator} from "./OrOperator";

export type BinaryFormula = (left: Matcher, right: Matcher) => boolean;
export type UnaryFormula = (right: Matcher) => boolean;

export class Operator extends Matcher {
    public readonly name;
    protected right: Matcher;

    public constructor(protected left: Matcher) {
        super();
    }

    // -- Operators

    public not(): this {
        if (this.right) {
            throw new Error("NOT operator is not permitted without a binary operator");
        }
        const module = require("./NotOperator");
        this.right = new module.NotOperator();
        return this;
    }

    public and(): AndOperator {
        if (!this.right) {
            throw new Error(`Incorrect right operand for ${this.name} operator`);
        }
        const module = require("./AndOperator");
        return new module.AndOperator(this);
    }

    public or(): OrOperator {
        if (!this.right) {
            throw new Error(`Incorrect right operand for ${this.name} operator`);
        }
        const module = require("./OrOperator");
        return new module.OrOperator(this);
    }

    // -- Matchers

    public anyOfClass<T>(expectedClass: { new(...args: any[]): T }): Matcher {
        this.right = this.isNotOperator(this.right)
            ? this.right.anyOfClass<T>(expectedClass)
            : new AnyOfClassMatcher<T>(expectedClass);
        return this;
    }

    public anyFunction(): Matcher {
        this.right = this.isNotOperator(this.right)
            ? this.right.anyFunction()
            : new AnyFunctionMatcher();
        return this;
    }

    public anyNumber(): Matcher {
        this.right = this.isNotOperator(this.right)
            ? this.right.anyNumber()
            : new AnyNumberMatcher();
        return this;
    }

    public anyString(): Matcher {
        this.right = this.isNotOperator(this.right)
            ? this.right.anyString()
            : new AnyStringMatcher();
        return this;
    }

    public anything(): Matcher {
        this.right = this.isNotOperator(this.right)
            ? this.right.anything()
            : new AnythingMatcher();
        return this;
    }

    public between(min: number, max: number): Matcher {
        this.right = this.isNotOperator(this.right)
            ? this.right.between(min, max)
            : new BetweenMatcher(min, max);
        return this;
    }

    public deepEqual(expectedValue: any): Matcher {
        this.right = this.isNotOperator(this.right)
            ? this.right.deepEqual(expectedValue)
            : new DeepEqualMatcher(expectedValue);
        return this;
    }

    public isNull(): Matcher {
        this.right = this.isNotOperator(this.right)
            ? this.right.isNull()
            : new IsNullMatcher();
        return this;
    }

    public notNull(): Matcher {
        this.right = this.isNotOperator(this.right)
            ? this.right.notNull()
            : new NotNullMatcher();
        return this;
    }

    public strictEqual(expectedValue: any): Matcher {
        this.right = this.isNotOperator(this.right)
            ? this.right.strictEqual(expectedValue)
            : new StrictEqualMatcher(expectedValue);
        return this;
    }

    public match(expectedValue: string | RegExp): Matcher {
        this.right = this.isNotOperator(this.right)
            ? this.right.match(expectedValue)
            : new MatchMatcher(expectedValue);
        return this;
    }

    public objectContaining(expectedValue: Object): Matcher {
        this.right = this.isNotOperator(this.right)
            ? this.right.objectContaining(expectedValue)
            : new ObjectContainingMatcher(expectedValue);
        return this;
    }

    // -- Other

    protected isNotOperator(value: Matcher): value is NotOperator {
        return value instanceof NotOperator;
    }

    protected calculateBinary(operator: string, formula: BinaryFormula) {
        if (!this.left) {
            throw new Error(`Left operand is missing for ${operator} operator`);
        }
        if (!this.right) {
            throw new Error(`Right operand is missing for ${operator} operator`);
        }
        return formula(this.left, this.right);
    }

    protected calculateUnary(operator: string, formula: UnaryFormula) {
        if (!this.right) {
            throw new Error(`Right operand is missing for ${operator} operator`);
        }
        return formula(this.right);
    }

    protected stringify(operator: string) {
        const leftRepresentation = this.left ? `${this.left.toString()}.` : "";
        const rightRepresentation = this.right ? `.${this.right.toString()}` : "";

        return `${leftRepresentation}${operator.toLowerCase()}()${rightRepresentation}`;
    }
}

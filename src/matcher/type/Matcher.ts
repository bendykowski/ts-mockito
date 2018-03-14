import {AndOperator} from "../operator/AndOperator";
import {OrOperator} from "../operator/OrOperator";

export class Matcher {
    public and(): AndOperator {
        const module = require("../operator/AndOperator");
        return new module.AndOperator(this);
    }

    public or(): OrOperator {
        const module = require("../operator/OrOperator");
        return new module.OrOperator(this);
    }

    public isMatching(value: any): boolean {
        return false;
    }

    public toString(): string {
        return "";
    }
}

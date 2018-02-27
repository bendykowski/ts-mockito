import {Matcher} from "../../../src/matcher/type/Matcher";
import {anything, notNull} from "../../../src/ts-mockito";

describe("And operator", () => {
    it("should return true if both matchers are true", () => {
        const obj: Matcher = notNull().and().anyString();

        expect(obj.isMatching("abc")).toBeTruthy();
    });

    it("should return false if the first matcher is false", () => {
        const obj: Matcher = notNull().and().anyString();

        expect(obj.isMatching(null)).toBeFalsy();
    });

    it("should return false if the second matcher is false", () => {
        const obj: Matcher = notNull().and().anyString();

        expect(obj.isMatching(123)).toBeFalsy();
    });

    it("should allow to be chained more than once", () => {
        const obj: Matcher = anything().and().notNull().and().anyString();

        expect(obj.isMatching(undefined)).toBeFalsy();
        expect(obj.isMatching(null)).toBeFalsy();
        expect(obj.isMatching(123)).toBeFalsy();
        expect(obj.isMatching("abc")).toBeTruthy();
    });

    it("should allow to be used with a not() operator", () => {
        const obj: Matcher = notNull().and().not().anyString();

        expect(obj.isMatching(undefined)).toBeTruthy();
        expect(obj.isMatching(null)).toBeFalsy();
        expect(obj.isMatching("abc")).toBeFalsy();
        expect(obj.isMatching(123)).toBeTruthy();
    });

    it("should allow to be chained with a not() operator", () => {
        const obj: Matcher = anything().and().not().anyString().and().anyNumber();

        expect(obj.isMatching(undefined)).toBeFalsy();
        expect(obj.isMatching(null)).toBeFalsy();
        expect(obj.isMatching("abc")).toBeFalsy();
        expect(obj.isMatching(123)).toBeTruthy();
    });

    it("should allow to be chained with a not() operator", () => {
        const obj: Matcher = anything().and().notNull().and().not().anyString();

        expect(obj.isMatching(undefined)).toBeTruthy();
        expect(obj.isMatching(null)).toBeFalsy();
        expect(obj.isMatching("abc")).toBeFalsy();
        expect(obj.isMatching(123)).toBeTruthy();
    });

    it("should allow to be chained with a not() operator", () => {
        const obj: Matcher = anything().and().not().anyString().and().not().anyNumber();

        expect(obj.isMatching(undefined)).toBeTruthy();
        expect(obj.isMatching(null)).toBeTruthy();
        expect(obj.isMatching("abc")).toBeFalsy();
        expect(obj.isMatching(123)).toBeFalsy();
        expect(obj.isMatching([])).toBeTruthy();
    });

    it("should throw an error if there is no right operand", () => {
        const obj: Matcher = notNull().and();

        expect(() => obj.isMatching(123)).toThrowError("Right operand is missing for AND operator");
    });

    it("should throw an error if a right operand is single `not` operator", () => {
        const obj: Matcher = notNull().and().not();

        expect(() => obj.isMatching(123)).toThrowError("Right operand is missing for NOT operator");
    });

    it("should throw an error for chaining operators without matchers", () => {
        expect(() => notNull().and().and()).toThrowError("Incorrect right operand for AND operator");
        expect(() => notNull().and().or()).toThrowError("Incorrect right operand for AND operator");
    });
});

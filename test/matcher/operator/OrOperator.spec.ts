import {Matcher} from "../../../src/matcher/type/Matcher";
import {anyNumber, anything, isNull, notNull} from "../../../src/ts-mockito";

describe("Or operator", () => {
    it("should return true if both matchers are true", () => {
        const obj: Matcher = anything().or().anyString();

        expect(obj.isMatching("abc")).toBeTruthy();
    });

    it("should return true if the first matcher is true", () => {
        const obj: Matcher = anyNumber().or().anyString();

        expect(obj.isMatching(123)).toBeTruthy();
    });

    it("should return true if the second matcher is true", () => {
        const obj: Matcher = anyNumber().or().anyString();

        expect(obj.isMatching("abc")).toBeTruthy();
    });

    it("should return false if both matchers are false", () => {
        const obj: Matcher = anyNumber().or().anyString();

        expect(obj.isMatching(undefined)).toBeFalsy();
    });

    it("should allow to be chained more than once", () => {
        const obj: Matcher = isNull().or().anyNumber().or().anyString();

        expect(obj.isMatching(undefined)).toBeFalsy();
        expect(obj.isMatching(null)).toBeTruthy();
        expect(obj.isMatching(123)).toBeTruthy();
        expect(obj.isMatching("abc")).toBeTruthy();
    });

    it("should allow to be used with a not() operator", () => {
        const obj: Matcher = isNull().or().not().anyString();

        expect(obj.isMatching(undefined)).toBeTruthy();
        expect(obj.isMatching(null)).toBeTruthy();
        expect(obj.isMatching("abc")).toBeFalsy();
        expect(obj.isMatching(123)).toBeTruthy();
    });

    it("should allow to be chained with a not() operator", () => {
        const obj: Matcher = isNull().or().not().anyString().or().match("abc");

        expect(obj.isMatching(undefined)).toBeTruthy();
        expect(obj.isMatching(null)).toBeTruthy();
        expect(obj.isMatching("cba")).toBeFalsy();
        expect(obj.isMatching("abc")).toBeTruthy();
        expect(obj.isMatching(123)).toBeTruthy();
    });

    it("should allow to be chained with a not() operator (2)", () => {
        const obj: Matcher = isNull().or().anyNumber().or().not().anyString();

        expect(obj.isMatching(undefined)).toBeTruthy();
        expect(obj.isMatching(null)).toBeTruthy();
        expect(obj.isMatching("abc")).toBeFalsy();
        expect(obj.isMatching(123)).toBeTruthy();
        expect(obj.isMatching([])).toBeTruthy();
    });

    it("should allow to be chained with a not() operator (3)", () => {
        const obj: Matcher = isNull().or().not().between(1, 10).or().not().between(4, 6);

        expect(obj.isMatching(undefined)).toBeTruthy();
        expect(obj.isMatching(null)).toBeTruthy();
        expect(obj.isMatching("abc")).toBeTruthy();
        expect(obj.isMatching(123)).toBeTruthy();
        expect(obj.isMatching(2)).toBeTruthy();
        expect(obj.isMatching(5)).toBeFalsy();
    });

    it("should throw an error if there is no right operand", () => {
        const obj: Matcher = isNull().or();

        expect(() => obj.isMatching(123)).toThrowError("Right operand is missing for OR operator");
    });

    it("should throw an error if a right operand is single not operator", () => {
        const obj: Matcher = isNull().or().not();

        expect(() => obj.isMatching(123)).toThrowError("Right operand is missing for NOT operator");
    });

    it("should throw an error for chaining operators without matchers", () => {
        expect(() => notNull().or().or()).toThrowError("Incorrect right operand for OR operator");
        expect(() => notNull().or().and()).toThrowError("Incorrect right operand for OR operator");
    });
});

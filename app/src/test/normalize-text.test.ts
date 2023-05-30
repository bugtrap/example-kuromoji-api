import { normalizeText } from "../normalize-text";

describe("空白処理", () => {
    it("空文字列対応", () => {
        const result = normalizeText("");
        expect(result).toBe("");
    });

    it("改行変換", () => {
        const result = normalizeText("this \n is\u3000\r\n \t simple");
        expect(result).toBe("this is simple");
    });
});

describe("変換", () => {
    it("半角化できること", () => {
        const result = normalizeText("サンプルＡＢＣ、ａｂｃ");
        expect(result).toBe("サンプルABC、abc");
    });
});

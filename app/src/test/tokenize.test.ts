import { tokenize } from "../tokenize";

describe("解析", () => {
    it("簡単な動作テスト", async () => {
        const text = "テストです。";
        const words = await tokenize(text);

        expect(words).toMatchSnapshot();
    });
});

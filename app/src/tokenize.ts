import { KuromojiToken, getTokenizer } from "kuromojin";

export async function tokenize(text: string): Promise<KuromojiToken[]> {
    const tokenizer = await getTokenizer();
    return tokenizer.tokenize(text);
}

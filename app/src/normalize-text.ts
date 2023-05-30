/**
 * 形態素解析に適した文字列へ変換します
 */
export function normalizeText(text: string): string {
    // 改行を含む連続した空白文字は 1 個の空白に置き換える
    const s1 = text.replace(/\s+/g, " ");
    // 英数字を半角に統一
    const s2 = s1.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    );
    return s2;
}

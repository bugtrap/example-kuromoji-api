"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(src_exports);

// src/normalize-text.ts
function normalizeText(text) {
  const s1 = text.replace(/\s+/g, " ");
  const s2 = s1.replace(
    /[Ａ-Ｚａ-ｚ０-９]/g,
    (s) => String.fromCharCode(s.charCodeAt(0) - 65248)
  );
  return s2;
}

// src/tokenize.ts
var import_kuromojin = require("kuromojin");
async function tokenize(text) {
  const tokenizer = await (0, import_kuromojin.getTokenizer)();
  return tokenizer.tokenize(text);
}

// src/types.ts
function isRequestPayload(payload) {
  if (payload && typeof payload === "object" && typeof payload.text === "string") {
    return true;
  }
  return false;
}

// src/index.ts
async function handler(event) {
  try {
    const payload = JSON.parse(event.body ?? "{}");
    if (!isRequestPayload(payload)) {
      throw new Error("Invalid text");
    }
    const text = normalizeText(payload.text);
    const words = await tokenize(text);
    const origin = event.headers.origin;
    const corsHeaders = origin ? {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "Content-Type,X-Api-Key",
      "Access-Control-Allow-Methods": "POST"
    } : void 0;
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      },
      body: JSON.stringify({
        text,
        words
      })
    };
  } catch (ex) {
    console.error(ex);
    return Promise.reject(ex);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=index.js.map

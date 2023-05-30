import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { normalizeText } from "./normalize-text";
import { tokenize } from "./tokenize";
import { isRequestPayload } from "./types";

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    try {
        const payload = JSON.parse(event.body ?? "{}");
        if (!isRequestPayload(payload)) {
            throw new Error("Invalid text");
        }

        const text = normalizeText(payload.text);
        const words = await tokenize(text);

        const origin = event.headers.origin;
        const corsHeaders = origin
            ? {
                  "Access-Control-Allow-Origin": origin,
                  "Access-Control-Allow-Headers": "Content-Type,X-Api-Key",
                  "Access-Control-Allow-Methods": "POST",
              }
            : undefined;

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
            },
            body: JSON.stringify({
                text,
                words,
            }),
        };
    } catch (ex: unknown) {
        console.error(ex);
        return Promise.reject(ex);
    }
}

export type RequestPayload = {
    text: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isRequestPayload(payload: any): payload is RequestPayload {
    if (payload && typeof payload === "object" && typeof payload.text === "string") {
        return true;
    }
    return false;
}

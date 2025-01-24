export interface Response {
    candidates: Candidate[];
    usageMetadata: UsageMetadata;
    modelVersion: string;
}

export interface Candidate {
    content: Content;
    finishReason: string;
}

export interface Content {
    parts: Part[];
    role: string;
}

export interface Part {
    text: string;
}

export interface UsageMetadata {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
}

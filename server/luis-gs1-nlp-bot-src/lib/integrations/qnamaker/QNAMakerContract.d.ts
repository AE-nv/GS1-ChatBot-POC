export interface QNAMakerAnswer {
    questions: string[];
    answer: string;
    score: number;
    id: number;
    source: string;
    metadata: string[];
    context: {};
}
export interface QNAMakerResponse {
    answers: QNAMakerAnswer[];
    debugInfo: string;
}

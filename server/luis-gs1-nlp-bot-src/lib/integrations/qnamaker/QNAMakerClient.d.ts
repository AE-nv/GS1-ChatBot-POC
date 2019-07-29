import { QNAMakerResponse } from './QNAMakerContract';
export default class QNAMAkerClient {
    private endPointKey;
    private baseURL;
    constructor(endPointKey: string, appId: string, host: string);
    getAnswerForQuestion(question: string): Promise<QNAMakerResponse | undefined>;
}

import axios, { AxiosResponse } from 'axios';

import { QNAMakerResponse } from './QNAMakerContract';

export default class QNAMAkerClient {
    private baseURL: string;
    constructor(private endPointKey: string, appId: string, host: string) {
        this.baseURL = `${host}/qnamaker/knowledgebases/${appId}`;
    }

    public async getAnswerForQuestion(
        question: string,
    ): Promise<QNAMakerResponse | undefined> {
        const response: AxiosResponse<QNAMakerResponse> = await axios.post<
            QNAMakerResponse
        >(
            `${this.baseURL}/generateAnswer`,
            {
                question,
            },
            {
                headers: {
                    Authorization: `EndpointKey ${this.endPointKey}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        if (response && response.data) {
            return response.data;
        }
    }
}

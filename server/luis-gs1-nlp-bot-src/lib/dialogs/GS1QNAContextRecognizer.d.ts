import { TurnContext } from 'botbuilder';
export declare class GS1QNAContextRecognizer {
    private recognizer;
    constructor(config: any);
    readonly isConfigured: boolean;
    /**
     * Returns an object with preformatted LUIS results for the bot's dialogs to consume.
     * @param {TurnContext} context
     */
    executeLuisQuery(context: TurnContext): Promise<import("botbuilder").RecognizerResult>;
}

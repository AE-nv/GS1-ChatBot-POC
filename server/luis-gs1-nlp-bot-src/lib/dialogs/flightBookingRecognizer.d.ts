import { LuisRecognizer } from 'botbuilder-ai';
export declare class FlightBookingRecognizer {
    recognizer: LuisRecognizer;
    constructor(config: any);
    readonly isConfigured: boolean;
    /**
     * Returns an object with preformatted LUIS results for the bot's dialogs to consume.
     * @param {TurnContext} context
     */
    executeLuisQuery(context: any): Promise<import("botbuilder-core").RecognizerResult>;
    getFromEntities(result: any): {
        from: any;
        airport: any;
    };
    getToEntities(result: any): {
        to: any;
        airport: any;
    };
    /**
     * This value will be a TIMEX. And we are only interested in a Date so grab the first result and drop the Time part.
     * TIMEX is a format that represents DateTime expressions that include some ambiguity. e.g. missing a Year.
     */
    getTravelDate(result: any): any;
}

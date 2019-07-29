import { TurnContext } from 'botbuilder';
import { LuisRecognizer } from 'botbuilder-ai';

export class GS1QNAContextRecognizer {
    private recognizer : LuisRecognizer;
    constructor(config) {
        const luisIsConfigured = config && config.applicationId && config.endpointKey && config.endpoint;
        if (luisIsConfigured) {
            this.recognizer = new LuisRecognizer(config, {}, true);
        }
    }

    get isConfigured() {
        return (this.recognizer !== undefined);
    }

    /**
     * Returns an object with preformatted LUIS results for the bot's dialogs to consume.
     * @param {TurnContext} context
     */
    async executeLuisQuery(context: TurnContext) {
        return await this.recognizer.recognize(context);
    }
}
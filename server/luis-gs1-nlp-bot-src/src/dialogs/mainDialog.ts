// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardFactory, InputHints, MessageFactory } from 'botbuilder';
import {
    ComponentDialog,
    DialogSet,
    DialogTurnStatus,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext,
} from 'botbuilder-dialogs';

import { GS1QNAContextRecognizer } from './GS1QNAContextRecognizer';
import strings from './strings';

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
const TEXT_PROMPT = 'TextPrompt';
const QNA_DIALOG = 'qnaDialog';
export class MainDialog extends ComponentDialog {
    constructor(private mainLuisRecognizer,private qnaLuisRecognizer: GS1QNAContextRecognizer, private qnaDialog) {
        super('MainDialog');

        if (!mainLuisRecognizer) throw new Error('[MainDialog]: Missing parameter \'luisRecognizer\' is required');

        if (!qnaDialog) throw new Error('[MainDialog]: Missing parameter \'bookingDialog\' is required');

        // Define the main dialog and its related components.
        // This is a sample "book a flight" dialog.
        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(qnaDialog)
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.introStep.bind(this),
                this.chooseBarcodeOrFAQStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    public async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    private async introStep(stepContext) {
        let messageText:string = '';
        if (!this.mainLuisRecognizer.isConfigured) {
            messageText = 'NOTE: LUIS is not configured. To enable all capabilities, add `LuisAppId`, `LuisAPIKey` and `LuisAPIHostName` to the .env file.';
            await stepContext.context.sendActivity(messageText, null, InputHints.IgnoringInput);
            return await stepContext.next();
        }

        messageText = stepContext.options.restartMsg ? stepContext.options.restartMsg : `${strings.main.welcome.introduction}`;
        const introActions = CardFactory.actions([strings.main.welcome.possibilities.create_barcode, strings.main.welcome.possibilities.ask_question]);
        return await stepContext.prompt(TEXT_PROMPT, MessageFactory
            .suggestedActions(introActions, messageText));
    }

    private async chooseBarcodeOrFAQStep(stepContext: WaterfallStepContext) {
        const answerOfUser = stepContext.context.activity.text;
        switch (answerOfUser) {
            case strings.main.welcome.possibilities.ask_question: return await stepContext.beginDialog(QNA_DIALOG);
            case strings.main.welcome.possibilities.create_barcode: 
                await stepContext.context.sendActivity('todo', 'todo', InputHints.IgnoringInput); 
                return await stepContext.next();
        }
        // Call LUIS and gather any potential booking details. (Note the TurnContext has the response to the prompt)
        // const luisResult = await this.mainLuisRecognizer.executeLuisQuery(stepContext.context);
        // switch (LuisRecognizer.topIntent(luisResult)) {
        // case 'CreateBarCode':
        //     // Run the BookingDialog passing in whatever details we have from the LUIS call, it will fill out the remainder.
        //     return await stepContext.context.sendActivity('todo', 'todo', InputHints.IgnoringInput);
        //     // return await stepContext.beginDialog('bookingDialog', bookingDetails);
        // case 'AskQuestion':
        //     return await stepContext.beginDialog('qnaDialog');
        // case 'GetWeather':
        //     // We haven't implemented the GetWeatherDialog so we just display a TODO message.
        //     const getWeatherMessageText = 'TODO: get weather flow here';
        //     await stepContext.context.sendActivity(getWeatherMessageText, getWeatherMessageText, InputHints.IgnoringInput);
        //     break;

        // default:
        //     // Catch all for unhandled intents
        //     const didntUnderstandMessageText = `Sorry, I didn't get that. Please try asking in a different way (intent was ${ LuisRecognizer.topIntent(luisResult) })`;
        //     await stepContext.context.sendActivity(didntUnderstandMessageText, didntUnderstandMessageText, InputHints.IgnoringInput);
        // }

        return await stepContext.next();
    }


    /**
     * This is the final step in the main waterfall dialog.
     * It wraps up the sample "book a flight" interaction with a simple confirmation.
     */
    private async finalStep(stepContext) {
        // If the child dialog ("bookingDialog") was cancelled or the user failed to confirm, the Result here will be null.
        // Restart the main dialog with a different message the second time around
        return await stepContext.replaceDialog(this.initialDialogId, { restartMsg: strings.main.what_else });
    }
}

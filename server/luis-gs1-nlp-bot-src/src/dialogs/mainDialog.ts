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
import { NeedGtinDialog } from './gtinDialogs/needGtinDialog';
import strings from './strings';
import { UserDetails } from './userDetails';

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
const TEXT_PROMPT = 'TextPrompt';
const QNA_DIALOG = 'qnaDialog';
const NEED_GTIN_DIALOG='needGtinDialog';
export class MainDialog extends ComponentDialog {
    private userDetails: UserDetails
    constructor(private mainLuisRecognizer,private qnaLuisRecognizer: GS1QNAContextRecognizer, qnaDialog) {
        super('MainDialog');

        if (!mainLuisRecognizer) throw new Error('[MainDialog]: Missing parameter \'luisRecognizer\' is required');

        if (!qnaDialog) throw new Error('[MainDialog]: Missing parameter \'bookingDialog\' is required');

        // Define the main dialog and its related components.
        // This is a sample "book a flight" dialog.
        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(qnaDialog)
            .addDialog(new NeedGtinDialog(NEED_GTIN_DIALOG))
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.introStep.bind(this),
                this.newUserStep.bind(this),
                this.setUserDetailsStep.bind(this),
                this.poseHelpPossibilities.bind(this),
                this.possibilityPickedStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
        this.userDetails = {};
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
        messageText = stepContext.options.isRestart ? stepContext.options.restartMsg : `${strings.main.welcome.introduction}`;
        if(!stepContext.options.isRestart){
            await stepContext.context.sendActivity(messageText)
        }
        return await stepContext.next();

        // messageText = stepContext.options.restartMsg ? stepContext.options.restartMsg : `${strings.main.welcome.introduction}`;
        // const introActions = CardFactory.actions([strings.main.welcome.possibilities.create_barcode, strings.main.welcome.possibilities.ask_question]);
        // return await stepContext.prompt(TEXT_PROMPT, MessageFactory
        //     .suggestedActions(introActions, messageText));
    }

    private async newUserStep(stepContext: WaterfallStepContext){
        if(this.userDetails.newUser){
            return await stepContext.next();
        }
        const introActions = CardFactory.actions([strings.general.yes, strings.general.no]);
        return await stepContext.prompt(TEXT_PROMPT, MessageFactory
            .suggestedActions(introActions, strings.main.new_user));
    }

    private async setUserDetailsStep(stepContext:WaterfallStepContext){
        const answerOfUser = stepContext.context.activity.text;
        switch (answerOfUser) {
            case strings.general.yes: this.userDetails.newUser = true; break;
            case strings.general.no: this.userDetails.newUser = false; break;
        }
        return await stepContext.next();
    }

    private async poseHelpPossibilities(stepContext: WaterfallStepContext){
        const introActions = CardFactory.actions([
            strings.main.help.possibilities.need_lei, 
            strings.main.help.possibilities.need_gtin, 
            strings.main.help.possibilities.general_question]);
        return await stepContext.prompt(TEXT_PROMPT, MessageFactory
            .suggestedActions(introActions, strings.main.help.what_can_i_do));
    }

    private async possibilityPickedStep(stepContext: WaterfallStepContext){
        const answerOfUser = stepContext.context.activity.text;
        switch (answerOfUser){
            case strings.main.help.possibilities.general_question: console.log('step into qnaDialog'); return await stepContext.beginDialog(QNA_DIALOG);
            case strings.main.help.possibilities.need_gtin: console.log('step into needGtinDialog'); return await stepContext.beginDialog(NEED_GTIN_DIALOG, this.userDetails);
            default: 
                await stepContext.context.sendActivity('todo', 'todo', InputHints.IgnoringInput);
                return await stepContext.next();
        }
    }

    // private async chooseBarcodeOrFAQStep(stepContext: WaterfallStepContext) {
 

    //     switch (answerOfUser) {
    //         case strings.main.welcome.possibilities.ask_question: return await stepContext.beginDialog(QNA_DIALOG);
    //         case strings.main.welcome.possibilities.create_barcode: return await stepContext.beginDialog(CREATE_BARCODE)
    //     }
    //     Call LUIS and gather any potential booking details. (Note the TurnContext has the response to the prompt)
    //     const luisResult = await this.mainLuisRecognizer.executeLuisQuery(stepContext.context);
    //     switch (LuisRecognizer.topIntent(luisResult)) {
    //     case 'CreateBarCode':
    //         // Run the BookingDialog passing in whatever details we have from the LUIS call, it will fill out the remainder.
    //         return await stepContext.context.sendActivity('todo', 'todo', InputHints.IgnoringInput);
    //         // return await stepContext.beginDialog('bookingDialog', bookingDetails);
    //     case 'AskQuestion':
    //         return await stepContext.beginDialog('qnaDialog');
    //     case 'GetWeather':
    //         // We haven't implemented the GetWeatherDialog so we just display a TODO message.
    //         const getWeatherMessageText = 'TODO: get weather flow here';
    //         await stepContext.context.sendActivity(getWeatherMessageText, getWeatherMessageText, InputHints.IgnoringInput);
    //         break;

    //     default:
    //         // Catch all for unhandled intents
    //         const didntUnderstandMessageText = `Sorry, I didn't get that. Please try asking in a different way (intent was ${ LuisRecognizer.topIntent(luisResult) })`;
    //         await stepContext.context.sendActivity(didntUnderstandMessageText, didntUnderstandMessageText, InputHints.IgnoringInput);
    //     }

    //     return await stepContext.next();
    // }


    private async finalStep(stepContext) {
        return await stepContext.replaceDialog(this.initialDialogId, { isRestart:true });
    }
}

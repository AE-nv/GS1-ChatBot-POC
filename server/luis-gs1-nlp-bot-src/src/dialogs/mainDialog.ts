// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardFactory, InputHints, MessageFactory, StatePropertyAccessor, TurnContext } from 'botbuilder';
import {
    ComponentDialog,
    DialogSet,
    DialogState,
    DialogTurnStatus,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext,
} from 'botbuilder-dialogs';

import { ConsoleLogTelemetryClient } from '../util/ConsoleBotTelemetryClient';
import { getTextPrompt } from '../util/PromptFactory';
import { NeedGtinDialog } from './gtinDialogs/needGtinDialog';
import { QNADialog } from './qnaDialog';
import strings from './strings';
import { GS1DialogState } from './userDetails';

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
const TEXT_PROMPT = 'TextPrompt';
const QNA_DIALOG = 'qnaDialog';
const NEED_GTIN_DIALOG='needGtinDialog';

export class MainDialog extends ComponentDialog {
    private accessor: StatePropertyAccessor<GS1DialogState> = null;
    
    constructor() {
        super('MainDialog');

        // Define the main dialog and its related components.
        // This is a sample "book a flight" dialog.
        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new QNADialog(QNA_DIALOG))
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
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    public async run(turnContext:TurnContext, accessor: StatePropertyAccessor<DialogState>) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);
        this.accessor = accessor;
        const dialogContext = await dialogSet.createContext(turnContext);
        dialogContext.dialogs.telemetryClient = new ConsoleLogTelemetryClient();
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    private async introStep(stepContext: WaterfallStepContext<{isRestart:boolean, restartMsg:string}>) {
        let messageText:string = '';
       
        messageText = stepContext.options.isRestart ? stepContext.options.restartMsg : `${strings.main.welcome.introduction}`;
        if(!stepContext.options.isRestart){
            await stepContext.context.sendActivity(messageText)
        }
        return await stepContext.next();
    }

    private async newUserStep(stepContext: WaterfallStepContext){
        const userDetails: GS1DialogState = await this.accessor.get(stepContext.context);
        if(userDetails.newUser !== undefined){
            return await stepContext.next();
        }
        const introActions = CardFactory.actions([strings.general.yes, strings.general.no]);
        return await stepContext.prompt(TEXT_PROMPT, MessageFactory
            .suggestedActions(introActions, strings.main.new_user));
    }

    private async setUserDetailsStep(stepContext:WaterfallStepContext){
        const answerOfUser = stepContext.result;
        const userDetails: GS1DialogState = await this.accessor.get(stepContext.context);
        if(answerOfUser === strings.general.yes){
            userDetails.newUser = true;
        }else{
            userDetails.newUser = false;
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
        const answerOfUser = stepContext.result;
        switch (answerOfUser){
            case strings.main.help.possibilities.general_question: 
                return await stepContext.beginDialog(QNA_DIALOG, { accessor: this.accessor });
            case strings.main.help.possibilities.need_gtin: 
                return await stepContext.beginDialog(NEED_GTIN_DIALOG, { accessor: this.accessor });
            case strings.main.help.possibilities.need_lei:
                await getTextPrompt(stepContext, TEXT_PROMPT, strings.main.lei);
                return await stepContext.next();
            default: 
                await stepContext.context.sendActivity('todo', 'todo', InputHints.IgnoringInput);
                return await stepContext.next();
        }
    }

    private async finalStep(stepContext) {
        return await stepContext.replaceDialog(this.initialDialogId, { isRestart:true, restartMsg: strings.main.what_else});
    }


}

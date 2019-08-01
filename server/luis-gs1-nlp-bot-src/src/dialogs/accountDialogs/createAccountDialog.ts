import { CardFactory, MessageFactory } from 'botbuilder';
import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';

const TEXT_PROMPT='createAccountPrompt';
const WATERFALL_DIALOG='createAccountWaterfall';
export class CreateAccountDialog extends CancelAndHelpDialog{

    constructor(id){
        super(id || 'createAccountDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
        .addDialog(new WaterfallDialog(WATERFALL_DIALOG, 
            [
                this.referToAccountCreationPageStep.bind(this),
                this.accountCreatedStep.bind(this),
            ]));
        this.initialDialogId = WATERFALL_DIALOG;
    }

    private async referToAccountCreationPageStep(stepContext:WaterfallStepContext){
        const introActions = CardFactory.actions([strings.account.i_got_account]);
        return await stepContext.prompt(
            TEXT_PROMPT,
            MessageFactory.suggestedActions(introActions, strings.account.see_account_creation_page));
    }

    private async accountCreatedStep(stepContext:WaterfallStepContext){
        return await stepContext.endDialog();
    }
}
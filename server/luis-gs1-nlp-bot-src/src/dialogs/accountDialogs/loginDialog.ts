import { CardFactory, MessageFactory } from 'botbuilder';
import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';

const TEXT_PROMPT= 'loginTextPrompt';
const WATERFALL_DIALOG = 'loginWaterfallDialog';

export class LoginDialog extends CancelAndHelpDialog {
    constructor(id){
        super (id || 'loginDialog');
        this
            .addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.askIfWantToLoginStep.bind(this),
                this.processAnswerStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    private async askIfWantToLoginStep(stepContext:WaterfallStepContext){
        const introActions = CardFactory.actions([strings.account.i_logged_in]);
        return await stepContext.prompt(
            TEXT_PROMPT,
            MessageFactory.suggestedActions(introActions, strings.account.not_logged_in_yet));
    }

    private async processAnswerStep(stepContext:WaterfallStepContext){
        const answerOfUser = stepContext.result; 
        switch (answerOfUser) {
            case strings.general.yes:
                // stepContext.options.loggedIn = true;
                await stepContext.context.sendActivity(strings.account.now_logged_in);
                break;
            case strings.general.no:
                await stepContext.context.sendActivity('TODO: Flow bij niet willen inloggen');
                break;
        }
        return await stepContext.endDialog(stepContext.options );
    }
}
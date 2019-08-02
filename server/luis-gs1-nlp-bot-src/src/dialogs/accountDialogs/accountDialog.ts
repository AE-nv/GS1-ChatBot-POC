import { CardFactory, MessageFactory } from 'botbuilder';
import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';
import { CreateAccountDialog } from './createAccountDialog';
import { LoginDialog } from './loginDialog';

const TEXT_PROMPT = 'accountTextPrompt';
const WATERFALL_DIALOG = 'accountWaterfallDialog';
const LOGIN_DIALOG = 'accountLoginDialog';
const CREATE_ACCOUNT_DIALOG = 'createAccountDialog';

export class AccountDialog extends CancelAndHelpDialog {
    constructor(id){
        super(id || 'accountDialog');
        this
        .addDialog(new TextPrompt(TEXT_PROMPT))
        .addDialog(new LoginDialog(LOGIN_DIALOG))
        .addDialog(new CreateAccountDialog(CREATE_ACCOUNT_DIALOG))
        .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.askLoginOrCreateStep.bind(this),
            this.loginOrCreateStep.bind(this)
        ]))

        this.initialDialogId = WATERFALL_DIALOG;
    }

    private async askLoginOrCreateStep(stepContext:WaterfallStepContext){
        //TODO
        if(!!this.userDetails.newUser) {
            console.log('accountDialog: asked login or create')
            // THE USER IS A NEW USER --> CREATE ACCOUNT YES OR NO, or LOGIN IF MISTAKE
            const introActions = CardFactory.actions([strings.account.create_account, strings.account.log_me_in]);
            return await stepContext.prompt(
                TEXT_PROMPT, 
                MessageFactory.suggestedActions(introActions, strings.account.saw_new_user_create_account));
        }else{
            console.log('accountDialog: existing user ask login')
            // THE USER IS AN EXISTING USER --> start login dialog
            return await stepContext.beginDialog(LOGIN_DIALOG, this.accessor);
        }
    }

    private async loginOrCreateStep(stepContext:WaterfallStepContext){
        const answerOfUser = stepContext.result;
        console.log(`accountDialog: login or create step: ${answerOfUser}`);
        switch(answerOfUser){
            case strings.account.log_me_in: 
                return await stepContext.beginDialog(LOGIN_DIALOG, this.accessor);
            case strings.account.create_account:
                return await stepContext.beginDialog(CREATE_ACCOUNT_DIALOG, this.accessor);
        }
        return await stepContext.endDialog(stepContext.options);
    }
}
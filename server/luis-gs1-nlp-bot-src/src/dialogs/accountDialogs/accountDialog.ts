import { CardFactory, MessageFactory } from 'botbuilder';
import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';
import { UserDetails } from '../userDetails';
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
        console.log(stepContext.options);
        if((stepContext.options as UserDetails).newUser === true) {
            console.log('accountDialog: asked login or create')
            // THE USER IS A NEW USER --> CREATE ACCOUNT YES OR NO, or LOGIN IF MISTAKE
            const introActions = CardFactory.actions([strings.account.create_account, strings.account.log_me_in]);
            return await stepContext.prompt(
                TEXT_PROMPT, 
                MessageFactory.suggestedActions(introActions, strings.account.saw_new_user_create_account));
        }else{
            console.log('accountDialog: existing user ask login')
            // THE USER IS AN EXISTING USER --> start login dialog
            return await stepContext.beginDialog(LOGIN_DIALOG, (stepContext.options as UserDetails));
        }
    }

    private async loginOrCreateStep(stepContext:WaterfallStepContext){
        const answerOfUser = stepContext.result;
        console.log(`accountDialog: login or create step: ${answerOfUser}`);
        switch(answerOfUser){
            case strings.account.log_me_in: 
                return await stepContext.beginDialog(LOGIN_DIALOG, (stepContext.options as UserDetails));
            case strings.account.create_account:
                return await stepContext.beginDialog(CREATE_ACCOUNT_DIALOG, (stepContext.options as UserDetails));
        }
        console.log((stepContext.options as UserDetails));
        return await stepContext.endDialog((stepContext.options as UserDetails));
    }
}
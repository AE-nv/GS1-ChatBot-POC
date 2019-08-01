import { CardFactory, MessageFactory } from 'botbuilder';
import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { AccountDialog } from '../accountDialogs/accountDialog';
import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';
import { UserDetails } from '../userDetails';

const ACCOUNT_DIALOG: string = 'accountDialog';
const PREFIX_TEXT_PROMPT: string =  'gtinExistingPrefixTextPrompt';

export class NeedGtinDialog extends CancelAndHelpDialog {
    private readonly GTIN_WATERFALL_DIALOG = 'gtinWaterfallDialog';
    private userDetails:UserDetails;
    constructor(id){
        super(id || 'needGtinDialog');
        this
        .addDialog(new WaterfallDialog(this.GTIN_WATERFALL_DIALOG, [
            this.checkIfNewUserStep.bind(this),
            this.checkLoggedInStep.bind(this),
            this.checkValidPrefixStep.bind(this),
            this.addToExistingPrefixStep.bind(this),
        ]))
        .addDialog(new AccountDialog(ACCOUNT_DIALOG))
        .addDialog(new TextPrompt(PREFIX_TEXT_PROMPT));
        
        this.initialDialogId = this.GTIN_WATERFALL_DIALOG;
    }
    
    private async checkIfNewUserStep(stepContext:WaterfallStepContext){
        this.userDetails = stepContext.options;
        if (this.userDetails.newUser && this.userDetails.newUser === true){
            await stepContext.context.sendActivity(strings.main.new_user_documents);
        }
        return await stepContext.next();
    }

    private async checkLoggedInStep(stepContext: WaterfallStepContext){
        console.log('NeedGtinDialog: check Logged in step');
        if(this.userDetails && (!this.userDetails.loggedIn || !this.userDetails.loggedIn === false)) {
            console.log('NeedGtinDialog: step into accountDialog');
            return await stepContext.beginDialog(ACCOUNT_DIALOG, this.userDetails);
        }

        return await stepContext.next()

    }

    private async checkValidPrefixStep(stepContext:WaterfallStepContext){
        // HAS NO VALID PREFIX --> START HELP WITH PREFIX
        this.userDetails.validPrefixes = ['prefix 1', 'prefix2'];
        if (!this.userDetails.validPrefixes || this.userDetails.validPrefixes.length === 0) {
            await stepContext.context.sendActivity('TODO: Flow Hulp bij keuze prefix');
            return await stepContext.endDialog();
        } else {
            // HAS VALID PREFIX --> ASK TO ADD OR CREATE NEW
            const introActions = CardFactory.actions([strings.general.no, ...this.userDetails.validPrefixes ]);
            return await stepContext.prompt(PREFIX_TEXT_PROMPT, MessageFactory
                .suggestedActions(introActions, `${strings.gtin.add_to_existing}`));
        }
    }

    private async addToExistingPrefixStep(stepContext:WaterfallStepContext) {
        const answerOfUser = stepContext.result;
        console.log('addToExistingPrefix Step');
        // ADD TO EXISTING PREFIX?
        if(answerOfUser === strings.general.no){
            await stepContext.context.sendActivity('TODO: Flow Hulp bij keuze prefix');
        }else{
            await stepContext.context.sendActivity(strings.gtin.chose_to_add_to_prefix(answerOfUser));
        }
        return await stepContext.endDialog();
    }

}
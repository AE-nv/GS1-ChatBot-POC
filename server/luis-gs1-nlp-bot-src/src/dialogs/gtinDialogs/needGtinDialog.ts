import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { getChoicePrompt, getTextPrompt } from '../../util/PromptFactory';
import { AccountDialog } from '../accountDialogs/accountDialog';
import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';
import { GS1DialogState } from '../userDetails';
import { AddToExistingPrefixDialog } from './addToExistingDialog';
import { PrefixChoiceDialog } from './prefixChoiceDialog';

const ACCOUNT_DIALOG: string = 'accountDialog';
const PREFIX_TEXT_PROMPT: string =  'gtinExistingPrefixTextPrompt';
const PREFIX_CHOICE_DIALOG = 'gtinChoosePrefixDialog';
const ADD_TO_EXISTING_PREFIX_DIALOG = 'addToExistingPrefixDialog';

export class NeedGtinDialog extends CancelAndHelpDialog {
    private readonly GTIN_WATERFALL_DIALOG = 'gtinWaterfallDialog';

    constructor(id){
        super(id || 'needGtinDialog');
        // this.graphD = new GraphDialog(PREFIX_CHOICE_DIALOG);
        this
        .addDialog(new WaterfallDialog(this.GTIN_WATERFALL_DIALOG, [
            this.checkIfNewUserStep.bind(this),
            this.checkLoggedInStep.bind(this),
            this.checkValidPrefixStep.bind(this),
            this.processPrefixStep.bind(this),
            this.prefixDeterminesNrOfGtinsStep.bind(this),
            this.howMuchTradeUnitsStep.bind(this),
            this.processNrOfTradeUnitsStep.bind(this),
            this.processPrefixChoiceStep.bind(this),
            this.finalStep.bind(this)
        ]))
        .addDialog(new AddToExistingPrefixDialog(ADD_TO_EXISTING_PREFIX_DIALOG))
        .addDialog(new PrefixChoiceDialog(PREFIX_CHOICE_DIALOG))
        .addDialog(new AccountDialog(ACCOUNT_DIALOG))
        .addDialog(new TextPrompt(PREFIX_TEXT_PROMPT));

        // this.connectGraph();
        
        this.initialDialogId = this.GTIN_WATERFALL_DIALOG;
    }

    // private connectGraph(){
    //     this.revenueKnownDialog.setFalseDialog(this.giveRevenueDialog);
    //     this.revenueKnownDialog.setTrueDialog(this.revenueCorrectDialog);
    // }

    private async checkIfNewUserStep(stepContext:WaterfallStepContext){
        const userDetails: GS1DialogState = await this.getUserState(stepContext.context);
        if (userDetails.newUser && userDetails.newUser === true){
            await stepContext.context.sendActivity(strings.main.new_user_documents);
        }
        // await stepContext.context.sendActivity(strings.account.need_to_be_logged_in);
        return await stepContext.next();
    }

    private async checkLoggedInStep(stepContext: WaterfallStepContext){
        const userDetails: GS1DialogState = await this.getUserState(stepContext.context);

        if(userDetails && (!userDetails.loggedIn || userDetails.loggedIn !== true)) {
            return await stepContext.beginDialog(ACCOUNT_DIALOG, { accessor: this.accessor });
        }

        return await stepContext.next()

    }

    private async checkValidPrefixStep(stepContext:WaterfallStepContext){
        const userDetails: GS1DialogState = await this.getUserState(stepContext.context);
        if (!userDetails.validPrefixes || userDetails.validPrefixes.length === 0) {
            return await stepContext.beginDialog(PREFIX_CHOICE_DIALOG, { accessor: this.accessor });
        } else {
            // HAS VALID PREFIX --> ASK TO ADD OR CREATE NEW
            return await stepContext.beginDialog(ADD_TO_EXISTING_PREFIX_DIALOG, { accessor: this.accessor });
            // return await stepContext.cancelAllDialogs();
        }
    }

    private async processPrefixStep(stepContext:WaterfallStepContext) {
        // tslint:disable-next-line: no-string-literal
        const answerOfUser = stepContext.result;
        const userDetails = await this.getUserState(stepContext.context);
        // ADD TO EXISTING PREFIX?
        console.log(answerOfUser);
        if(answerOfUser === strings.general.no){
            return await stepContext.beginDialog(PREFIX_CHOICE_DIALOG, { accessor: this.accessor });
        }
        else if (userDetails.validPrefixes && userDetails.validPrefixes.find(prefix => prefix === answerOfUser)){
            return await stepContext.cancelAllDialogs();
        } else if (stepContext.result && stepContext.result.meta === 'userChoseSpecialOffer') {
            return await stepContext.cancelAllDialogs();
        }
        return await stepContext.next();
    }

    private async prefixDeterminesNrOfGtinsStep(stepContext: WaterfallStepContext) {
        await getTextPrompt(stepContext,PREFIX_TEXT_PROMPT,strings.gtin.prefix_determines_gtins);
        return await stepContext.next();
    }

    private async howMuchTradeUnitsStep(stepContext:WaterfallStepContext){
        return await getTextPrompt(stepContext,PREFIX_TEXT_PROMPT, strings.gtin.how_many_trade_units)
    }

    private async processNrOfTradeUnitsStep(stepContext:WaterfallStepContext){
        return await getChoicePrompt(stepContext,PREFIX_TEXT_PROMPT,strings.gtin.recommend_these_prefixes,['Prefix 12','Prefix 13']);
    }

    private async processPrefixChoiceStep(stepContext:WaterfallStepContext){
        const answerOfUser = stepContext.result;
        console.log(answerOfUser);
        await getTextPrompt(stepContext,PREFIX_TEXT_PROMPT,strings.gtin.u_chose_prefix_x(answerOfUser));
        return await stepContext.next();
    }

    private async finalStep(stepContext:WaterfallStepContext){
        return await stepContext.endDialog();
    }
}
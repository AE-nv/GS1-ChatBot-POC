import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { getChoicePrompt, getTextPrompt } from '../../util/PromptFactory';
import { AccountDialog } from '../accountDialogs/accountDialog';
import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import { GraphDialog } from '../GraphDialog';
import strings from '../strings';
import { userDetails } from '../userDetails';
import { AddToExistingPrefixDialog } from './addToExistingDialog';
import { PrefixChoiceDialog } from './prefixChoiceDialog';

const ACCOUNT_DIALOG: string = 'accountDialog';
const PREFIX_TEXT_PROMPT: string =  'gtinExistingPrefixTextPrompt';
const PREFIX_CHOICE_DIALOG = 'gtinChoosePrefixDialog';
const ADD_TO_EXISTING_PREFIX_DIALOG = 'addToExistingPrefixDialog';

export class NeedGtinDialog extends CancelAndHelpDialog {
    private readonly GTIN_WATERFALL_DIALOG = 'gtinWaterfallDialog';
    private graphD: GraphDialog;

    // private revenueKnownDialog: ConditionalDialogGraphNode = new ConditionalDialogGraphNode(
    //     (stepContext: WaterfallStepContext) => stepContext.next(),'revenueKnown')
    //     .setCondition((() => this.userDetails && this.userDetails.revenue).bind(this))
    //     // .setFalseDialog(this.giveRevenueDialog)
    //     // .setTrueDialog(this.revenueCorrectDialog)

    // private setRevenueDialog: DialogGraphNode =
    //     new AnswerDialogGraphNode(
    //         (stepContext: WaterfallStepContext) => {
    //             this.userDetails.revenue = stepContext.context.activity.text;
    //             this.accessor.set(stepContext.context, this.userDetails);
    //             return stepContext.next();
    //         },'setRevenue').setDefault(this.revenueKnownDialog);

    // private giveRevenueDialog: DialogGraphNode =
    //     new AnswerDialogGraphNode(
    //         getChoiceStep(this.TEXT_PROMPT_ID,strings.gtin.give_revenue_please,[])
    //         // (stepContext: WaterfallStepContext) => getTextPrompt(stepContext, this.TEXT_PROMPT_ID, strings.gtin.give_revenue_please)
    //     ,'giveRevenue').setDefault(this.setRevenueDialog);

    // private revenueCorrectDialog: DialogGraphNode =
    //     new AnswerDialogGraphNode(
    //         (stepContext: WaterfallStepContext) => getChoicePrompt(stepContext, this.TEXT_PROMPT_ID, strings.gtin.is_revenue_correct(stepContext.context.activity.text), [strings.general.yes, strings.general.no])
    //     ,'revenueCorrect')
    //         .addNext(strings.general.no, this.giveRevenueDialog)
    //         .setDefault(this.giveRevenueDialog);


    // private needPrefixDialog: DialogGraphNode =
    //     new AnswerDialogGraphNode(getTextStep(this.TEXT_PROMPT_ID, strings.gtin.need_prefix), 'needPrefix')
    //         .setDefault(this.revenueKnownDialog);


    // private prefixChoiceGraph: DialogGraphNode =
    //     new AnswerDialogGraphNode(
    //         getChoiceStep(this.TEXT_PROMPT_ID, strings.gtin.for_cd_or_other, [strings.gtin.possible_answers.cd_dvd_vinyl, strings.gtin.possible_answers.other]),'prefixChoice')
    //         .addNext(strings.gtin.possible_answers.cd_dvd_vinyl,
    //             new AnswerDialogGraphNode(getChoiceStep(this.TEXT_PROMPT_ID, strings.gtin.special_offer, [strings.general.yes, strings.general.no]),'specialOffer')
    //                 .addNext(strings.general.yes, new AnswerDialogGraphNode(getTextStep(this.TEXT_PROMPT_ID, strings.gtin.cd_dvd_vinyl_form)))
    //                 .addNext(strings.general.no, this.needPrefixDialog))
    //         .addNext(strings.gtin.possible_answers.other, this.needPrefixDialog);

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
        if (userDetails.newUser && userDetails.newUser === true){
            await stepContext.context.sendActivity(strings.main.new_user_documents);
        }
        // await stepContext.context.sendActivity(strings.account.need_to_be_logged_in);
        return await stepContext.next();
    }

    private async checkLoggedInStep(stepContext: WaterfallStepContext){
        if(userDetails && (!userDetails.loggedIn || !userDetails.loggedIn === false)) {
            return await stepContext.beginDialog(ACCOUNT_DIALOG);
        }

        return await stepContext.next()

    }

    private async checkValidPrefixStep(stepContext:WaterfallStepContext){
        userDetails.validPrefixes = ['test1','test2'];
        if (!userDetails.validPrefixes || userDetails.validPrefixes.length === 0) {
            return await stepContext.beginDialog(PREFIX_CHOICE_DIALOG);
        } else {
            // HAS VALID PREFIX --> ASK TO ADD OR CREATE NEW
            return await stepContext.beginDialog(ADD_TO_EXISTING_PREFIX_DIALOG);
        }
    }

    private async processPrefixStep(stepContext:WaterfallStepContext) {
        const answerOfUser = stepContext.result;
        // ADD TO EXISTING PREFIX?
        console.log(answerOfUser);
        if(answerOfUser === strings.general.no){
            return await stepContext.beginDialog(PREFIX_CHOICE_DIALOG);
        }else{
            await stepContext.context.sendActivity(strings.gtin.chose_to_add_to_prefix(answerOfUser));
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
        await getTextPrompt(stepContext,PREFIX_CHOICE_DIALOG,strings.gtin.u_chose_prefix_x(answerOfUser));
        return await stepContext.next();
    }

    private async finalStep(stepContext:WaterfallStepContext){
        return await stepContext.endDialog();
    }
}
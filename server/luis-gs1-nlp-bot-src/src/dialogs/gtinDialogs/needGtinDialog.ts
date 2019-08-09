import { CardFactory, MessageFactory, StatePropertyAccessor } from 'botbuilder';
import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { getChoicePrompt, getChoiceStep, getTextStep } from '../../util/PromptFactory';
import { AccountDialog } from '../accountDialogs/accountDialog';
import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import { AnswerDialogGraphNode, ConditionalDialogGraphNode, DialogGraphNode, GraphDialog } from '../GraphDialog';
import strings from '../strings';
import { GS1DialogState } from '../userDetails';

const ACCOUNT_DIALOG: string = 'accountDialog';
const PREFIX_TEXT_PROMPT: string =  'gtinExistingPrefixTextPrompt';
const PREFIX_CHOICE_DIALOG = 'gtinChoosePrefixDialog';

export class NeedGtinDialog extends CancelAndHelpDialog {
    private readonly GTIN_WATERFALL_DIALOG = 'gtinWaterfallDialog';
    private graphD: GraphDialog;

    private revenueKnownDialog: ConditionalDialogGraphNode = new ConditionalDialogGraphNode(
        (stepContext: WaterfallStepContext) => stepContext.next(),'revenueKnown')
        .setCondition((() => this.userDetails && this.userDetails.revenue).bind(this))
        // .setFalseDialog(this.giveRevenueDialog)
        // .setTrueDialog(this.revenueCorrectDialog)

    private setRevenueDialog: DialogGraphNode =
        new AnswerDialogGraphNode(
            (stepContext: WaterfallStepContext) => {
                this.userDetails.revenue = stepContext.context.activity.text;
                this.accessor.set(stepContext.context, this.userDetails);
                return stepContext.next();
            },'setRevenue').setDefault(this.revenueKnownDialog);

    private giveRevenueDialog: DialogGraphNode =
        new AnswerDialogGraphNode(
            getChoiceStep(this.TEXT_PROMPT_ID,strings.gtin.give_revenue_please,[])
            // (stepContext: WaterfallStepContext) => getTextPrompt(stepContext, this.TEXT_PROMPT_ID, strings.gtin.give_revenue_please)
        ,'giveRevenue').setDefault(this.setRevenueDialog);

    private revenueCorrectDialog: DialogGraphNode =
        new AnswerDialogGraphNode(
            (stepContext: WaterfallStepContext) => getChoicePrompt(stepContext, this.TEXT_PROMPT_ID, strings.gtin.is_revenue_correct(stepContext.context.activity.text), [strings.general.yes, strings.general.no])
        ,'revenueCorrect')
            .addNext(strings.general.no, this.giveRevenueDialog)
            .setDefault(this.giveRevenueDialog);


    private needPrefixDialog: DialogGraphNode =
        new AnswerDialogGraphNode(getTextStep(this.TEXT_PROMPT_ID, strings.gtin.need_prefix), 'needPrefix')
            .setDefault(this.revenueKnownDialog);


    private prefixChoiceGraph: DialogGraphNode =
        new AnswerDialogGraphNode(
            getChoiceStep(this.TEXT_PROMPT_ID, strings.gtin.for_cd_or_other, [strings.gtin.possible_answers.cd_dvd_vinyl, strings.gtin.possible_answers.other]),'prefixChoice')
            .addNext(strings.gtin.possible_answers.cd_dvd_vinyl,
                new AnswerDialogGraphNode(getChoiceStep(this.TEXT_PROMPT_ID, strings.gtin.special_offer, [strings.general.yes, strings.general.no]),'specialOffer')
                    .addNext(strings.general.yes, new AnswerDialogGraphNode(getTextStep(this.TEXT_PROMPT_ID, strings.gtin.cd_dvd_vinyl_form)))
                    .addNext(strings.general.no, this.needPrefixDialog))
            .addNext(strings.gtin.possible_answers.other, this.needPrefixDialog);

    constructor(id){
        super(id || 'needGtinDialog');
        this.graphD = new GraphDialog(PREFIX_CHOICE_DIALOG);
        this
        .addDialog(new WaterfallDialog(this.GTIN_WATERFALL_DIALOG, [
            this.checkIfNewUserStep.bind(this),
            this.checkLoggedInStep.bind(this),
            this.checkValidPrefixStep.bind(this),
            this.addToExistingPrefixStep.bind(this),
        ]))
        .addDialog(new AccountDialog(ACCOUNT_DIALOG))
        .addDialog(this.graphD)
        .addDialog(new TextPrompt(PREFIX_TEXT_PROMPT));

        this.connectGraph();
        
        this.initialDialogId = this.GTIN_WATERFALL_DIALOG;
    }

    private connectGraph(){
        this.revenueKnownDialog.setFalseDialog(this.giveRevenueDialog);
        this.revenueKnownDialog.setTrueDialog(this.revenueCorrectDialog);
    }

    private async checkIfNewUserStep(stepContext:WaterfallStepContext<{accessor:StatePropertyAccessor<GS1DialogState>}>){
        if (this.userDetails.newUser && this.userDetails.newUser === true){
            await stepContext.context.sendActivity(strings.main.new_user_documents);
        }
        // await stepContext.context.sendActivity(strings.account.need_to_be_logged_in);
        return await stepContext.next();
    }

    private async checkLoggedInStep(stepContext: WaterfallStepContext){
        if(this.userDetails && (!this.userDetails.loggedIn || !this.userDetails.loggedIn === false)) {
            return await stepContext.beginDialog(ACCOUNT_DIALOG, this.accessor);
        }

        return await stepContext.next()

    }

    private async checkValidPrefixStep(stepContext:WaterfallStepContext){
        // HAS NO VALID PREFIX --> START HELP WITH PREFIX
        this.graphD.initGraph(this.prefixChoiceGraph);
        if (!this.userDetails.validPrefixes || this.userDetails.validPrefixes.length === 0) {
             return await stepContext.beginDialog(PREFIX_CHOICE_DIALOG, this.accessor);
        } else {
            // HAS VALID PREFIX --> ASK TO ADD OR CREATE NEW
            const introActions = CardFactory.actions([strings.general.no, ...this.userDetails.validPrefixes ]);
            return await stepContext.prompt(PREFIX_TEXT_PROMPT, MessageFactory
                .suggestedActions(introActions, `${strings.gtin.add_to_existing}`));
        }
    }

    private async addToExistingPrefixStep(stepContext:WaterfallStepContext) {
        const answerOfUser = stepContext.result;
        // ADD TO EXISTING PREFIX?
        if(answerOfUser === strings.general.no){
            return await stepContext.beginDialog(PREFIX_CHOICE_DIALOG);
        }else{
            await stepContext.context.sendActivity(strings.gtin.chose_to_add_to_prefix(answerOfUser));
        }
        return await stepContext.endDialog();
    }
}
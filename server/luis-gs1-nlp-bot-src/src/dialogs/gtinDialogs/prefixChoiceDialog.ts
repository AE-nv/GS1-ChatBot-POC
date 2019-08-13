import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { getChoicePrompt } from '../../util/PromptFactory';
import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';
import { GtinForCDDialog } from './gtinForCDDialog';
import { RetrieveRevenueDialog } from './retrieveRevenueDialog';

const TEXT_PROMPT = 'prefixChoiceTextPrompt';
const CHOICE_PROMPT = 'prefixChoiceChoicePrompt';
const WATERFALL_DIALOG = 'prefixChoiceWaterfallDialog';
// const GTIN_FOR_OTHER = 'gtinForCDOtherDialog';
const GTIN_FOR_CD_DVD_VINYL = 'gtinForCDCDDVDVinyl'
const RETRIEVE_REVENUE_DIALOG = 'retrieveRevenueDialog';
export class PrefixChoiceDialog extends CancelAndHelpDialog{
    constructor(id){
        super(id || 'prefixChoiceDialog');
        this
        .addDialog(new TextPrompt(TEXT_PROMPT))
        .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.needGtinForCDorOtherStep.bind(this),
            this.pickNextDialogStep.bind(this),
            this.finalMainStep.bind(this)
        ]))
        .addDialog(new GtinForCDDialog(GTIN_FOR_CD_DVD_VINYL))
        .addDialog(new RetrieveRevenueDialog(RETRIEVE_REVENUE_DIALOG))
        // .addDialog(new GtinForOtherDialog(GTIN_FOR_OTHER));
        this.initialDialogId = WATERFALL_DIALOG;
    }


    private async needGtinForCDorOtherStep(stepContext:WaterfallStepContext){
        return await getChoicePrompt(
            stepContext,
            TEXT_PROMPT,
            strings.gtin.for_cd_or_other, 
            [strings.gtin.possible_answers.other, strings.gtin.possible_answers.cd_dvd_vinyl])
    }

    private async pickNextDialogStep(stepContext:WaterfallStepContext){
        const answerOfUser = stepContext.result;
        switch(answerOfUser){
            case strings.gtin.possible_answers.other:
                // await getTextPrompt(stepContext,TEXT_PROMPT,strings.gtin.ask_some_questions);
                return await stepContext.beginDialog(RETRIEVE_REVENUE_DIALOG, { accessor: this.accessor, firstTimeEnter:true });
            case strings.gtin.possible_answers.cd_dvd_vinyl:
                return await stepContext.beginDialog(GTIN_FOR_CD_DVD_VINYL, { accessor: this.accessor });
        }
        return await stepContext.next();
    }

    private async finalMainStep(stepContext:WaterfallStepContext){
        return await stepContext.endDialog(stepContext.result);
        // stepContext.cancelAllDialogs();
    }
}
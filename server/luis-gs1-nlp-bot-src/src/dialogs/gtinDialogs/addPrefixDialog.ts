import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { getChoicePrompt } from '../../util/PromptFactory';
import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';
import { GtinForCDCDDialog as GtinForCDCDDialog } from './gtinForCDDialog';

const TEXT_PROMPT = 'prefixChoiceTextPrompt';
const CHOICE_PROMPT = 'prefixChoiceChoicePrompt';
const WATERFALL_DIALOG = 'prefixChoiceWaterfallDialog';
const GTIN_FOR_CD_OTHER = 'gtinForCDOtherWaterfallDialog';
const GTIN_FOR_CD_CD_DVD_VINYL = 'gtinForCDCDDVDVinyl'
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
        .addDialog(new GtinForCDCDDialog(GTIN_FOR_CD_CD_DVD_VINYL));
        this.initialDialogId = WATERFALL_DIALOG;
    }


    private async needGtinForCDorOtherStep(stepContext:WaterfallStepContext){
        return await getChoicePrompt(
            stepContext, 
            TEXT_PROMPT,
            strings.gtin.for_cd, 
            [strings.gtin.possible_answers.other, strings.gtin.possible_answers.cd_dvd_vinyl])
    }

    private async pickNextDialogStep(stepContext:WaterfallStepContext){
        const answerOfUser = stepContext.result;
        switch(answerOfUser){
            case strings.gtin.possible_answers.other:
                return await stepContext.beginDialog(GTIN_FOR_CD_OTHER, this.accessor);
            case strings.gtin.possible_answers.cd_dvd_vinyl:
                return await stepContext.beginDialog(GTIN_FOR_CD_CD_DVD_VINYL, this.accessor);
        }
    }

    private async finalMainStep(stepContext:WaterfallStepContext){
        stepContext.endDialog();
    }




}
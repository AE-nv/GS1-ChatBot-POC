import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { getChoicePrompt, getTextPrompt } from '../../util/PromptFactory';
import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';
import { RetrieveRevenueDialog } from './retrieveRevenueDialog';

const TEXT_PROMPT = 'gtinForCD';
const NEED_PREFIX_DIALOG = 'gtinForCDCDNeedPrefix';
export class GtinForCDDialog extends CancelAndHelpDialog{

    constructor(id){
        super(id || 'gtinForCDDialog');

        this.addDialog(new WaterfallDialog('gtinForCDWaterfall',[
            this.specialOfferStep.bind(this),
            this.pickNextDialogStep.bind(this)
        ]))
        .addDialog(new RetrieveRevenueDialog(NEED_PREFIX_DIALOG))
        .addDialog(new TextPrompt(TEXT_PROMPT));
        this.initialDialogId = 'gtinForCDWaterfall'
    }

    private async specialOfferStep(stepContext:WaterfallStepContext){
        return await getChoicePrompt(stepContext, TEXT_PROMPT, strings.gtin.special_offer, [strings.general.no, strings.general.yes]);
    }

    private async pickNextDialogStep(stepContext:WaterfallStepContext){
        switch(stepContext.result){
            case strings.general.no:
                return await stepContext.beginDialog(NEED_PREFIX_DIALOG);
            case strings.general.yes:
                await getTextPrompt(stepContext, TEXT_PROMPT, strings.gtin.cd_dvd_vinyl_form);
        }
        return await stepContext.endDialog();
    }
}
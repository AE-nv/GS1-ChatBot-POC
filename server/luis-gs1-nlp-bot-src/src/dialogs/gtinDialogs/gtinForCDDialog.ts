import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { getChoicePrompt, getTextPrompt } from '../../util/PromptFactory';
import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';
import { NeedPrefixDialog } from './needPrefixDialog';

const TEXT_PROMPT = 'gtinForCD';
const NEED_PREFIX_DIALOG = 'gtinForCDCDNeedPrefix';
export class GtinForCDCDDialog extends CancelAndHelpDialog{

    constructor(id){
        super(id || 'gtinForCDDialog');

        this.addDialog(new WaterfallDialog('gtinForCDWaterfall',[
            this.specialOfferStep.bind(this),
            this.pickNextDialogStep.bind(this)
        ]))
        .addDialog(new TextPrompt('text'))
        .addDialog(new NeedPrefixDialog(NEED_PREFIX_DIALOG));
        this.initialDialogId = 'gtinForCDWaterfall'
    }

    private async specialOfferStep(stepContext:WaterfallStepContext){
        return await getChoicePrompt(stepContext, this.TEXT_PROMPT_ID, strings.gtin.special_offer, [strings.general.no, strings.general.yes]);
    }

    private async pickNextDialogStep(stepContext:WaterfallStepContext){
        switch(stepContext.result){
            case strings.general.no:
                return await stepContext.beginDialog(NEED_PREFIX_DIALOG,this.accessor);
            case strings.general.yes:
                return await getTextPrompt(stepContext, this.TEXT_PROMPT_ID, strings.gtin.cd_dvd_vinyl_form);
        }
        return await stepContext.endDialog();
    }
}
import { WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { getTextPrompt } from '../../util/PromptFactory';
import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';

const IS_CORRECT_REVENUE_DIALOG = 'enterRevIsCorrectRevDIALOG'
export class EnterRevenueDialog extends CancelAndHelpDialog{
    constructor(id){
        super(id || 'enterRevDialog');

        this.addDialog(new WaterfallDialog('enterRevWaterfallDialog', [
            this.giveRevenueStep.bind(this),
            this.finalStep.bind(this)
        ]))
        this.initialDialogId = 'enterRevWaterfallDialog';
    }

    private async giveRevenueStep(stepContext:WaterfallStepContext){
        return await getTextPrompt(stepContext,this.TEXT_PROMPT_ID,strings.gtin.give_revenue_please)
    }


    private async finalStep(stepContext: WaterfallStepContext) {
        stepContext.endDialog(stepContext.result);
    }
}
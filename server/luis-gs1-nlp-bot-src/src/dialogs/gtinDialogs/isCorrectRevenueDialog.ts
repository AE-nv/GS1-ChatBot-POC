import { WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { getChoicePrompt, getTextPrompt } from '../../util/PromptFactory';
import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';
import { EnterRevenueDialog } from './enterRevenueDialog';

const ENTER_REVENUE_DIALOG = 'correctRevEnterRevDialog'
export class IsCorrectRevenueDialog extends CancelAndHelpDialog {
    constructor(id){
        super(id || 'iscorrectrevDialog');

        this.addDialog(new WaterfallDialog('isCorrectRevWaterfall',[
            this.isCorrectRevStep.bind(this),
            this.nextDialogStep.bind(this),
            this.finalStep.bind(this),
        ]))
        .addDialog(new EnterRevenueDialog(ENTER_REVENUE_DIALOG));
        this.initialDialogId = 'isCorrectRevWaterfall';
    }

    private async isCorrectRevStep(stepContext:WaterfallStepContext){
        return await getChoicePrompt(stepContext, this.TEXT_PROMPT_ID,strings.gtin.is_revenue_correct(this.userDetails.revenue),[strings.general.yes, strings.general.no]);
    }

    private async nextDialogStep(stepContext:WaterfallStepContext){
        switch(stepContext.result){
            case strings.general.yes:
                await getTextPrompt(stepContext,this.TEXT_PROMPT_ID,'TODO: PREFX DETERMINES MAX');
                return await stepContext.next();
            case strings.general.no:
                return await stepContext.beginDialog(ENTER_REVENUE_DIALOG, this.accessor);
        }
    }

    private async finalStep(stepContext: WaterfallStepContext) {
        stepContext.endDialog();
    }
}
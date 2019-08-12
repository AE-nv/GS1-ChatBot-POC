import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { getChoicePrompt } from '../../util/PromptFactory';
import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';
import { userDetails } from '../userDetails';

const ENTER_REVENUE_DIALOG = 'correctRevEnterRevDialog'
const TEXT_PROMPT='isCorrectRevenueTextPrompt';
export class IsCorrectRevenueDialog extends CancelAndHelpDialog {
    constructor(id){
        super(id || 'iscorrectrevDialog');

        this.addDialog(new WaterfallDialog('isCorrectRevWaterfall',[
            this.isCorrectRevStep.bind(this),
            // this.nextDialogStep.bind(this),
            this.resetIfNotCorrectAndEndStep.bind(this),
        ]))
        // .addDialog(new EnterRevenueDialog(ENTER_REVENUE_DIALOG))
        .addDialog(new TextPrompt(TEXT_PROMPT));
        this.initialDialogId = 'isCorrectRevWaterfall';

    }

    private async isCorrectRevStep(stepContext:WaterfallStepContext){
        return await getChoicePrompt(stepContext, TEXT_PROMPT, strings.gtin.is_revenue_correct(userDetails.revenue),[strings.general.yes, strings.general.no]);
    }

    // private async nextDialogStep(stepContext:WaterfallStepContext){
    //     switch(stepContext.result){
    //         case strings.general.yes:
    //             stepContext.next(); // proceed to final step where the normal flow is continued.
    //         case strings.general.no:
    //             return await stepContext.beginDialog(ENTER_REVENUE_DIALOG, this.accessor);
    //     }
    // }

    private async resetIfNotCorrectAndEndStep(stepContext: WaterfallStepContext) {
        console.log(`ResetAfterNotCorrectRevStep: ${stepContext.result}`);
        if(stepContext.result === strings.general.no){
            userDetails.revenue = undefined;
        }
        return await stepContext.endDialog(stepContext.result);
    }
}
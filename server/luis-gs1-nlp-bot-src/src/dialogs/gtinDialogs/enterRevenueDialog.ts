import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { getTextPrompt } from '../../util/PromptFactory';
import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';
import { userDetails } from '../userDetails';

const IS_CORRECT_REVENUE_DIALOG = 'enterRevIsCorrectRevDIALOG'
const TEXT_PROMPT='enterRevTextprompt'
export class EnterRevenueDialog extends CancelAndHelpDialog{
    constructor(id){
        super(id || 'enterRevDialog');

        this.addDialog(new WaterfallDialog('enterRevWaterfallDialog', [
            this.giveRevenueStep.bind(this),
            this.finalStep.bind(this)
        ]))
            .addDialog(new TextPrompt(TEXT_PROMPT));
        this.initialDialogId = 'enterRevWaterfallDialog';
    }

    private async giveRevenueStep(stepContext:WaterfallStepContext){
        return await getTextPrompt(stepContext,TEXT_PROMPT,strings.gtin.give_revenue_please)
    }


    private async finalStep(stepContext: WaterfallStepContext) {
        console.log(stepContext.result);
        userDetails.revenue = stepContext.result;
        return await stepContext.endDialog();
    }
}
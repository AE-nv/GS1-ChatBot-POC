import { WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import { EnterRevenueDialog } from './enterRevenueDialog';
import { IsCorrectRevenueDialog } from './isCorrectRevenueDialog';

const CORRECT_REVENUE_DIALOG = 'needPrefixIsCorrectRevenueDialog';
const FILL_IN_REVENUE_DIALOG ='needPrefixFillInRevenueDialog';

export class NeedPrefixDialog extends CancelAndHelpDialog {
    constructor(id){
        super(id || 'needPrefixDialog');
        this.addDialog(new WaterfallDialog('needPrefixWaterfall',[
            this.checkRevenueStep.bind(this),
            this.finalStep.bind(this)
        ]))
            .addDialog(new IsCorrectRevenueDialog(CORRECT_REVENUE_DIALOG))
            .addDialog(new EnterRevenueDialog(FILL_IN_REVENUE_DIALOG));
        this.initialDialogId = 'needPrefixWaterfall';
    }

    private async checkRevenueStep(stepContext:WaterfallStepContext){
        if (!!this.userDetails.revenue){
            return await stepContext.beginDialog(CORRECT_REVENUE_DIALOG,this.accessor);
        }else{
            return await stepContext.beginDialog(FILL_IN_REVENUE_DIALOG, this.accessor);
        }
    }

    private async finalStep(stepContext:WaterfallStepContext){
        stepContext.endDialog();
    }
}
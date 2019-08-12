import { WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';
import { userDetails } from '../userDetails';
import { EnterRevenueDialog } from './enterRevenueDialog';
import { IsCorrectRevenueDialog } from './isCorrectRevenueDialog';

const CORRECT_REVENUE_DIALOG = 'needPrefixIsCorrectRevenueDialog';
const FILL_IN_REVENUE_DIALOG ='needPrefixFillInRevenueDialog';
const RETRIEVE_REVENUE_WATERFALL = 'retrieveRevenueWaterfall';

export class RetrieveRevenueDialog extends CancelAndHelpDialog {
    constructor(id){
        super(id || 'needPrefixDialog');
        this.addDialog(new WaterfallDialog(RETRIEVE_REVENUE_WATERFALL,[
            this.checkRevenueStep.bind(this),
            this.processResultStep.bind(this),
        ]))
            .addDialog(new IsCorrectRevenueDialog(CORRECT_REVENUE_DIALOG))
            .addDialog(new EnterRevenueDialog(FILL_IN_REVENUE_DIALOG));
        this.initialDialogId = RETRIEVE_REVENUE_WATERFALL;
    }

    private async checkRevenueStep(stepContext:WaterfallStepContext){
        console.log(userDetails.revenue);
        if (!!userDetails.revenue){
            return await stepContext.beginDialog(CORRECT_REVENUE_DIALOG);
        }else{
            return await stepContext.beginDialog(FILL_IN_REVENUE_DIALOG);
        }
    }

    private async processResultStep(stepContext: WaterfallStepContext){
        console.log(stepContext.result);
        if(stepContext.result === strings.general.yes){
            return await stepContext.endDialog(); // if yes is the result, it means that the source dialog (from where the result came from) is the 'CorrectRevenueDialog' and thus, the dialog can be ended.
        }else{
            return await stepContext.replaceDialog(RETRIEVE_REVENUE_WATERFALL)
        }
    }
}
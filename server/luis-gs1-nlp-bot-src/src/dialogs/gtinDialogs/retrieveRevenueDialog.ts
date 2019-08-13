import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { getTextPrompt } from '../../util/PromptFactory';
import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';
import { EnterRevenueDialog } from './enterRevenueDialog';
import { IsCorrectRevenueDialog } from './isCorrectRevenueDialog';

const CORRECT_REVENUE_DIALOG = 'needPrefixIsCorrectRevenueDialog';
const FILL_IN_REVENUE_DIALOG ='needPrefixFillInRevenueDialog';
const RETRIEVE_REVENUE_WATERFALL = 'retrieveRevenueWaterfall';
const TEXT_PROMPT='retrieveRevTextPrompt';

export class RetrieveRevenueDialog extends CancelAndHelpDialog {
    constructor(id){
        super(id || 'needPrefixDialog');
        this.addDialog(new WaterfallDialog(RETRIEVE_REVENUE_WATERFALL,[
            this.introStep.bind(this),
            this.readyStep.bind(this),
            this.checkRevenueStep.bind(this),
            this.processResultStep.bind(this),
        ]))
            .addDialog(new IsCorrectRevenueDialog(CORRECT_REVENUE_DIALOG))
            .addDialog(new EnterRevenueDialog(FILL_IN_REVENUE_DIALOG))
            .addDialog(new TextPrompt(TEXT_PROMPT));
        this.initialDialogId = RETRIEVE_REVENUE_WATERFALL;
    }

    private async introStep(stepContext:WaterfallStepContext<{firstTimeEnter:boolean}>){
        const isFirstTimeEnter:boolean = stepContext.options && stepContext.options.firstTimeEnter; 
        if(isFirstTimeEnter){
            await getTextPrompt(stepContext,TEXT_PROMPT,strings.gtin.ask_some_questions);
        }
        return await stepContext.next();
    }

    private async readyStep(stepContext: WaterfallStepContext<{firstTimeEnter:boolean}>){
        const isFirstTimeEnter: boolean = stepContext.options && stepContext.options.firstTimeEnter;
        if (isFirstTimeEnter) {
            await getTextPrompt(stepContext, TEXT_PROMPT, strings.gtin.ready_here_we_go);
        }
        return await stepContext.next();

    }

    private async checkRevenueStep(stepContext: WaterfallStepContext<{ firstTimeEnter: boolean }>){
        const userDetails = await this.getUserState(stepContext.context);
        if (!!userDetails.revenue){
            return await stepContext.beginDialog(CORRECT_REVENUE_DIALOG, { accessor: this.accessor });
        }else{
            return await stepContext.beginDialog(FILL_IN_REVENUE_DIALOG, { accessor: this.accessor });
        }
    }

    private async processResultStep(stepContext: WaterfallStepContext){
        console.log(stepContext.result);
        if(stepContext.result === strings.general.yes){
            return await stepContext.endDialog(); // if yes is the result, it means that the source dialog (from where the result came from) is the 'CorrectRevenueDialog' and thus, the dialog can be ended.
        }else{
            return await stepContext.replaceDialog(RETRIEVE_REVENUE_WATERFALL, { accessor: this.accessor })
        }
    }
}
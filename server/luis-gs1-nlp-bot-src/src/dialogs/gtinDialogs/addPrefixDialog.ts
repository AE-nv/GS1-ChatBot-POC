import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import { prefixChoiceDialog } from '../ComplexDialogs';

const TEXT_PROMPT = 'prefixChoiceTextPrompt';
const CHOICE_PROMPT = 'prefixChoiceChoicePrompt';
const WATERFALL_DIALOG = 'prefixChoiceWaterfallDialog';
export class PrefixChoiceDialog extends CancelAndHelpDialog{
    private complexDialog = prefixChoiceDialog;
    private waterfallDialog: WaterfallDialog;
    private dynamicWaterfall;
    constructor(id){
        super(id || 'prefixChoiceDialog');
        this.waterfallDialog = new WaterfallDialog(WATERFALL_DIALOG, [
            this.selectionStep.bind(this),
            this.loopStep.bind(this)
        ]);
        this
        .addDialog(new TextPrompt(TEXT_PROMPT))
        .addDialog(this.waterfallDialog);
        this.initialDialogId = WATERFALL_DIALOG;
    }

    private async selectionStep(stepContext:WaterfallStepContext){
        if(this.dynamicWaterfall){
            return await this.dynamicWaterfall.nextStep(stepContext);
        }else{
            return await stepContext.endDialog();
        }
        // if(this.complexDialog){
        //     if(this.complexDialog.getPossibleAnswers.length > 0){
        //     return await stepContext.prompt(TEXT_PROMPT, MessageFactory
        //         .suggestedActions(this.complexDialog.getPossibleAnswers, this.complexDialog.dialogText));
        //     }
        // }
        // return await stepContext.endDialog();
    }

    private async loopStep(stepContext:WaterfallStepContext){

        this.complexDialog = this.complexDialog.getNext(stepContext.result);
        console.log(this.complexDialog);
        while (this.complexDialog && this.complexDialog.getPossibleAnswers.length === 0 && this.complexDialog.getNext() !== null){
            await stepContext.context.sendActivity(this.complexDialog.dialogText);
            this.complexDialog = this.complexDialog.getNext();
        }
        return await stepContext.replaceDialog(this.id, this.accessor);
    }


    // public beginDialog(innerDC: DialogContext,options:{}){
        
    //     return super.beginDialog(innerDC,options);
    // }
}
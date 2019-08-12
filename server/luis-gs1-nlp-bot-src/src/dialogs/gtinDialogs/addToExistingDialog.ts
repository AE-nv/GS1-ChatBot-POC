import { CardFactory, MessageFactory } from 'botbuilder';
import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';
import { userDetails } from '../userDetails';
import { PrefixChoiceDialog } from './prefixChoiceDialog';

const TEXT_PROMPT = 'addToExistingPrefixTextPrompt';
const WATERFALL_DIALOG = 'addToExistingPrefixWaterfallDialog';
const PREFIX_CHOICE_DIALOG='addToExistingPrefixChoiceDialog;'
export class AddToExistingPrefixDialog extends CancelAndHelpDialog {
    constructor(id:string){
        super(id || 'addToExistingDialog');
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            // this.introStep.bind(this),
            this.askIfUserWantsToAddToExistingPrefixStep.bind(this),
            this.processResultStep.bind(this),
            this.returnResultStep.bind(this)
        ])).addDialog(new TextPrompt(TEXT_PROMPT))
        .addDialog(new PrefixChoiceDialog(PREFIX_CHOICE_DIALOG))

        this.initialDialogId = WATERFALL_DIALOG;

    }

    private async askIfUserWantsToAddToExistingPrefixStep(stepContext: WaterfallStepContext){
        const introActions = CardFactory.actions([strings.general.no, ...userDetails.validPrefixes]);
        return await stepContext.prompt(TEXT_PROMPT, MessageFactory.suggestedActions(introActions, strings.gtin.add_to_existing));
    }

    private async processResultStep(stepContext: WaterfallStepContext) {
        const answerOfUser = stepContext.result;
        if(answerOfUser === strings.general.no){
            return await stepContext.beginDialog(PREFIX_CHOICE_DIALOG);
        }
    }

    private async returnResultStep(stepContext: WaterfallStepContext){
        return await stepContext.endDialog(stepContext.result);
    }
}
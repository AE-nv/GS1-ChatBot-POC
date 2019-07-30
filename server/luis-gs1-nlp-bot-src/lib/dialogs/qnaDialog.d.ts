import { WaterfallStepContext } from 'botbuilder-dialogs';
import { CancelAndHelpDialog } from './cancelAndHelpDialog';
import { GS1QNAContextRecognizer } from './GS1QNAContextRecognizer';
export declare class QNADialog extends CancelAndHelpDialog {
    private qnaLuisRecognizer;
    private qnaMakerClient;
    constructor(id: any, qnaLuisRecognizer: GS1QNAContextRecognizer);
    poseQuestionStep(stepContext: WaterfallStepContext): Promise<import("botbuilder-dialogs").DialogTurnResult<any>>;
    analyzeInputStep(stepContext: WaterfallStepContext): Promise<import("botbuilder-dialogs").DialogTurnResult<any>>;
    wasThisUsefulStep(stepContext: WaterfallStepContext): Promise<import("botbuilder-dialogs").DialogTurnResult<any>>;
}

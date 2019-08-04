import { WaterfallStepContext } from 'botbuilder-dialogs';
import { CancelAndHelpDialog } from './cancelAndHelpDialog';
export declare class QNADialog extends CancelAndHelpDialog {
    private qnaMakerClient;
    constructor(id: any);
    poseQuestionStep(stepContext: WaterfallStepContext): Promise<import("botbuilder-dialogs").DialogTurnResult<any>>;
    analyzeInputStep(stepContext: WaterfallStepContext): Promise<import("botbuilder-dialogs").DialogTurnResult<any>>;
    wasThisUsefulStep(stepContext: WaterfallStepContext): Promise<import("botbuilder-dialogs").DialogTurnResult<any>>;
}

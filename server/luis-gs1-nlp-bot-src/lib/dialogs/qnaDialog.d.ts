import { CancelAndHelpDialog } from './cancelAndHelpDialog';
import { GS1QNAContextRecognizer } from './GS1QNAContextRecognizer';
export declare class QNADialog extends CancelAndHelpDialog {
    private qnaLuisRecognizer;
    private qnaMakerClient;
    constructor(id: any, qnaLuisRecognizer: GS1QNAContextRecognizer);
    analyzeInputStep(stepContext: any): Promise<any>;
}

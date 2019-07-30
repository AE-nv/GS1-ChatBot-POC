import { ComponentDialog } from 'botbuilder-dialogs';
import { GS1QNAContextRecognizer } from './GS1QNAContextRecognizer';
export declare class MainDialog extends ComponentDialog {
    private mainLuisRecognizer;
    private qnaLuisRecognizer;
    private qnaDialog;
    constructor(mainLuisRecognizer: any, qnaLuisRecognizer: GS1QNAContextRecognizer, qnaDialog: any);
    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    run(turnContext: any, accessor: any): Promise<void>;
    private introStep;
    private chooseBarcodeOrFAQStep;
    /**
     * This is the final step in the main waterfall dialog.
     * It wraps up the sample "book a flight" interaction with a simple confirmation.
     */
    private finalStep;
}

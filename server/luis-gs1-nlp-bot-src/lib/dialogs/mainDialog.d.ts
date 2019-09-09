import { StatePropertyAccessor, TurnContext } from 'botbuilder';
import { ComponentDialog, DialogState } from 'botbuilder-dialogs';
export declare class MainDialog extends ComponentDialog {
    private accessor;
    constructor();
    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    run(turnContext: TurnContext, accessor: StatePropertyAccessor<DialogState>): Promise<void>;
    private introStep;
    private newUserStep;
    private setUserDetailsStep;
    private poseHelpPossibilities;
    private possibilityPickedStep;
    private outroStep;
    private finalStep;
}

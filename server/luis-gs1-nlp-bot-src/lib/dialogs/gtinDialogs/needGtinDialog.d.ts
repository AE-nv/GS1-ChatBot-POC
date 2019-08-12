import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
export declare class NeedGtinDialog extends CancelAndHelpDialog {
    private readonly GTIN_WATERFALL_DIALOG;
    private graphD;
    constructor(id: any);
    private checkIfNewUserStep;
    private checkLoggedInStep;
    private checkValidPrefixStep;
    private processPrefixStep;
    private prefixDeterminesNrOfGtinsStep;
    private howMuchTradeUnitsStep;
    private processNrOfTradeUnitsStep;
    private processPrefixChoiceStep;
    private finalStep;
}

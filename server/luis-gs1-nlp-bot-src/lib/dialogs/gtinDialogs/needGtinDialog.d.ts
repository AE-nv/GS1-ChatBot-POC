import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
export declare class NeedGtinDialog extends CancelAndHelpDialog {
    private readonly GTIN_WATERFALL_DIALOG;
    private userDetails;
    constructor(id: any);
    private checkIfNewUserStep;
    private checkLoggedInStep;
    private checkValidPrefixStep;
    private addToExistingPrefixStep;
}

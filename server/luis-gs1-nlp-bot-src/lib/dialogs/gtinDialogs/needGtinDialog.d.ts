import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
export declare class NeedGtinDialog extends CancelAndHelpDialog {
    private readonly GTIN_WATERFALL_DIALOG;
    private graphD;
    private revenueKnownDialog;
    private setRevenueDialog;
    private giveRevenueDialog;
    private revenueCorrectDialog;
    private needPrefixDialog;
    private prefixChoiceGraph;
    constructor(id: any);
    private connectGraph;
    private checkIfNewUserStep;
    private checkLoggedInStep;
    private checkValidPrefixStep;
    private addToExistingPrefixStep;
}

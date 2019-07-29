import { CancelAndHelpDialog } from './cancelAndHelpDialog';
export declare class BookingDialog extends CancelAndHelpDialog {
    constructor(id: any);
    /**
     * If a destination city has not been provided, prompt for one.
     */
    destinationStep(stepContext: any): Promise<any>;
    /**
     * If an origin city has not been provided, prompt for one.
     */
    originStep(stepContext: any): Promise<any>;
    /**
     * If a travel date has not been provided, prompt for one.
     * This will use the DATE_RESOLVER_DIALOG.
     */
    travelDateStep(stepContext: any): Promise<any>;
    /**
     * Confirm the information the user has provided.
     */
    confirmStep(stepContext: any): Promise<any>;
    /**
     * Complete the interaction and end the dialog.
     */
    finalStep(stepContext: any): Promise<any>;
    isAmbiguous(timex: any): boolean;
}

import { ComponentDialog } from 'botbuilder-dialogs';
/**
 * This base class watches for common phrases like "help" and "cancel" and takes action on them
 * BEFORE they reach the normal bot logic.
 */
export declare class CancelAndHelpDialog extends ComponentDialog {
    onContinueDialog(innerDc: any): Promise<any>;
    interrupt(innerDc: any): Promise<any>;
}

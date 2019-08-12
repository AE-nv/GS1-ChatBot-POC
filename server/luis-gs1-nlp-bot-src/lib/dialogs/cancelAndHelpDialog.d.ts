import { StatePropertyAccessor } from 'botbuilder';
import { ComponentDialog, DialogContext } from 'botbuilder-dialogs';
/**
 * This base class watches for common phrases like "help" and "cancel" and takes action on them
 * BEFORE they reach the normal bot logic.
 */
export declare class CancelAndHelpDialog extends ComponentDialog {
    constructor(id: any);
    onBeginDialog(innerDc: DialogContext, options: StatePropertyAccessor): Promise<import("botbuilder-dialogs").DialogTurnResult<any>>;
    onContinueDialog(innerDc: DialogContext): Promise<any>;
    interrupt(innerDc: any): Promise<any>;
}

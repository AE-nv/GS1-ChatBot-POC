import { StatePropertyAccessor, TurnContext } from 'botbuilder';
import { ComponentDialog, DialogContext } from 'botbuilder-dialogs';
import { GS1DialogState } from './userDetails';
/**
 * This base class watches for common phrases like "help" and "cancel" and takes action on them
 * BEFORE they reach the normal bot logic.
 */
export declare class CancelAndHelpDialog extends ComponentDialog {
    protected accessor: StatePropertyAccessor<GS1DialogState>;
    constructor(id: any);
    onBeginDialog(innerDc: DialogContext, options?: any): Promise<import("botbuilder-dialogs").DialogTurnResult<any>>;
    onContinueDialog(innerDc: DialogContext): Promise<import("botbuilder-dialogs").DialogTurnResult<any>>;
    interrupt(innerDc: DialogContext): Promise<import("botbuilder-dialogs").DialogTurnResult<any>>;
    protected getUserState(context: TurnContext): Promise<GS1DialogState>;
}

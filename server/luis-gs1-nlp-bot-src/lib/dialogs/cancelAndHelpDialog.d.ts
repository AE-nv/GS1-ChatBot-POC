import { StatePropertyAccessor } from 'botbuilder';
import { ComponentDialog, DialogContext } from 'botbuilder-dialogs';
import { GS1DialogState } from './userDetails';
/**
 * This base class watches for common phrases like "help" and "cancel" and takes action on them
 * BEFORE they reach the normal bot logic.
 */
export declare class CancelAndHelpDialog extends ComponentDialog {
    userDetails: GS1DialogState;
    accessor: StatePropertyAccessor<GS1DialogState>;
    protected TEXT_PROMPT_ID: string;
    constructor(id: any);
    onBeginDialog(innerDc: DialogContext, options: StatePropertyAccessor): Promise<import("botbuilder-dialogs").DialogTurnResult<any>>;
    onContinueDialog(innerDc: DialogContext): Promise<any>;
    interrupt(innerDc: any): Promise<any>;
}

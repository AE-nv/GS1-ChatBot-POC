import { InputHints, StatePropertyAccessor, TurnContext } from 'botbuilder';
import { ComponentDialog, DialogContext, DialogTurnStatus } from 'botbuilder-dialogs';

import { GS1DialogState } from './userDetails';

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/**
 * This base class watches for common phrases like "help" and "cancel" and takes action on them
 * BEFORE they reach the normal bot logic.
 */
export class CancelAndHelpDialog extends ComponentDialog {
    // public userDetails: GS1DialogState;
    // protected TEXT_PROMPT_ID:string;
    protected accessor: StatePropertyAccessor<GS1DialogState>;
    constructor(id){
        super(id);
        // this.TEXT_PROMPT_ID = 'TEXTPROMPT:'+id;
        // this.addDialog(new TextPrompt(this.TEXT_PROMPT_ID));
    }

    public async onBeginDialog(innerDc: DialogContext, options?){
        this.accessor = options.accessor
        return await super.onBeginDialog(innerDc,options);
    }

    public async onContinueDialog(innerDc: DialogContext) {
        const result = await this.interrupt(innerDc);
        if (result) {
            return result;
        }
        return await super.onContinueDialog(innerDc);
    }

    public async interrupt(innerDc: DialogContext) {
        if (innerDc.context.activity.text) {
            const text = innerDc.context.activity.text.toLowerCase();

            switch (text) {
            case 'help':
            case '?':
                const helpMessageText = 'Show help here';
                await innerDc.context.sendActivity(helpMessageText, helpMessageText, InputHints.ExpectingInput);
                return { status: DialogTurnStatus.waiting };
            case 'cancel':
            case 'stop':
            case 'beëindigen':
            case 'terug':
            case 'back':
            case 'quit':
                // const cancelMessageText = 'Cancelling...';
                // await innerDc.context.sendActivity(cancelMessageText, cancelMessageText, InputHints.IgnoringInput);
                return await innerDc.cancelAllDialogs();
            }
        }
    }
    
    protected async getUserState(context: TurnContext): Promise<GS1DialogState> {
        return await this.accessor && this.accessor.get(context);
    }
}

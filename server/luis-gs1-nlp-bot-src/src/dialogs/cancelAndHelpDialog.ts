// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InputHints, StatePropertyAccessor } from 'botbuilder';
import { ComponentDialog, DialogContext, DialogTurnStatus } from 'botbuilder-dialogs';

import { GS1DialogState } from './userDetails';


/**
 * This base class watches for common phrases like "help" and "cancel" and takes action on them
 * BEFORE they reach the normal bot logic.
 */
export class CancelAndHelpDialog extends ComponentDialog {
    protected accessor:StatePropertyAccessor<GS1DialogState>;
    protected userDetails: GS1DialogState;
    
    async onBeginDialog(innerDc: DialogContext, options:StatePropertyAccessor){
        this.accessor = options;
        this.userDetails = await this.accessor.get(innerDc.context);
        return await innerDc.beginDialog(this.initialDialogId,options);
    }

    async onContinueDialog(innerDc) {
        const result = await this.interrupt(innerDc);
        if (result) {
            return result;
        }
        return await super.onContinueDialog(innerDc);
    }

    async interrupt(innerDc) {
        if (innerDc.context.activity.text) {
            const text = innerDc.context.activity.text.toLowerCase();

            switch (text) {
            case 'help':
            case '?':
                const helpMessageText = 'Show help here';
                await innerDc.context.sendActivity(helpMessageText, helpMessageText, InputHints.ExpectingInput);
                return { status: DialogTurnStatus.waiting };
            case 'cancel':
            case 'quit':
                const cancelMessageText = 'Cancelling...';
                await innerDc.context.sendActivity(cancelMessageText, cancelMessageText, InputHints.IgnoringInput);
                return await innerDc.cancelAllDialogs();
            }
        }
    }
}

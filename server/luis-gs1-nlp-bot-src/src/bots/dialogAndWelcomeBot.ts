// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BotState } from 'botbuilder';
import { Dialog } from 'botbuilder-dialogs';

import { MainDialog } from '../dialogs/mainDialog';
import { GS1DialogState } from '../dialogs/userDetails';
import { DialogBot } from './dialogBot';

export class DialogAndWelcomeBot extends DialogBot {
    constructor(conversationState: BotState, userState: BotState, dialog: Dialog) {
        super(conversationState, userState, dialog);
        
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    const dialogStateAccessor = conversationState.createProperty<GS1DialogState>('DialogState');
                    
                    await (dialog as MainDialog).run(context, dialogStateAccessor);
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

    }
}

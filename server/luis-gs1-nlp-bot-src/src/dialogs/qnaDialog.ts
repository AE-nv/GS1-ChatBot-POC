// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { LuisRecognizer } from 'botbuilder-ai';
import { ConfirmPrompt, TextPrompt, WaterfallDialog } from 'botbuilder-dialogs';

import QNAMAkerClient from '../integrations/qnamaker/QNAMakerClient';
import { QNAMakerResponse } from '../integrations/qnamaker/QNAMakerContract';
import { CancelAndHelpDialog } from './cancelAndHelpDialog';
import { GS1QNAContextRecognizer } from './GS1QNAContextRecognizer';


const CONFIRM_PROMPT = 'confirmPrompt';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

export class QNADialog extends CancelAndHelpDialog {
    private qnaMakerClient: QNAMAkerClient;
    constructor(id, private qnaLuisRecognizer:GS1QNAContextRecognizer) {
        super(id || 'qnaDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.analyzeInputStep.bind(this),
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
        this.qnaMakerClient = new QNAMAkerClient(
            '36677783-1246-4ab8-8ec5-197f0f829f5b',
            'cbde9f34-58cf-46d5-af76-975d99df84eb',
            'https://gs1-pocbot.azurewebsites.net',
        );
    }

    public async analyzeInputStep(stepContext){
        const luisResult = await this.qnaLuisRecognizer.executeLuisQuery(stepContext.context);
        console.log(stepContext.context._activity.text)
        console.log(LuisRecognizer.topIntent(luisResult))
        const qnaResponse:
             | QNAMakerResponse
             | undefined = await this.qnaMakerClient.getAnswerForQuestion(
             stepContext.context._activity.text,)
        return await stepContext.prompt(TEXT_PROMPT, {prompt: `Ik denk dat je vraag binnen categorie: ${LuisRecognizer.topIntent(luisResult)} ligt met als antwoord: ${qnaResponse.answers[0].answer}`})
    }
}

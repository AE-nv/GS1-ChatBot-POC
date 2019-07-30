// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardFactory, MessageFactory } from 'botbuilder';
import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import QNAMAkerClient from '../integrations/qnamaker/QNAMakerClient';
import { QNAMakerResponse } from '../integrations/qnamaker/QNAMakerContract';
import { CancelAndHelpDialog } from './cancelAndHelpDialog';
import { GS1QNAContextRecognizer } from './GS1QNAContextRecognizer';
import strings from './strings';

const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';
const CONFIRM_PROMPT = 'confirmPrompt';

export class QNADialog extends CancelAndHelpDialog {
    private qnaMakerClient: QNAMAkerClient;
    constructor(id, private qnaLuisRecognizer:GS1QNAContextRecognizer) {
        super(id || 'qnaDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.poseQuestionStep.bind(this),
                this.analyzeInputStep.bind(this),
                this.wasThisUsefulStep.bind(this),
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
        this.qnaMakerClient = new QNAMAkerClient(
            '36677783-1246-4ab8-8ec5-197f0f829f5b',
            'cbde9f34-58cf-46d5-af76-975d99df84eb',
            'https://gs1-pocbot.azurewebsites.net',
        );
    }

    public async poseQuestionStep(stepContext: WaterfallStepContext){
        return await stepContext.prompt(TEXT_PROMPT, { prompt: strings.faq.pose_question })
    }

    public async analyzeInputStep(stepContext: WaterfallStepContext){
        // const luisResult = await this.qnaLuisRecognizer.executeLuisQuery(stepContext.context);
        // console.log(LuisRecognizer.topIntent(luisResult))
        const qnaResponse:
             | QNAMakerResponse
             | undefined = await this.qnaMakerClient.getAnswerForQuestion(
             stepContext.context.activity.text);
        await stepContext.context.sendActivity(qnaResponse.answers[0].answer);
        const introActions = CardFactory.actions([strings.general.yes, strings.general.no]);
        return await stepContext.prompt(TEXT_PROMPT, MessageFactory
            .suggestedActions(introActions, strings.faq.was_this_useful));
    }

    public async wasThisUsefulStep(stepContext:WaterfallStepContext){
        if ((stepContext.result as string).toLowerCase() === strings.general.yes.toLowerCase()){
            await stepContext.prompt(TEXT_PROMPT, { prompt: strings.faq.thanks_for_feedback });
            return await stepContext.endDialog(); 
        }else{
            await stepContext.context.sendActivity(strings.faq.pose_differently);
            await stepContext.endDialog();
            return await stepContext.beginDialog(this.id);
        }
    }

}

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardFactory, MessageFactory } from 'botbuilder';
import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import QNAMAkerClient from '../integrations/qnamaker/QNAMakerClient';
import { QNAMakerResponse } from '../integrations/qnamaker/QNAMakerContract';
import { CancelAndHelpDialog } from './cancelAndHelpDialog';
import strings from './strings';

const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';
const CONFIRM_PROMPT = 'confirmPrompt';

export class QNADialog extends CancelAndHelpDialog {
    private qnaMakerClient: QNAMAkerClient;
    constructor(id) {
        super(id || 'qnaDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.poseQuestionStep.bind(this),
                this.analyzeInputStep.bind(this),
                this.wasThisUsefulStep.bind(this),
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
        this.qnaMakerClient = new QNAMAkerClient(
            'e7a37184-6fa3-4fb7-ab34-b5dec25c8b85',
            '0692127a-c9b5-47c8-8b99-3851034e9fc2',
            'https://qnags1.azurewebsites.net',
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
            // await stepContext.endDialog();
            return await stepContext.replaceDialog(this.id, {accessor: this.accessor});
        }
    }

}

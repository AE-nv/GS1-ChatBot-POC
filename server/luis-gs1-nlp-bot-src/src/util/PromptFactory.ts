import { CardFactory, MessageFactory } from 'botbuilder';
import { DialogContext } from 'botbuilder-dialogs';

export function getChoicePrompt(stepContext: DialogContext, textPromptId:string, displayText:string, options:string[]){
    const introActions = CardFactory.actions(options);
    return stepContext.prompt(textPromptId, MessageFactory.suggestedActions(introActions, displayText));
}

export function getTextPrompt(stepContext: DialogContext, textPromptId:string , displayText:string){
    return stepContext.prompt(textPromptId,displayText);
}
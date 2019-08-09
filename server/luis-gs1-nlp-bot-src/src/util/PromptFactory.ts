import { CardFactory, MessageFactory } from 'botbuilder';
import { DialogContext, DialogTurnResult, WaterfallStepContext } from 'botbuilder-dialogs';

export function getChoicePrompt(stepContext: DialogContext, textPromptId:string, displayText:string, options:string[]){
    const introActions = CardFactory.actions(options);
    return stepContext.prompt(textPromptId, MessageFactory.suggestedActions(introActions, displayText));
}

export function getTextPrompt(stepContext: DialogContext, textPromptId:string , displayText:string){
    return stepContext.prompt(textPromptId,displayText);
}

export function getChoiceStep(textPromptId:string, displayText:string, options:string[]) : (stepContext: DialogContext) => Promise<DialogTurnResult> {
return (stepContext: DialogContext) => getChoicePrompt(stepContext,textPromptId,displayText,options);
}  

export function getTextStep(textPromptId:string, displayTest:string) {
    return (stepContext:WaterfallStepContext) => {getTextPrompt(stepContext,textPromptId,displayTest); return stepContext.next()}
}
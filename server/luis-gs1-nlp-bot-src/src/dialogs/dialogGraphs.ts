// export const testGraph: (textPromptId: string) => DialogGraph = (textPromptId: string) => new DialogGraph(
//     async (stepContext: WaterfallStepContext) => { await getTextPrompt(stepContext, textPromptId, 'TestPrompt'); return await stepContext.next() },
//     undefined,
//     (id) => new DialogGraph(
//         async (stepContext: WaterfallStepContext) => await getChoicePrompt(stepContext, id, 'TestChoices', [strings.general.no, strings.general.yes]),
//         undefined,
//         undefined,
//     )
//         .addNext(strings.general.no,
//             () => new DialogGraph(
//                 async (stepContext: WaterfallStepContext) => await getChoicePrompt(stepContext, id, 'TestChoices_no', [strings.general.no, strings.general.yes])
//             ))
//         .addNext(strings.general.yes,
//             () => new DialogGraph(
//                 async (stepContext: WaterfallStepContext) => await getChoicePrompt(stepContext, id, 'TestChoices_yes', [strings.general.no, strings.general.yes])
//             ))
// )
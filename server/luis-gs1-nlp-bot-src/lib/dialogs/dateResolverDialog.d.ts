import { CancelAndHelpDialog } from './cancelAndHelpDialog';
export declare class DateResolverDialog extends CancelAndHelpDialog {
    constructor(id: any);
    initialStep(stepContext: any): Promise<any>;
    finalStep(stepContext: any): Promise<any>;
    dateTimePromptValidator(promptContext: any): Promise<any>;
}

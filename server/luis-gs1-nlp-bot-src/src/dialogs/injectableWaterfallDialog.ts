import { WaterfallDialog, WaterfallStep } from 'botbuilder-dialogs';

export class InjectableWaterfallDialog extends WaterfallDialog {

    public injectStepAtIndex(step:WaterfallStep, index:number){
        (this.steps as WaterfallStep[]).splice(index,0,step);
    }

    public injectStepBeforeLast(step:WaterfallStep){
        this.injectStepAtIndex(step, (this.steps as WaterfallStep[]).length-1);
    }

}
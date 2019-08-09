import { WaterfallDialog, WaterfallStep, WaterfallStepContext } from 'botbuilder-dialogs';

import { CancelAndHelpDialog } from './cancelAndHelpDialog';

const GRAPH_WATERFALL = 'graphWaterFall'
export class GraphDialog extends CancelAndHelpDialog{
    private waterFallDialog : WaterfallDialog;
    private dialogGraph:DialogGraphNode | null;
    private initialGraph: DialogGraphNode;
    constructor(id){
        super(id || 'graphDialog');
        this.waterFallDialog = new WaterfallDialog(GRAPH_WATERFALL,
        [
            this.loopStep.bind(this)
        ]);
        this.addDialog(this.waterFallDialog);
        this.initialDialogId = GRAPH_WATERFALL;
    }

    public initGraph(graph: DialogGraphNode){
        this.initialGraph = graph;
        this.dialogGraph = graph;
    }

    public async reloadStep(stepContext:WaterfallStepContext) {
        this.dialogGraph = this.dialogGraph.next(stepContext.result);
        console.log('reload-step')
        this.waterFallDialog.addStep(this.loopStep.bind(this));
        return await stepContext.continueDialog();
    }

    public async loopStep(stepContext: WaterfallStepContext) {
        if(this.dialogGraph){
            this.waterFallDialog
                .addStep(this.dialogGraph.step.bind(this))
                .addStep(this.reloadStep.bind(this));
        }else{
            this.dialogGraph = this.initialGraph;
            this.waterFallDialog.addStep(this.loopStep.bind(this));
            return await stepContext.endDialog();
        }
        return await stepContext.continueDialog();
    }
}

// tslint:disable-next-line: max-classes-per-file
export abstract class DialogGraphNode {
    // TODO in future: remove textpromptstring as dependency from dialoggraph
    constructor(public step: WaterfallStep, public nodeLabel: string = 'node',  protected defaultNext: DialogGraphNode = null){}

    public abstract next(input?: any): DialogGraphNode;

    public setDefault(dialogGraph: DialogGraphNode): this{
        this.defaultNext = dialogGraph;
        return this;
    }
}  

// tslint:disable-next-line: max-classes-per-file
export class ConditionalDialogGraphNode extends DialogGraphNode {
    public trueDialogNode: DialogGraphNode;
    public falseDialogNode: DialogGraphNode; 
    private condition: () => boolean;
    // constructor(public step: WaterfallStep, defaultNext: DialogGraphNode = null){
    //     super(step,defaultNext);
    // }

    public setTrueDialog(dialogNode: DialogGraphNode): this{
        this.trueDialogNode = dialogNode;
        return this;
    }

    public setFalseDialog(dialogNode:DialogGraphNode):this {
        this.falseDialogNode = dialogNode;
        return this;
    }

    public setCondition(condition: () => boolean) : this {
        this.condition = condition;
        return this;
    }

    public next(condition?: () => boolean):DialogGraphNode {
        if(condition){
            // console.log(`conditionalNode: true : ${this.nodeLabel}`)
            return condition() ? this.trueDialogNode : this.falseDialogNode;
        }else{
            // console.log(`conditionalNode: false : ${this.nodeLabel}`)
            return this.condition() ? this.trueDialogNode : this.falseDialogNode;
        }
    }
}

// tslint:disable-next-line: max-classes-per-file
export class AnswerDialogGraphNode extends DialogGraphNode{
    constructor(public step: WaterfallStep, public nodeLabel: string = 'node', private dialogDictionary: { [answers: string]: DialogGraphNode } = {}, defaultNext: DialogGraphNode = null) {
        super(step,nodeLabel, defaultNext);
    }

    public addNext(input: string, dialogGraph: DialogGraphNode): this {
        if (input) {
            this.dialogDictionary[input] = dialogGraph;
        }
        return this;
    }

    public next(input?: string): DialogGraphNode {
        const output = this.dialogDictionary[input];
        // console.log(`Next graphnode:${output ? output.nodeLabel : this.defaultNext && this.defaultNext.nodeLabel} --- coming from: ${this.nodeLabel}`);
        return output ? output : this.defaultNext;
    }

}

// // tslint:disable-next-line: max-classes-per-file
// export class ConditionalDialogGraph extends DialogGraph {
//     private trueDialog:DialogGraph;
//     private falseDialog: DialogGraph;
//     public addFalseDialog(dialogGraph: DialogGraph): this {
//         this.falseDialog = dialogGraph;
//         return this;
//     }

//     public addTrueDialog(dialogGraph: DialogGraph): this {
//         this.trueDialog = dialogGraph;
//         return this;
//     }

//     public nextDialog(bool: boolean){
//         return bool? this.trueDialog: this.falseDialog;
//     }
// }

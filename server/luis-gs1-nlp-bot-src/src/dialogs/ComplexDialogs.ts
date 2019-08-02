import { DialogTurnResult } from 'botbuilder-dialogs';

import strings from './strings';

export class ComplexDialog  {
    private DEFAULT_NEXT_KEY:string = 'irezerd-g-fg-h--gh-h-fgfffhàç(ç(((d';
    private dialogTurnResult: Promise<DialogTurnResult>
    constructor(public dialogText: string, private options:{[answers:string]: ComplexDialog} = {}){}

    public getNext(answer?:string): ComplexDialog{
        return this.options[answer] ? this.options[answer] : (this.options[this.DEFAULT_NEXT_KEY] ? this.options[this.DEFAULT_NEXT_KEY] : null);
    }

    public get getPossibleAnswers(): string[]{
        const strippedObj = this.options;
        delete strippedObj[this.DEFAULT_NEXT_KEY];
        return Object.keys(strippedObj);
    }

    public addOption(answer:string | undefined , dialog:ComplexDialog): ComplexDialog{
        const key = answer? answer : this.DEFAULT_NEXT_KEY;
        this.options[key] = dialog;
        return this;
    }

}

export const prefixChoiceDialog: ComplexDialog = 
    new ComplexDialog(strings.gtin.for_cd)
    .addOption(strings.gtin.possible_answers.other, 
            new ComplexDialog(strings.gtin.need_prefix)
            .addOption( undefined,
                new ComplexDialog(strings.gtin.is_revenue_correct('5 miljard'))
                .addOption(strings.general.yes,new ComplexDialog('test'))));
    
    
    
    
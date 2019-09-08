import { TextPrompt, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';

import { getChoicePrompt, getTextPrompt } from '../../util/PromptFactory';
import { AccountDialog } from '../accountDialogs/accountDialog';
import { CancelAndHelpDialog } from '../cancelAndHelpDialog';
import strings from '../strings';
import { GS1DialogState } from '../userDetails';
import { AddToExistingPrefixDialog } from './addToExistingDialog';
import { PrefixChoiceDialog } from './prefixChoiceDialog';

const ACCOUNT_DIALOG: string = 'accountDialog';
const PREFIX_TEXT_PROMPT: string =  'gtinExistingPrefixTextPrompt';
const PREFIX_CHOICE_DIALOG = 'gtinChoosePrefixDialog';
const ADD_TO_EXISTING_PREFIX_DIALOG = 'addToExistingPrefixDialog';

export class NeedGtinDialog extends CancelAndHelpDialog {
    private readonly GTIN_WATERFALL_DIALOG = 'gtinWaterfallDialog';

    constructor(id){
        super(id || 'needGtinDialog');
        // this.graphD = new GraphDialog(PREFIX_CHOICE_DIALOG);
        this
        .addDialog(new WaterfallDialog(this.GTIN_WATERFALL_DIALOG, [
            this.checkIfNewUserStep.bind(this),
            this.checkLoggedInStep.bind(this),
            this.checkValidPrefixStep.bind(this),
            this.processPrefixStep.bind(this),
            this.prefixDeterminesNrOfGtinsStep.bind(this),
            this.howMuchTradeUnitsStep.bind(this),
            this.processNrOfTradeUnitsStep.bind(this),
            this.processPrefixChoiceStep.bind(this),
            this.finalStep.bind(this)
        ]))
        .addDialog(new AddToExistingPrefixDialog(ADD_TO_EXISTING_PREFIX_DIALOG))
        .addDialog(new PrefixChoiceDialog(PREFIX_CHOICE_DIALOG))
        .addDialog(new AccountDialog(ACCOUNT_DIALOG))
        .addDialog(new TextPrompt(PREFIX_TEXT_PROMPT));

        // this.connectGraph();
        
        this.initialDialogId = this.GTIN_WATERFALL_DIALOG;
    }

    // private connectGraph(){
    //     this.revenueKnownDialog.setFalseDialog(this.giveRevenueDialog);
    //     this.revenueKnownDialog.setTrueDialog(this.revenueCorrectDialog);
    // }

    private async checkIfNewUserStep(stepContext:WaterfallStepContext){
        const userDetails: GS1DialogState = await this.getUserState(stepContext.context);
        if (userDetails.newUser && userDetails.newUser === true){
            await stepContext.context.sendActivity(strings.main.new_user_documents);
        }
        // await stepContext.context.sendActivity(strings.account.need_to_be_logged_in);
        return await stepContext.next();
    }

    private async checkLoggedInStep(stepContext: WaterfallStepContext){
        const userDetails: GS1DialogState = await this.getUserState(stepContext.context);

        if(userDetails && (!userDetails.loggedIn || userDetails.loggedIn !== true)) {
            return await stepContext.beginDialog(ACCOUNT_DIALOG, { accessor: this.accessor });
        }

        return await stepContext.next()

    }

    private async checkValidPrefixStep(stepContext:WaterfallStepContext){
        const userDetails: GS1DialogState = await this.getUserState(stepContext.context);
        if (!userDetails.validPrefixes || userDetails.validPrefixes.length === 0) {
            return await stepContext.beginDialog(PREFIX_CHOICE_DIALOG, { accessor: this.accessor });
        } else {
            // HAS VALID PREFIX --> ASK TO ADD OR CREATE NEW
            return await stepContext.beginDialog(ADD_TO_EXISTING_PREFIX_DIALOG, { accessor: this.accessor });
            // return await stepContext.cancelAllDialogs();
        }
    }

    private async processPrefixStep(stepContext:WaterfallStepContext) {
        // tslint:disable-next-line: no-string-literal
        const answerOfUser = stepContext.result;
        const userDetails = await this.getUserState(stepContext.context);
        // ADD TO EXISTING PREFIX?
        console.log(answerOfUser);
        if(answerOfUser === strings.general.no){
            return await stepContext.beginDialog(PREFIX_CHOICE_DIALOG, { accessor: this.accessor });
        }
        else if (userDetails.validPrefixes && userDetails.validPrefixes.find(prefix => prefix === answerOfUser)){
            return await stepContext.cancelAllDialogs();
        } else if (stepContext.result && stepContext.result.meta === 'userChoseSpecialOffer') {
            return await stepContext.cancelAllDialogs();
        }
        return await stepContext.next();
    }

    private async prefixDeterminesNrOfGtinsStep(stepContext: WaterfallStepContext) {
        await getTextPrompt(stepContext,PREFIX_TEXT_PROMPT,strings.gtin.prefix_determines_gtins);
        return await stepContext.next();
    }

    private async howMuchTradeUnitsStep(stepContext:WaterfallStepContext){
        return await getTextPrompt(stepContext,PREFIX_TEXT_PROMPT, strings.gtin.how_many_trade_units)
    }

    private async processNrOfTradeUnitsStep(stepContext:WaterfallStepContext){
        const nrOfUnits:number = stepContext.result;
          const userDetails = await this.getUserState(stepContext.context);
        const suggestedPrefixes = this.calcPrefix(nrOfUnits, Number.parseInt(userDetails.revenue));
        userDetails.suggestedPrefixes = suggestedPrefixes;
        console.log(suggestedPrefixes);
        return await getChoicePrompt(stepContext,PREFIX_TEXT_PROMPT,strings.gtin.recommend_these_prefixes(suggestedPrefixes),suggestedPrefixes.map(s => s.Prefix1));
    }
    
    private async processPrefixChoiceStep(stepContext:WaterfallStepContext){
          const userDetails = await this.getUserState(stepContext.context);
        const answerOfUser = stepContext.result;
        const selectedPrefix = userDetails.suggestedPrefixes && userDetails.suggestedPrefixes.find(s => s.Prefix1 === answerOfUser);
        let link = '';
        console.log(answerOfUser);
        console.log(userDetails.suggestedPrefixes);
        if(selectedPrefix){
            link= selectedPrefix.L1
        }
        console.log(answerOfUser);
        await getTextPrompt(stepContext,PREFIX_TEXT_PROMPT,strings.gtin.u_chose_prefix_x(answerOfUser,link));
        return await stepContext.next();
    }
    
    private async finalStep(stepContext:WaterfallStepContext){
        return await stepContext.endDialog();
    }
    
        private calcPrefix(units: number, revenue: number) {
            if( units < 11 ){ 
                if( revenue < 50){ 
                return [
                    {Prefix1:'lengte 11', Aantal1:10, YearlyF1:55, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/CF0BB86C-90CB-E811-A839-000D3AB48443'},
                    {Prefix1 :'lengte 10', Aantal1:100, YearlyF1:125, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'}
                ] 
            }
                if( revenue < 250){ 
            return [

                {Prefix1:'lengte 11', Aantal1:10, YearlyF1:55, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/CF0BB86C-90CB-E811-A839-000D3AB48443'},
            {Prefix1 :'lengte 10', Aantal1:100, YearlyF1:189, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'}
            ] }
                if( revenue < 1000){
            return [
            {Prefix1:'lengte 11', Aantal1:10, YearlyF1:55, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/CF0BB86C-90CB-E811-A839-000D3AB48443'},
            {Prefix1 :'lengte 10', Aantal1:100, YearlyF1:220, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'}
            ] }
                if( revenue < 2500){
            return [
            {Prefix1:'lengte 11', Aantal1:10, YearlyF1:55, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/CF0BB86C-90CB-E811-A839-000D3AB48443'},
            {Prefix1 :'lengte 10', Aantal1:100, YearlyF1:246, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'}
            ] }
                if( revenue < 6000){
            return [
            {Prefix1:'lengte 10', Aantal1:100, YearlyF1:476, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'},
            {Prefix1 :'lengte 9', Aantal1:1.000, YearlyF1:476, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'}
            ] }
                if( revenue < 12000){
            return [
            {Prefix1:'lengte 10', Aantal1:100, YearlyF1:798, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'},
            {Prefix1 :'lengte 9', Aantal1:1.000, YearlyF1:798, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'}
            ] }
                if( revenue < 25000){
            return [
            {Prefix1:'lengte 10', Aantal1:100, YearlyF1:983, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'},
            {Prefix1 :'lengte 9', Aantal1:1.000, YearlyF1:983, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'}
            ] }
                if( revenue < 125000){
            return [
            {Prefix1:'lengte 10', Aantal1:100, YearlyF1:1433, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'},
            {Prefix1 :'lengte 9', Aantal1:1.000, YearlyF1:1433, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'}
            ] }
                if( revenue < 500000){
            return [
            {Prefix1:'lengte 10', Aantal1:100, YearlyF1:2047, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'},
            {Prefix1 :'lengte 9', Aantal1:1.000, YearlyF1:2047, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'}
            ] }
            return [
            {Prefix1:'lengte 10', Aantal1:100, YearlyF1:2559, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'},
            {Prefix1 :'lengte 9', Aantal1:1.000, YearlyF1:2559, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'}
            ]
}
if( units < 101 ){
	if( revenue < 50){ 
return [
{Prefix1:'lengte 10', Aantal1:100, YearlyF1:125, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'},
{Prefix1 :'lengte 9', Aantal1:1.000, YearlyF1:125, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 250){ 
return [
{Prefix1:'lengte 10', Aantal1:100, YearlyF1:189, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'},
{Prefix1 :'lengte 9', Aantal1:1.000, YearlyF1:189, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 1000){ 
return [
{Prefix1:'lengte 10', Aantal1:100, YearlyF1:220, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'},
{Prefix1 :'lengte 9', Aantal1:1.000, YearlyF1:220, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 2500){ 
return [
{Prefix1:'lengte 10', Aantal1:100, YearlyF1:246, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'},
{Prefix1 :'lengte 9', Aantal1:1.000, YearlyF1:246, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 6000){ 
return [
{Prefix1:'lengte 10', Aantal1:100, YearlyF1:476, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'},
{Prefix1 :'lengte 9', Aantal1:1.000, YearlyF1:476, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 12000){ 
return [
{Prefix1:'lengte 10', Aantal1:100, YearlyF1:798, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'},
{Prefix1 :'lengte 9', Aantal1:1.000, YearlyF1:798, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 25000){ 
return [
{Prefix1:'lengte 10', Aantal1:100, YearlyF1:983, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'},
{Prefix1 :'lengte 9', Aantal1:1.000, YearlyF1:983, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 125000){ 
return [
{Prefix1:'lengte 10', Aantal1:100, YearlyF1:1433, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'},
{Prefix1 :'lengte 9', Aantal1:1.000, YearlyF1:1433, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 500000){ 
return [
{Prefix1:'lengte 10', Aantal1:100, YearlyF1:2047, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'},
{Prefix1 :'lengte 9', Aantal1:1.000, YearlyF1:2047, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'}
] }
return [
{Prefix1:'lengte 10', Aantal1:100, YearlyF1:2559, JoiningF1:0, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/5FF09961-DD77-E511-9400-0050568F2F51'},
{Prefix1 :'lengte 9', Aantal1:1.000, YearlyF1:2559, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'}
]
}

if( units <  1001 ){
	if( revenue < 50) { 
return [
{Prefix1:'lengte 9', Aantal1:1.000, YearlyF1:125, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 8', Aantal1:10.000, YearlyF1:125, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 250) { 
return [
{Prefix1:'lengte 9', Aantal1:1.000, YearlyF1:189, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 8', Aantal1:10.000, YearlyF1:189, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 1000) { 
return [
{Prefix1:'lengte 9', Aantal1:1.000, YearlyF1:220, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 8', Aantal1:10.000, YearlyF1:220, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 2500) { 
return [
{Prefix1:'lengte 9', Aantal1:1.000, YearlyF1:246, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 8', Aantal1:10.000, YearlyF1:246, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 6000){  
return [
{Prefix1:'lengte 9', Aantal1:1.000, YearlyF1:476, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 8', Aantal1:10.000, YearlyF1:476, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 12000){ 
return [
{Prefix1:'lengte 9', Aantal1:1.000, YearlyF1:798, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 8', Aantal1:10.000, YearlyF1:798, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 25000){ 
return [
{Prefix1:'lengte 9', Aantal1:1.000, YearlyF1:983, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 8', Aantal1:10.000, YearlyF1:983, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 125000){ 
return [
{Prefix1:'lengte 9', Aantal1:1.000, YearlyF1:1433, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 8', Aantal1:10.000, YearlyF1:1433, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 500000){ 
return [
{Prefix1:'lengte 9', Aantal1:1.000, YearlyF1:2047, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 8', Aantal1:10.000, YearlyF1:2047, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'}
] }
return [
{Prefix1:'lengte 9', Aantal1:1.000, YearlyF1:2559, JoiningF1:600, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/2B36BFA3-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 8', Aantal1:10.000, YearlyF1:2559, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'}
]
}

if( units < 10001 ){
	if( revenue < 50) { 
return [
{Prefix1:'lengte 8', Aantal1:10.000, YearlyF1:125, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 7', Aantal1:100.000, YearlyF1:125, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 250) { 
return [
{Prefix1:'lengte 8', Aantal1:10.000, YearlyF1:189, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 7', Aantal1:100.000, YearlyF1:189, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 1000) { 
return [
{Prefix1:'lengte 8', Aantal1:10.000, YearlyF1:220, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 7', Aantal1:100.000, YearlyF1:220, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 2500) { 
return [
{Prefix1:'lengte 8', Aantal1:10.000, YearlyF1:246, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 7', Aantal1:100.000, YearlyF1:246, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 6000) { 
return [
{Prefix1:'lengte 8', Aantal1:10.000, YearlyF1:476, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 7', Aantal1:100.000, YearlyF1:476, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 12000) { 
return [
{Prefix1:'lengte 8', Aantal1:10.000, YearlyF1:798, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 7', Aantal1:100.000, YearlyF1:798, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 25000) { 
return [
{Prefix1:'lengte 8', Aantal1:10.000, YearlyF1:983, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 7', Aantal1:100.000, YearlyF1:983, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 125000) { 
return [
{Prefix1:'lengte 8', Aantal1:10.000, YearlyF1:1433, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 7', Aantal1:100.000, YearlyF1:1433, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 500000) { 
return [
{Prefix1:'lengte 8', Aantal1:10.000, YearlyF1:2047, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 7', Aantal1:100.000, YearlyF1:2047, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
return [
{Prefix1:'lengte 8', Aantal1:10.000, YearlyF1:2559, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/BC73BF80-451B-E511-93FB-0050568F2F51'},
{Prefix1 :'lengte 7', Aantal1:100.000, YearlyF1:2559, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
]
}

if( units < 100001 ){
	if( revenue < 50) { 
return [
{Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:125, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 250) { 
return [
{Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:189, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 1000) { 
return [
{Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:220, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 2500) { 
return [
{Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:246, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 6000) { 
return [
{Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:476, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 12000) { 
return [
{Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:798, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 25000) { 
return [
{Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:983, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 125000) { 
return [
{Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:1433, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 500000) { 
return [
{Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:2047, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
return [
{Prefix1:'lengte 8', Aantal1:10.000, YearlyF1:2559, JoiningF1:1.000, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
]
}
if( units > 100000 ){
	if( revenue < 50) { 
return [
    {Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:125, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 250) { 
return [
    {Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:189, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 1000) { 
return [
    {Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:220, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 2500) { 
return [
    {Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:246, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 6000) { 
return [
    {Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:476, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 12000) { 
return [
    {Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:798, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 25000) { 
return [
    {Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:983, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 125000) { 
return [
    {Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:1433, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
	if( revenue < 500000) { 
return [
    {Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:2047, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
] }
return [
    {Prefix1:'lengte 7', Aantal1:100.000, YearlyF1:2559, JoiningF1:1250, L1:'HTTPS://WWW.GS1BELU.ORG/NL/EXTRANET/ACCOUNT/PRODUCTS/ORDER/PRODUCT/4EEF2163-451B-E511-93FB-0050568F2F51'}
]
}

}
}
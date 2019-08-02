import { DialogState } from 'botbuilder-dialogs';

export interface GS1DialogState extends DialogState {
    newUser?: boolean;
    loggedIn?:boolean;
    validPrefixes?: string[];
}

export enum GS1DialogStateMembers {
    newUser='newUser',
    loggedIn='loggedIn',
    validPrefixes='validPrefixes'
}

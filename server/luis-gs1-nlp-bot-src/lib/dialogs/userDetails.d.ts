import { DialogState } from 'botbuilder-dialogs';
export interface GS1DialogState extends DialogState {
    newUser?: boolean;
    loggedIn?: boolean;
    validPrefixes?: string[];
    suggestedPrefixes?: Array<{
        Prefix1: string;
        L1: string;
    }>;
    revenue?: string;
}
export declare enum GS1DialogStateMembers {
    newUser = "newUser",
    loggedIn = "loggedIn",
    validPrefixes = "validPrefixes"
}

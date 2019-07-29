import { ComponentDialog } from 'botbuilder-dialogs';
export declare class MainDialog extends ComponentDialog {
    private luisRecognizer;
    constructor(luisRecognizer: any, bookingDialog: any);
    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    run(turnContext: any, accessor: any): Promise<void>;
    /**
     * First step in the waterfall dialog. Prompts the user for a command.
     * Currently, this expects a booking request, like "book me a flight from Paris to Berlin on march 22"
     * Note that the sample LUIS model will only recognize Paris, Berlin, New York and London as airport cities.
     */
    introStep(stepContext: any): Promise<any>;
    /**
     * Second step in the waterfall.  This will use LUIS to attempt to extract the origin, destination and travel dates.
     * Then, it hands off to the bookingDialog child dialog to collect any remaining details.
     */
    actStep(stepContext: any): Promise<any>;
    /**
     * Shows a warning if the requested From or To cities are recognized as entities but they are not in the Airport entity list.
     * In some cases LUIS will recognize the From and To composite entities as a valid cities but the From and To Airport values
     * will be empty if those entity values can't be mapped to a canonical item in the Airport.
     */
    showWarningForUnsupportedCities(context: any, fromEntities: any, toEntities: any): Promise<void>;
    /**
     * This is the final step in the main waterfall dialog.
     * It wraps up the sample "book a flight" interaction with a simple confirmation.
     */
    finalStep(stepContext: any): Promise<any>;
}

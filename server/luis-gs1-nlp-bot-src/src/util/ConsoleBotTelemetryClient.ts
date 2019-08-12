import { NullTelemetryClient, TelemetryEvent } from 'botbuilder';

export class ConsoleLogTelemetryClient extends NullTelemetryClient{
    public trackEvent(telemetryEvent: TelemetryEvent){
        const dID = telemetryEvent.properties.DialogId;
        const stepName = telemetryEvent.properties.StepName || '??';
        console.log(`${telemetryEvent.name} --> id: ${dID} --> step: ${stepName}`);
        // console.log('-----------------------------------------------------------------------');
        // console.log(`tm:  ${telemetryEvent.name} :: ${telemetryEvent.properties.DialogId}`);
    }
}
import { NullTelemetryClient, TelemetryEvent } from 'botbuilder';

export class ConsoleLogTelemetryClient extends NullTelemetryClient{
    public trackEvent(telemetryEvent: TelemetryEvent){
        // console.log(telemetryEvent);
        // console.log('-----------------------------------------------------------------------');
        // console.log(`tm:  ${telemetryEvent.name} :: ${telemetryEvent.properties.DialogId}`);
    }
}
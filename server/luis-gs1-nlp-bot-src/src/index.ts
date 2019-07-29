// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BotFrameworkAdapter, ConversationState, MemoryStorage, UserState } from 'botbuilder';
import { LuisApplication } from 'botbuilder-ai';
import { config } from 'dotenv';
import * as path from 'path';
import * as restify from 'restify';

import { DialogAndWelcomeBot } from './bots/dialogAndWelcomeBot';
import { FlightBookingRecognizer } from './dialogs/flightBookingRecognizer';
import { GS1QNAContextRecognizer } from './dialogs/GS1QNAContextRecognizer';
import { MainDialog } from './dialogs/mainDialog';
import { QNADialog } from './dialogs/qnaDialog';

// Import required bot services. // See https://aka.ms/bot-services to learn more about the different parts of a bot.
// The bot and its main dialog.
const BOOKING_DIALOG = 'faqDialog';
const QNA_DIALOG = 'qnaDialog';

// The helper-class recognizer that calls LUIS
// Note: Ensure you have a .env file and include LuisAppId, LuisAPIKey and LuisAPIHostName.
const ENV_FILE = path.join(__dirname, '..', '.env');
config({ path: ENV_FILE });

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppID,
    appPassword: process.env.MicrosoftAppPassword
});

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError]: ${error}`);
    // Send a message to the user
    await context.sendActivity(`Oops. Something went wrong!`);
    // Clear out state
    await conversationState.delete(context);
};

// Define a state store for your bot. See https://aka.ms/about-bot-state to learn more about using MemoryStorage.
// A bot requires a state store to persist the dialog and user state between messages.
let conversationState: ConversationState;
let userState: UserState;

// For local development, in-memory storage is used.
// CAUTION: The Memory Storage used here is for local bot debugging only. When the bot
// is restarted, anything stored in memory will be gone.
const memoryStorage = new MemoryStorage();
conversationState = new ConversationState(memoryStorage);
userState = new UserState(memoryStorage);


const { MainLuisAppId, MainLuisAPIKey, MainLuisAPIHostName, QNALuisAppId, QNALuisAPIKey, QNALuisAPIHostName,  } = process.env;
console.log(MainLuisAppId, MainLuisAPIKey, MainLuisAPIHostName);
const mainLuisConfig: LuisApplication = { applicationId: MainLuisAppId, endpointKey: MainLuisAPIKey, endpoint: `https://${MainLuisAPIHostName}` };
const qnaLuisConfig: LuisApplication = { applicationId: QNALuisAppId, endpointKey: QNALuisAPIKey, endpoint: `https://${QNALuisAPIHostName}` };

const qnaFlowRecognizer = new GS1QNAContextRecognizer(qnaLuisConfig);
const mainLuisRecognizer = new FlightBookingRecognizer(mainLuisConfig);

// Create the main dialog.
const qnaDialog = new QNADialog(QNA_DIALOG,qnaFlowRecognizer);
const dialog = new MainDialog(mainLuisRecognizer, qnaFlowRecognizer, qnaDialog);
const bot = new DialogAndWelcomeBot(conversationState, userState, dialog);

// Create HTTP server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
    console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
    console.log(`\nTo test your bot, see: https://aka.ms/debug-with-emulator`);
});

// Listen for incoming activities and route them to your bot main dialog.
server.post('/api/messages', (req, res) => {
    // Route received a request to adapter for processing
    adapter.processActivity(req, res, async (turnContext) => {
        // route to bot activity handler.
        await bot.run(turnContext);
    });
});

import { Author } from './contract';

export interface ChatEntryData {
    chatEntryComponent: () => Promise<any>;
    componentProperties: {};
    author: Author;
    entryId: number;
}

export default class ChatEntryDataFactory {
    private idCount: number = 0;

    public getTextChatEntryData(
        author: Author,
        textMessage: string,
    ): ChatEntryData {
        return {
            chatEntryComponent: () =>
                import('../components/chat-entries/TextChatEntry.vue'),
            componentProperties: {
                isUserSide: !(author === Author.Bot),
                message: textMessage,
            },
            author: Author.User,
<<<<<<< HEAD
            entryId: this.getId(textMessage),
=======
            entryId: this.idCount++,
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
        };
    }

    public getYesNoButtonChatEntry(
        author: Author,
        textMessage: string = '',
    ): ChatEntryData {
        return {
            chatEntryComponent: () =>
                import('../components/chat-entries/YesNoButtonEntry.vue'),
            componentProperties: {
                isUserSide: !(author === Author.Bot),
                message: textMessage,
            },
            author: Author.User,
<<<<<<< HEAD
            entryId: this.getId(textMessage),
=======
            entryId: this.idCount++,
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
        };
    }

    public getMultipleChoiceChatEntry(
        author: Author,
<<<<<<< HEAD
        displayText: string,
=======
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
        possibleAnswers: string[],
    ) {
        return {
            chatEntryComponent: () =>
                import('../components/chat-entries/MultipleChoiceChatEntry.vue'),
            componentProperties: {
                isUserSide: !(author === Author.Bot),
<<<<<<< HEAD
                message: displayText,
                possibleAnswers,
            },
            author: Author.User,
            entryId: this.getId(displayText),
        };
    }

    private getId(extra: string): number {
        return Math.random() + extra.length;
    }
=======
                possibleAnswers,
            },
            author: Author.User,
            entryId: this.idCount++,
        };
    }
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
}

export const chatEntryDataFactory = new ChatEntryDataFactory();

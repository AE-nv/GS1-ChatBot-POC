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
            entryId: this.getId(textMessage),
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
            entryId: this.getId(textMessage),
        };
    }

    public getMultipleChoiceChatEntry(
        author: Author,
        displayText: string,
        possibleAnswers: string[],
    ) {
        return {
            chatEntryComponent: () =>
                import('../components/chat-entries/MultipleChoiceChatEntry.vue'),
            componentProperties: {
                isUserSide: !(author === Author.Bot),
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
}

export const chatEntryDataFactory = new ChatEntryDataFactory();

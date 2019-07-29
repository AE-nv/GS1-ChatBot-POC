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
            entryId: this.idCount++,
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
            entryId: this.idCount++,
        };
    }

    public getMultipleChoiceChatEntry(
        author: Author,
        possibleAnswers: string[],
    ) {
        return {
            chatEntryComponent: () =>
                import('../components/chat-entries/MultipleChoiceChatEntry.vue'),
            componentProperties: {
                isUserSide: !(author === Author.Bot),
                possibleAnswers,
            },
            author: Author.User,
            entryId: this.idCount++,
        };
    }
}

export const chatEntryDataFactory = new ChatEntryDataFactory();

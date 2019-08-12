import { ChatEntryData, chatEntryDataFactory } from './ChatEntryData';
import { Author } from './contract';
import strings from './strings';

export class ChatNode {
    private nextNodes: Array<Pair<ChatVertex, ChatNode>> = [];
    constructor(
        private chatEntry: ChatEntryData,
        public defaultNext: ChatNode | null = null,
        private sideEffect: () => void = () => {
            return;
        },
        public isBlocking: boolean = true,
    ) {}

    public addNext(answer: ChatVertex, node: ChatNode): this {
        const existingLink = this.nextNodes.find(pair =>
            pair.key.equals(answer),
        );
        if (existingLink) {
            // do nothing for now // TODO
        } else {
            this.nextNodes.push(new Pair(answer, node));
        }
        return this;
    }

    public setDefault(node: ChatNode): this {
        this.defaultNext = node;
        return this;
    }

    public next(vertex: ChatVertex): ChatNode | null {
        const pair = this.nextNodes.find(p => p.key.equals(vertex));
        console.log(pair);
        return (pair && pair.value) || this.defaultNext;
    }

    public getChatEntry(): ChatEntryData {
        this.sideEffect();
        return this.chatEntry;
    }

    public setSideEffect(func: () => void): this {
        this.sideEffect = func;
        return this;
    }

    public setIsBlocking(blocking: boolean): this {
        this.isBlocking = blocking;
        return this;
    }
}

// tslint:disable-next-line: max-classes-per-file
export class ChatVertex {
    constructor(public label: string) {}

    public equals(vertex: ChatVertex): boolean {
        return this.label === vertex.label;
    }
}

// tslint:disable-next-line: max-classes-per-file
class Pair<K, V> {
    constructor(public key: K, public value: V) {}
}

export const testDialog = new ChatNode(
    chatEntryDataFactory.getYesNoButtonChatEntry(Author.Bot, 'test'),
).addNext(
    new ChatVertex('Ja'),
    new ChatNode(chatEntryDataFactory.getTextChatEntryData(Author.Bot, 'test')),
);

export interface UserDetails {
    isNewUser?: boolean;
    userInput?: string;
}

export const userDetails: UserDetails = {};

const generalQuestionDialog = new ChatNode(
    chatEntryDataFactory.getTextChatEntryData(
        Author.Bot,
        strings.faq.pose_question,
    ),
);

const helpPossibilitiesDialog = new ChatNode(
    chatEntryDataFactory.getMultipleChoiceChatEntry(
        Author.Bot,
        strings.main.help.what_can_i_do,
        [
            strings.main.help.possibilities.general_question,
            strings.main.help.possibilities.need_gtin,
            strings.main.help.possibilities.need_lei,
        ],
    ),
).addNext(
    new ChatVertex(strings.main.help.possibilities.general_question),
    generalQuestionDialog,
);

export const mainDialog = new ChatNode(
    chatEntryDataFactory.getTextChatEntryData(
        Author.Bot,
        strings.main.welcome.introduction,
    ),
)
    .setIsBlocking(false)
    .setDefault(
        new ChatNode(
            chatEntryDataFactory.getYesNoButtonChatEntry(
                Author.Bot,
                strings.main.new_user,
            ),
        )
            .addNext(
                new ChatVertex(strings.general.yes),
                helpPossibilitiesDialog.setSideEffect(
                    () => (userDetails.isNewUser = true),
                ),
            )
            .addNext(
                new ChatVertex(strings.general.no),
                helpPossibilitiesDialog.setSideEffect(
                    () => (userDetails.isNewUser = false),
                ),
            ),
    );

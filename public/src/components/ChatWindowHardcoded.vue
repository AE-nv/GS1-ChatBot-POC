<template>
  <div
    class="bot__frame d-flex justify-content-center"
    :class="{'bot__frame--inactive':!active, 'bot__frame--active':active}"
  >
    <!-- Inactive -->
    <div
      v-show="!active && !chatTransitioning"
      class="d-flex-uninmportant justify-content-center"
      @click="openChat()"
    >
      <img
        class="h-100 w-auto"
        src="../assets/GS1_Corporate_logo.png"
      >
    </div>
    <!-- Active -->
    <div
      v-show="active && !chatTransitioning"
      class="d-flex-uninmportant flex-column w-100"
    >
      <div class="bot__header d-flex">
        <div class="col-2 d-flex justify-content-center p-1">
          <img
            class="h-100 w-auto"
            src="../assets/GS1_Corporate_logo.png"
          />
        </div>
        <div class="col-8 d-flex align-items-center">
          <span class="bot__header__title">{{chatWindowTitle}} {{userDetails}}</span>
        </div>
        <div
          @click="closeChat()"
          class="col-2 d-flex m-auto justify-content-center"
        >
          <font-awesome-icon
            class="text-white clickable"
            icon="times"
          />
        </div>
      </div>
      <div
        ref="chatContent"
        class="bot__content px-3 flex-grow-1 py-2"
      >

        <component
          v-for="entry in chatEntries"
          :is="entry.chatEntryComponent"
          :key="entry.entryId"
          class="mb-4"
          v-bind="entry.componentProperties"
          @chatEntryEvent="handleChatEntryEvent"
        />

        <SyncLoader
          class="my-4"
          v-if="botIsThinking"
        />
      </div>
      <div
        class="bot__footer d-flex align-items-center"
        :class="{'disabled':botIsThinking}"
      >
        <b-input
          v-model="currentInput"
          :disabled="botIsThinking"
          @keyup.native.enter="sendMessage"
          class="bot__footer__input h-100"
        ></b-input>
        <font-awesome-icon
          @click="sendMessage"
          class="fa-btn fa-btn--accent fa-2x mr-4 clickable"
          icon="paper-plane"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { DirectLine, IActivity, Message } from 'botframework-directlinejs';
import ChatEntry from './ChatEntry.vue';
import { Author } from '../shared/contract';
import SyncLoader from 'vue-spinner/src/SyncLoader.vue';
import YesNoButtonEntry from './chat-entries/YesNoButtonEntry.vue';
import { ChatEntryEvent } from './chat-entries/ChatEntryEvents';
import { ChatEntryData, chatEntryDataFactory } from '../shared/ChatEntryData';
import TextChatEntry from './chat-entries/TextChatEntry.vue';
import MultipleChoiceChatEntry from './chat-entries/MultipleChoiceChatEntry.vue';
import QNAMAkerClient from '../shared/integrations/qnamaker/QNAMakerClient';
import { QNAMakerResponse } from '../shared/integrations/qnamaker/QNAMakerContract';
import {
    ChatNode,
    testDialog,
    ChatVertex,
    userDetails,
    mainDialog,
} from '../shared/ChatGraph';

@Component({
    components: {
        ChatEntry,
        SyncLoader,
        YesNoButtonEntry,
        TextChatEntry,
        MultipleChoiceChatEntry,
    },
})
export default class ChatWindow extends Vue {
    @Prop({ default: 'GS1Bot' }) public chatWindowTitle!: string;
    @Prop() public active!: boolean;

    public botIsThinking: boolean = false;

    public currentInput: string = '';
    public userDetails = userDetails;
    public chatEntries: ChatEntryData[] = [];
    public chatTransitioning: boolean = false;
    public transitionDelay: number = 300; // milliseconds;

    private qnaMakerClient: QNAMAkerClient;
    private originalDialog: ChatNode = mainDialog;
    private chatGraph: ChatNode | null = this.originalDialog;
    private readonly userName: string = 'pieter';
    private readonly userId: string = 'pieter';
    private readonly botId: string = 'luis-gs1-nlp-bot';

    constructor() {
        super();
        this.qnaMakerClient = new QNAMAkerClient(
            '36677783-1246-4ab8-8ec5-197f0f829f5b',
            'cbde9f34-58cf-46d5-af76-975d99df84eb',
            'https://gs1-pocbot.azurewebsites.net',
        );
    }

    public async mounted() {
        if (this.chatGraph) {
            this.addMessage(this.chatGraph.getChatEntry());
        }
        while (this.chatGraph && !this.chatGraph.isBlocking) {
            this.chatGraph = this.chatGraph && this.chatGraph.defaultNext;
            if (this.chatGraph) {
                await this.addMessage(this.chatGraph.getChatEntry(), 1500);
            }
        }
    }

    public async handleChatEntryEvent(event: {
        event: ChatEntryEvent;
        value: string;
    }) {
        if (this.chatGraph) {
            this.chatGraph = this.chatGraph.next(new ChatVertex(event.value));
        } else {
            this.chatGraph = this.originalDialog;
        }
        this.currentInput = event.value;
        console.log(event.value);
        await this.sendMessage();
    }

    public async sendMessage() {
        if (!this.currentInput) {
            return;
        }
        await this.addMessage(
            chatEntryDataFactory.getTextChatEntryData(
                Author.User,
                this.currentInput,
            ),
        );
        this.botIsThinking = true;
        if (this.chatGraph) {
            await this.addMessage(this.chatGraph.getChatEntry(), 1500);
            while (this.chatGraph && !this.chatGraph.isBlocking) {
                this.chatGraph = this.chatGraph && this.chatGraph.defaultNext;
                if (this.chatGraph) {
                    await this.addMessage(this.chatGraph.getChatEntry(), 1500);
                }
            }
        }
        this.botIsThinking = false;
        this.currentInput = '';
    }

    @Emit('open')
    public openChat() {
        if (this.active) {
            this.chatTransitioning = true;
            setTimeout(() => {
                this.chatTransitioning = false;
            }, this.transitionDelay);
        }
    }

    public isUser(author: Author): boolean {
        return author === Author.User;
    }

    @Emit('close')
    public closeChat() {
        this.chatTransitioning = true;
        setTimeout(() => {
            this.chatTransitioning = false;
        }, this.transitionDelay);
    }

    public updated() {
        this.scrollDown();
    }

    private async parseMessage(message: IActivity) {
        console.log(message);
        const msg = message as Message;
        if (msg && msg.text) {
            if (
                msg.suggestedActions &&
                msg.suggestedActions.actions &&
                msg.suggestedActions.actions.length > 0
            ) {
                await this.addMessage(
                    chatEntryDataFactory.getMultipleChoiceChatEntry(
                        Author.Bot,
                        msg.text,
                        msg.suggestedActions.actions.map(
                            action => action.value,
                        ),
                    ),
                );
            } else {
                await this.addMessage(
                    chatEntryDataFactory.getTextChatEntryData(
                        Author.Bot,
                        msg.text || '',
                    ),
                );
            }
        }
        this.botIsThinking = false;
        this.scrollDown();
    }

    private async addMessage(chatMessage: ChatEntryData, timeOut?: number) {
        if (timeOut) {
            await new Promise(resolve => setTimeout(resolve, timeOut));
        }
        this.chatEntries = [...this.chatEntries, chatMessage];
        this.scrollDown();
    }

    // private async answer(question: string) {
    //     await this.addMessage(
    //         chatEntryDataFactory.getTextChatEntryData(
    //             Author.Bot,
    //             'Ik zoek het even voor je op',
    //         ),
    //     );

    //     const qnaResponse:
    //         | QNAMakerResponse
    //         | undefined = await this.qnaMakerClient.getAnswerForQuestion(
    //         question,
    //     );

    //     this.botIsThinking = false;
    //     await this.addMessage(
    //         chatEntryDataFactory.getTextChatEntryData(
    //             Author.Bot,
    //             (qnaResponse && qnaResponse.answers[0].answer) || '',
    //         ),
    //         1000,
    //     );
    //     await this.addMessage(
    //         chatEntryDataFactory.getYesNoButtonChatEntry(
    //             Author.Bot,
    //             'Was dit een antwoord op jouw vraag?',
    //         ),
    //         1000,
    //     );
    //     this.scrollDown();
    // }

    private scrollDown(): void {
        const chatContent = this.$refs.chatContent as HTMLDivElement;
        if (!chatContent) {
            return;
        }
        chatContent.scrollTop = chatContent.scrollHeight;
    }
}
</script>

<style lang="scss">
</style>
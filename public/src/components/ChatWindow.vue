<template>
  <div
    class="bot__frame d-flex justify-content-center"
    :class="{'bot__frame--inactive':!chatOpen, 'bot__frame--active':chatOpen}"
  >
    <!-- Inactive -->
    <div
      v-show="!chatOpen && !chatTransitioning"
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
      v-show="chatOpen && !chatTransitioning"
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
          <span class="bot__header__title">{{chatWindowTitle}}</span>
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
import { Component, Vue, Prop } from 'vue-property-decorator';
import { DirectLine } from 'botframework-directlinejs';
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

    public botIsThinking: boolean = false;

    public currentInput: string = '';

    public chatEntries: ChatEntryData[] = [];
    public chatOpen: boolean = true;
    public chatTransitioning: boolean = false;
    public transitionDelay: number = 300; // milliseconds;

    private qnaMakerClient: QNAMAkerClient;

    constructor() {
        super();
        this.qnaMakerClient = new QNAMAkerClient(
            '36677783-1246-4ab8-8ec5-197f0f829f5b',
            'cbde9f34-58cf-46d5-af76-975d99df84eb',
            'https://gs1-pocbot.azurewebsites.net',
        );
    }

    public mounted() {
        this.init();
    }

    public handleChatEntryEvent(event: ChatEntryEvent) {
        console.log(event);
    }

    public init() {
        this.addMessage(
            chatEntryDataFactory.getTextChatEntryData(
                Author.Bot,
                'Hallo beste gebruiker, Wat is je vraag?',
            ),
        );
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
        await this.answer(this.currentInput);
        this.currentInput = '';
    }

    public openChat() {
        this.chatTransitioning = true;
        this.chatOpen = true;
        setTimeout(() => {
            this.chatTransitioning = false;
        }, this.transitionDelay);
    }

    public isUser(author: Author): boolean {
        return author === Author.User;
    }

    public closeChat() {
        this.chatTransitioning = true;
        this.chatOpen = false;
        setTimeout(() => {
            this.chatTransitioning = false;
        }, this.transitionDelay);
    }

    public updated() {
        this.scrollDown();
    }

    private async addMessage(chatMessage: ChatEntryData, timeOut?: number) {
        if (timeOut) {
            await new Promise(resolve => setTimeout(resolve, timeOut));
        }
        this.chatEntries = [...this.chatEntries, chatMessage];
        this.scrollDown();
    }

    private async answer(question: string) {
        await this.addMessage(
            chatEntryDataFactory.getTextChatEntryData(
                Author.Bot,
                'Ik zoek het even voor je op',
            ),
        );
        this.botIsThinking = true;
        const qnaResponse:
            | QNAMakerResponse
            | undefined = await this.qnaMakerClient.getAnswerForQuestion(
            question,
        );

        this.botIsThinking = false;
        await this.addMessage(
            chatEntryDataFactory.getTextChatEntryData(
                Author.Bot,
                (qnaResponse && qnaResponse.answers[0].answer) || '',
            ),
            1000,
        );
        await this.addMessage(
            chatEntryDataFactory.getYesNoButtonChatEntry(
                Author.Bot,
                'Was dit een antwoord op jouw vraag?',
            ),
            1000,
        );
        this.scrollDown();
    }

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
.bot__frame {
    transition: all 400ms;
    transition-timing-function: ease-out;
    &--active {
        height: $height;
        width: $width;
        border-radius: $radius;
    }

    &--inactive {
        cursor: pointer;
        width: $sleeping-bot-size;
        height: $sleeping-bot-size;
        border-radius: 50%;
        padding: 0.25rem;
    }

    border: $thickness solid $background-color-dark;
    background-color: $background-color;
    box-shadow: $box-shadow;
}
.bot__header {
    height: $height * 0.1;
    background-color: $main-color;
    border-top-left-radius: $radius;
    border-top-right-radius: $radius;
    width: 100%;
    border-bottom: $divider-thickness solid $background-color-dark;
}

.bot__header__title {
    color: $text-color;
    font-size: $text-size-title;
}

.bot__content {
    overflow-y: auto;
    overflow-x: hidden;
}

.bot__footer {
    min-height: $height * 0.125;
    width: 100%;
    border-top: $divider-thickness solid $background-color-dark;
}

.bot__footer__input {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
}
</style>
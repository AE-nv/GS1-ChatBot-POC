<template>
  <div
    class="bot__frame d-flex justify-content-center"
<<<<<<< HEAD
    :class="{'bot__frame--inactive':!active, 'bot__frame--active':active}"
  >
    <!-- Inactive -->
    <div
      v-show="!active && !chatTransitioning"
      class="d-flex-uninmportant justify-content-center chat-bot--inactive"
=======
    :class="{'bot__frame--inactive':!chatOpen, 'bot__frame--active':chatOpen}"
  >
    <!-- Inactive -->
    <div
      v-show="!chatOpen && !chatTransitioning"
      class="d-flex-uninmportant justify-content-center"
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
      @click="openChat()"
    >
      <img
        class="h-100 w-auto"
<<<<<<< HEAD
        src="../assets/bot-icon.png"
=======
        src="../assets/GS1_Corporate_logo.png"
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
      >
    </div>
    <!-- Active -->
    <div
<<<<<<< HEAD
      v-show="active && !chatTransitioning"
      class="d-flex-uninmportant flex-column w-100"
    >
      <div class="bot__header d-flex">
        <div class="col-2 d-flex justify-content-center p-2">
          <img
            class="h-100 w-auto"
            src="../assets/GS1_Corporate_logo_inverted.png"
=======
      v-show="chatOpen && !chatTransitioning"
      class="d-flex-uninmportant flex-column w-100"
    >
      <div class="bot__header d-flex">
        <div class="col-2 d-flex justify-content-center p-1">
          <img
            class="h-100 w-auto"
            src="../assets/GS1_Corporate_logo.png"
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
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
<<<<<<< HEAD
        class="bot__content pl-4 pr-3 flex-grow-1 pb-2 pt-4"
      >
        <component
          v-for="entry in chatEntries"
          :is="entry.chatEntryComponent"
          :key="entry.entryId"
          class="mb-4"
          v-bind="entry.componentProperties"
          @chatEntryEvent="handleChatEntryEvent"
        />
=======
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
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend

        <SyncLoader
          class="my-4"
          v-if="botIsThinking"
        />
      </div>
      <div
<<<<<<< HEAD
        class="bot__footer p-3 d-flex align-items-center"
        :class="{'disabled':botIsThinking}"
      >
        <input
          v-model="currentInput"
          :disabled="botIsThinking"
          @keyup.enter="sendMessage"
          class="bot__footer__input h-100 flex-grow-1 px-2"
        />
        <div
          @click="sendMessage"
          class="d-flex align-items-center h-100 justify-content-center px-4 py-3 bot__footer__send-button clickable"
        >
          <font-awesome-icon
            class="fa-btn fa-btn--inverted clickable"
            icon="paper-plane"
          />
        </div>
=======
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
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
      </div>
    </div>
  </div>
</template>

<script lang="ts">
<<<<<<< HEAD
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { DirectLine, IActivity, Message } from 'botframework-directlinejs';
=======
import { Component, Vue, Prop } from 'vue-property-decorator';
import { DirectLine } from 'botframework-directlinejs';
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
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
<<<<<<< HEAD
    @Prop({ default: '' }) public chatWindowTitle!: string;
    @Prop() public active!: boolean;
=======
    @Prop({ default: 'GS1Bot' }) public chatWindowTitle!: string;
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend

    public botIsThinking: boolean = false;

    public currentInput: string = '';

    public chatEntries: ChatEntryData[] = [];
<<<<<<< HEAD
=======
    public chatOpen: boolean = true;
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
    public chatTransitioning: boolean = false;
    public transitionDelay: number = 300; // milliseconds;

    private qnaMakerClient: QNAMAkerClient;
<<<<<<< HEAD
    private directLine: DirectLine;
    private readonly userName: string = 'pieter';
    private readonly userId: string = 'pieter';
    private readonly botId: string = 'luis-gs1-nlp-bot';
=======
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend

    constructor() {
        super();
        this.qnaMakerClient = new QNAMAkerClient(
            '36677783-1246-4ab8-8ec5-197f0f829f5b',
            'cbde9f34-58cf-46d5-af76-975d99df84eb',
            'https://gs1-pocbot.azurewebsites.net',
        );
<<<<<<< HEAD
        this.directLine = new DirectLine({
            secret: 'XPq30oNItPs.lj6jLL1enuKHfV2_3ex_RGs7SFBhPhhSO6-2mJ1muXk',
        });
    }

    public mounted() {
        this.directLine.activity$
            .filter(
                activity =>
                    activity.type === 'message' &&
                    activity.from.id === this.botId,
            )
            .subscribe(message => {
                this.parseMessage(message);
            });
        this.directLine
            .postActivity({
                from: { id: this.userId, name: this.userName },
                type: 'event',
                name: 'startConversation',
                value: 'startConversation',
            })
            .subscribe();
    }

    public handleChatEntryEvent(event: {
        event: ChatEntryEvent;
        value: string;
    }) {
        console.log(event);
        if (event && event.event === ChatEntryEvent.MultipleChoiceClicked) {
            this.directLine
                .postActivity({
                    from: { id: this.userId, name: this.userName }, // required (from.name is optional)
                    type: 'message',
                    text: event.value,
                })
                .subscribe();
        }
=======
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
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
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
<<<<<<< HEAD
        this.botIsThinking = true;
        this.directLine
            .postActivity({
                from: { id: this.userId, name: this.userName }, // required (from.name is optional)
                type: 'message',
                text: this.currentInput,
            })
            .subscribe(id => console.log(id), error => console.log(error));
        this.currentInput = '';
    }

    @Emit('open')
    public openChat() {
        this.chatTransitioning = true;
=======
        await this.answer(this.currentInput);
        this.currentInput = '';
    }

    public openChat() {
        this.chatTransitioning = true;
        this.chatOpen = true;
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
        setTimeout(() => {
            this.chatTransitioning = false;
        }, this.transitionDelay);
    }

    public isUser(author: Author): boolean {
        return author === Author.User;
    }

<<<<<<< HEAD
    @Emit('close')
    public closeChat() {
        this.chatTransitioning = true;
=======
    public closeChat() {
        this.chatTransitioning = true;
        this.chatOpen = false;
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
        setTimeout(() => {
            this.chatTransitioning = false;
        }, this.transitionDelay);
    }

<<<<<<< HEAD
    @Watch('active')
    public transition() {
        if (this.active) {
            this.openChat();
        } else {
            this.closeChat();
        }
    }

=======
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
    public updated() {
        this.scrollDown();
    }

<<<<<<< HEAD
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

=======
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
    private async addMessage(chatMessage: ChatEntryData, timeOut?: number) {
        if (timeOut) {
            await new Promise(resolve => setTimeout(resolve, timeOut));
        }
        this.chatEntries = [...this.chatEntries, chatMessage];
        this.scrollDown();
    }

<<<<<<< HEAD
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
=======
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
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend

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
<<<<<<< HEAD
        height: 100%;
        width: 100%;
        right: 0;
        bottom: 0;
        border-radius: 0;

        @include media-breakpoint-up(sm) {
            height: $height;
            width: $width;
            border-radius: $radius;
        }
=======
        height: $height;
        width: $width;
        border-radius: $radius;
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
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
<<<<<<< HEAD
    max-height: $height * 0.125;
    width: 100%;
    border-top: $divider-thickness solid $background-color-dark;
    background-color: $input-field-background;
}

.bot__footer__send-button {
    background-color: $main-color;
    border-bottom-right-radius: $radius;
    border-top-right-radius: $radius;
    font-size: 1em;
=======
    width: 100%;
    border-top: $divider-thickness solid $background-color-dark;
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
}

.bot__footer__input {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
<<<<<<< HEAD
    border-bottom-left-radius: $radius !important;
    border-top-left-radius: $radius !important;
=======
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
}
</style>
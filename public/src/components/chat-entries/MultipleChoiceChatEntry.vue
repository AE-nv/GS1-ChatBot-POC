<template>
  <ChatEntry v-bind="$props">
    <template>
      <div class="d-flex flex-column">
        <div
          v-html="parsedMessage"
          class="mb-2"
        ></div>
        <div class="d-flex flex-row flex-wrap chat-bubble_possible-answer__container">
          <button
            variant="dark"
            class="d-flex col flex-row yes-no-button py-2 mb-2 flex-grow-1 justify-content-center chat-bubble__possible-answer"
            :disabled="answerGiven"
            :class="{'chat-bubble__possible-answer--selected': answer === selectedAnswer}"
            v-for="(answer,index) in possibleAnswers"
            :key="index"
            @click="emitAnswer(answer)"
          >{{answer}}</button>
        </div>
      </div>
    </template>
  </ChatEntry>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import ChatEntry from '../ChatEntry.vue';
import { ChatEntryEvent } from './ChatEntryEvents';

@Component({ components: { ChatEntry } })
export default class MultipleChoiceChatEntry extends ChatEntry {
    @Prop() public possibleAnswers!: string[];
    @Prop() public message!: string;

    public selectedAnswer: string = '';

    public answerGiven: boolean = false;
    //TODO extract method
    public get parsedMessage(): string {
        const link: RegExpExecArray | null = /\[(.*)\]\((.*)\)/gm.exec(
            this.message,
        );

        if (link && link !== null && link.length === 3) {
            return this.message.replace(
                /(\[.*\])(\(.*\))/,
                `<a href="${link[2]}" target="_blank">${link[1]}</a>`,
            );
        } else {
            return this.message;
        }
    }

    @Emit('chatEntryEvent')
    public emitAnswer(answer: string) {
        this.answerGiven = true;
        this.selectedAnswer = answer;
        return { event: ChatEntryEvent.MultipleChoiceClicked, value: answer };
    }
}
</script>

<style lang="scss">
.chat-bubble__possible-answer {
    background-color: $bot-bubble-background-color;
    border-radius: $radius !important;
    font-size: 1.5rem;
    font-weight: normal;
    border: 1px solid $main-color;
    &--selected {
        background-color: $main-color !important;
        color: $text-color !important;
    }
}

.chat-bubble_possible-answer__container {
    > button:not(:last-child) {
        margin-right: 0.8rem;
    }
}
</style>
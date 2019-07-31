<template>
  <ChatEntry v-bind="$props">
    <template>
      <div class="d-flex flex-column">
        <div class="mb-2">{{message}}</div>
        <b-button
          class="d-flex flex-row yes-no-button mb-2 flex-grow-1 justify-content-center"
          :disabled="answerGiven"
          v-for="(answer,index) in possibleAnswers"
          :key="index"
          @click="emitAnswer(answer)"
        >{{answer}}</b-button>
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

    public answerGiven: boolean = false;

    @Emit('chatEntryEvent')
    public emitAnswer(answer: string) {
        this.answerGiven = true;
        return { event: ChatEntryEvent.MultipleChoiceClicked, value: answer };
    }
}
</script>

<style lang="scss">
</style>
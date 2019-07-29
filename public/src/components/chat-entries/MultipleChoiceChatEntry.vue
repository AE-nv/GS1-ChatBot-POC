<template>
  <ChatEntry v-bind="$props">
    <template>
      <b-button
        class="d-flex flex-column"
        v-for="(answer,index) in possibleAnswers"
        :key="index"
        @click="emitAnswer(answer)"
      >{{answer}}</b-button>
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

    @Emit('chatEntryEvent')
    public emitAnswer(answer: string): ChatEntryEvent {
        return ChatEntryEvent.MultipleChoiceClicked;
    }
}
</script>

<style lang="scss">
</style>
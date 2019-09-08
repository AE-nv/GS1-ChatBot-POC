<template>
  <ChatEntry v-bind="$props">
    <template>
      <div
        class="mb-2"
        v-if="message"
      >{{message}}</div>
      <div class="d-flex justify-content-around p-2">
        <b-button
          class="yes-no-button"
          :disabled="answerGiven"
          @click="yesClicked"
        >Ja</b-button>
        <div class="mx-2"> </div>
        <b-button
          class="yes-no-button"
          :disabled="answerGiven"
          @click="noClicked"
        >Nee</b-button>
      </div>
    </template>
  </ChatEntry>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import ChatEntry from '../ChatEntry.vue';
import { ChatEntryEvent } from './ChatEntryEvents';

@Component({ components: { ChatEntry } })
export default class YesNoButtonEntry extends ChatEntry {
    @Prop() public message!: string;
    public answerGiven: boolean = false;
    @Emit('chatEntryEvent')
    public yesClicked() {
        this.answerGiven = true;
        return { event: ChatEntryEvent.YesClicked, value: 'Ja' };
    }

    @Emit('chatEntryEvent')
    public noClicked() {
        this.answerGiven = true;
        return { event: ChatEntryEvent.NoClicked, value: 'Nee' };
    }
}
</script>

<style lang="scss">
.yes-no-button {
    background-color: white;
    color: $main-color;
    flex-grow: 1;
    font-weight: bold;
}
</style>
<template>
  <ChatEntry v-bind="$props">
    <template>
      {{message}}
    </template>
  </ChatEntry>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import AbstractChatEntry from './AbstractChatEntry.vue';
import ChatEntry from '../ChatEntry.vue';

@Component({ components: { ChatEntry } })
export default class TextChatEntry extends ChatEntry {
    @Prop() public message!: string;
}
</script>

<style lang="scss">
</style>
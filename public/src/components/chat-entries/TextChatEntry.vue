<template>
  <ChatEntry v-bind="$props">
    <template>
<<<<<<< HEAD
      <div v-html="parsedMessage"></div>
=======
      {{message}}
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
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
<<<<<<< HEAD
    //TODO: extract method
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
=======
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
}
</script>

<style lang="scss">
</style>
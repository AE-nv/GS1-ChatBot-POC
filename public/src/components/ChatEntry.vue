<template>
  <div
    class="chat-entry d-flex align-items-end"
    :class="{'flex-row-reverse' : isUserSide}"
  >
    <div
      v-if="!isUserSide"
      class="chat-entry__avatar d-flex"
    >
      <img
        class="chat-entry__avatar__bot-image"
        src="../assets/GS1_Corporate_logo.png"
      > </div>
    <div class="chat-entry__spacer"></div>
    <div
      class="chat-entry__text-bubble p-2 mb-2"
      :class="{
      'chat-entry__text-bubble--user': isUserSide,
      'chat-entry__text-bubble--bot': !isUserSide
    }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class ChatEntry extends Vue {
    // Specifies that this entry is an entry of the user (and not of an answering party a.k.a. the bot);
    @Prop() public isUserSide!: boolean;
}
</script>

<style lang="scss">
.chat-entry {
    transition: 800ms;
}

.chat-entry__avatar {
    border-radius: 100%;
    // background-color: $background-color-dark;
    // height: 2rem;
    // width: 2rem;
    // max-height: 2rem;
    // max-width: 2rem;
    min-width: 2rem;
    min-height: 2rem;
}

.chat-entry__spacer {
    min-width: 1rem;
}

.chat-entry__avatar__bot-image {
    max-width: 2.5rem;
    max-height: 2.5rem;
}

.chat-entry__text-bubble {
    border-radius: $radius;

    position: relative;

    &--bot {
        border: 0.05rem solid $bot-bubble-border-color;
        background-color: $bot-bubble-background-color;
        color: $bot-bubble-text-color;
        border-bottom-left-radius: 0;
        &::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            height: 0;
            border: $chat-bubble-arrow-size solid transparent;
            border-right-color: $bot-bubble-border-color;
            border-left: 0;
            border-bottom: 0;
            margin-bottom: -0.05rem;
            margin-left: -$chat-bubble-arrow-size - 0.05rem;
        }
    }

    &--user {
        border: 0.05rem solid $user-bubble-border-color;
        background-color: $user-bubble-background-color;
        color: $user-bubble-text-color;
        border-bottom-right-radius: 0;
        &::after {
            content: '';
            position: absolute;
            right: 0;
            bottom: 0;
            height: 0;
            border: $chat-bubble-arrow-size solid transparent;
            border-left-color: $user-bubble-border-color;
            border-right: 0;
            border-bottom: 0;
            margin-bottom: -0.05rem;
            margin-right: -$chat-bubble-arrow-size;
        }
    }
}
</style>
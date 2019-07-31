<template>
  <div class="home">
    <ChatWindow
      class="position-fixed bot"
      :class="{'bot--active':botActive, 'bot--inactive':!botActive}"
      :active="botActive"
      @close="botActive = false"
      @open="botActive = true"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ChatWindow from '@/components/ChatWindow.vue';

@Component({
    components: {
        ChatWindow,
    },
})
export default class Home extends Vue {
    private botActive: boolean = true;
}
</script>
<style lang="scss">
.bot {
    &--active {
        right: 0;
        bottom: 0;
    }

    z-index: 10000;
    @include media-breakpoint-up(sm) {
        right: $chatbot-margin;
        bottom: $chatbot-margin;
    }

    &--inactive {
        right: $chatbot-margin;
        bottom: $chatbot-margin;
    }
}
</style>


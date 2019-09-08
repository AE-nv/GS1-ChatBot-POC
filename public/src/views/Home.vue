<template>
  <div class="home w-100 h-100">
    <iframe name="gs1frame"
            class="w-100 h-100"
            src="https://www.gs1belu.org/nl"></iframe>
    <ChatWindow class="position-fixed bot"
                :class="{'bot--active':botActive, 'bot--inactive':!botActive}"
                :active="botActive"
                @close="botActive = false"
                @open="botActive = true" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ChatWindowHardcoded from '@/components/ChatWindowHardcoded.vue';
import ChatWindow from '../components/ChatWindow.vue';

@Component({
    components: {
        ChatWindow,
        ChatWindowHardcoded,
    },
})
export default class Home extends Vue {
    private botActive: boolean = false;

    public mounted() {
        setTimeout(() => (this.botActive = true), 2000);
    }
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


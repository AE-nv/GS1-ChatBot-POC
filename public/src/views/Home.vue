<template>
  <div class="home">
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
<<<<<<< HEAD
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
=======
    },
})
export default class Home extends Vue {}
</script>
<style lang="scss">
.bot {
    right: $chatbot-margin;
    bottom: $chatbot-margin;
    z-index: 10000;
>>>>>>> 220c766... GS1-6: Add ui for chat in frontend
}
</style>


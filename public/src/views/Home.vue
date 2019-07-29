<template>
  <div class="home">
    <ChatWindow class="position-fixed bot" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ChatWindow from '@/components/ChatWindow.vue';

@Component({
    components: {
        ChatWindow,
    },
})
export default class Home extends Vue {}
</script>
<style lang="scss">
.bot {
    right: $chatbot-margin;
    bottom: $chatbot-margin;
    z-index: 10000;
}
</style>


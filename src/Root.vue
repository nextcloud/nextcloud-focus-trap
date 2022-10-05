<script lang="ts">
import { ref, defineComponent } from 'vue';
import Modal from './components/Modal.vue';

export default defineComponent({
  name: 'Root',
  components: {
    Modal,
  },
  setup() {
    const isOpen = ref(true);

    const openModal = () => {
      isOpen.value = true;
    };

    return {
      openModal,
      isOpen,
    };
  },
});
</script>

<template>
  <div id="root">
    <div class="fixed inset-0 flex items-center justify-center">
      <button type="button" @click="openModal" class="btn">Open dialog</button>
    </div>
    <Modal v-model="isOpen" />
  </div>
</template>

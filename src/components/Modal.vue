<script lang="ts">
import {
  ref,
  computed,
  defineComponent,
  watchEffect,
  onBeforeUnmount,
  nextTick,
} from 'vue';
import DropList from './DropList.vue';
import { useFocusTrap } from '../composables/focus-trap';

export default defineComponent({
  name: 'Modal',
  components: {
    DropList,
  },
  props: {
    modelValue: {
      type: Boolean,
      requires: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const el = ref<HTMLElement | null>(null);
    const title = ref('Modal Title');

    const isOpen = computed(() => props.modelValue);

    useFocusTrap(isOpen, el);

    return {
      el,
      title,
      isOpen,
      setTitle: (val: string) => {
        title.value = val;
      },
      close: () => {
        ctx.emit('update:modelValue', false);
      },
    };
  },
});
</script>

<template>
  <div ref="el">
    <div
      v-if="isOpen"
      class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
    >
      <div class="relative w-auto my-6 mx-auto max-w-3xl">
        <!--content-->
        <div
          class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
        >
          <!--header-->
          <div
            class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t"
          >
            <h3 class="text-3xl font-semibold">
              {{ title }}
            </h3>
            <button
              class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              v-on:click="close()"
            >
              <span
                class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none"
              >
                ×
              </span>
            </button>
          </div>
          <!--body-->
          <div class="relative p-6 flex-auto">
            <input v-model="title" type="text" />

            <DropList @select="setTitle" />

            <p class="my-4 text-slate-500 text-lg leading-relaxed">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            </p>
          </div>
          <!--footer-->
          <div
            class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b"
          >
            <button class="btn is-danger" type="button" v-on:click="close()">
              Close
            </button>
            <button class="btn" type="button" v-on:click="close()">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isOpen" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
</template>

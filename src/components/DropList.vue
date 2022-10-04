<script lang="ts">
import { ref, defineComponent, nextTick } from 'vue'
import { Dropdown as VDropdown } from 'floating-vue'
import { useFocusTrap } from '../composables/focus-trap'

const apps = [
  'Deck',
  'OnlyOffice',
  'News',
  'Passwords',
  'Reader',
  'Unsplash',
  'Music',
]

export default defineComponent({
  name: 'DropList',
  components: {
    VDropdown
  },
  emits: {
    select(val: string) {
      return val.length > 0
    }
  },
  setup (props, ctx) {
    const isVisible = ref(false)
    const el = ref<HTMLElement | null>(null)

    const select = (val: string) => {
      ctx.emit('select', val)
    }

    useFocusTrap(isVisible, el)

    const setState = (val: boolean) => {
      nextTick(() => isVisible.value = val)
    }

    const afterShow = () => setState(true)
    const afterHide = () => setState(false)

    return {
      el,
      select,
      apps,
      afterShow,
      afterHide
    }
  }
})
</script>

<template>
  <VDropdown
    @apply-show="afterShow"
    @apply-hide="afterHide"
    class="inline-block ml-1">
    <button class="btn">🦸</button>

    <template #popper>
      <div ref="el">
        <div class="stack">
          <p tabindex="1">
            Select an app
          </p>

          <button :tabindex="index + 2" @click="select(val)" v-for="(val, index) in apps" :key="`opt-${val}`" class="btn">
            {{ val }}
          </button>

          <button tabindex="-1" class="btn is-danger" @click="select('')">
            Clean
          </button>
        </div>
      </div>
    </template>
  </VDropdown>
</template>
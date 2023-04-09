<script setup>
import { useRecordStore } from '../stores/record';
const tabVisible = ref(false);
const newName = ref("");
const store = useRecordStore()
const message = useMessage()

const submitCallback = () => {
    store.add(newName.value)
    message.success("添加成功")
};

</script>

<template>
  <n-modal
    v-model:show="tabVisible"
    preset="dialog"
    title="添加新项目"
    positive-text="好的"
    negative-text="取消"
    @positive-click="submitCallback"
  >
  <div class="m-4">
    <n-form class="pt-4">
        <n-form-item label="项目名称">
            <n-input placeholder="输入名称" v-model:value="newName"></n-input>
        </n-form-item>
    </n-form>
  </div>

  </n-modal>
  <div class="fixed right-6 bottom-6">
    <div
      class="p-3 cursor-pointer rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg transition"
      @click="tabVisible = true"
    >
      <n-icon class="!inline" size="1.5rem" color="white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 12 12"
        >
          <g fill="none">
            <path
              d="M6.5 1.75a.75.75 0 0 0-1.5 0V5H1.75a.75.75 0 0 0 0 1.5H5v3.25a.75.75 0 0 0 1.5 0V6.5h3.25a.75.75 0 0 0 0-1.5H6.5V1.75z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      </n-icon>
    </div>
  </div>
</template>

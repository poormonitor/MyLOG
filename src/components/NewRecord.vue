<script setup>
import { useRoute } from "vue-router";
import { useRecordStore } from "../stores/record";

const route = useRoute();
const tabVisible = ref(false);
const recordData = ref(0);
const store = useRecordStore();
const message = useMessage();

const submitCallback = () => {
  if (isNaN(recordData.value)) {
    message.warning("添加成功");
    return;
  }
  store.addRecord(route.params.id, recordData.value);
  message.success("添加成功");
};
</script>

<template>
  <n-modal
    v-model:show="tabVisible"
    preset="dialog"
    title="添加新记录"
    positive-text="好的"
    negative-text="取消"
    @positive-click="submitCallback"
  >
    <div class="m-4">
      <n-form class="pt-4">
        <n-form-item label="液体量">
          <n-input-number
            :autofoucs="true"
            class="w-full"
            placeholder="请输入液体量"
            v-model:value="recordData"
          ></n-input-number>
        </n-form-item>
      </n-form>
    </div>
  </n-modal>
  <n-button type="primary" @click="tabVisible = true">添加数据</n-button>
</template>

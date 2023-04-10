<script setup>
import { useRoute } from "vue-router";
import { useRecordStore } from "../stores/record";

const route = useRoute();
const tabVisible = ref(false);
const recordData = ref(0);
const recordTime = ref(new Date().getTime());
const store = useRecordStore();
const message = useMessage();
const emits = defineEmits(["finish"]);

const submitCallback = () => {
  if (isNaN(recordData.value)) {
    message.warning("添加成功");
    return;
  }
  store.addRecord(route.params.id, recordData.value, recordTime);
  emits("finish");
  message.success("添加成功");
};

watch(tabVisible, () => {
  if (tabVisible.value) recordTime.value = new Date().getTime();
});
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
            :autofocus="true"
            class="w-full"
            placeholder="请输入液体量"
            v-model:value="recordData"
          ></n-input-number>
        </n-form-item>
        <n-form-item label="记录时间">
          <n-date-picker
            class="w-full"
            v-model:value="recordTime"
            type="datetime"
            clearable
          />
        </n-form-item>
      </n-form>
    </div>
  </n-modal>
  <n-button type="primary" @click="tabVisible = true">添加数据</n-button>
</template>

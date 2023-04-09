<script setup>
import { useRecordStore } from "../stores/record";
import { useRouter } from "vue-router";
const store = useRecordStore();
const message = useMessage();
const router = useRouter();

const handleDelete = (id) => {
  console.log(id);
  store.del(id);
  message.success("删除成功");
};

const gotoRecord = (id) => {
  router.push({ name: "record", params: { id: id } });
};

console.log(store.list);
</script>

<template>
  <span class="text-3xl font-bold">液体量记录</span>
  <div class="mt-10">
    <n-result
      class="mt-8"
      v-if="!store.list.length"
      status="404"
      title="没有记录"
      description="单击右下角按钮以添加"
    >
    </n-result>
    <n-list hoverable clickable>
      <n-list-item v-for="item in store.list">
        <div class="flex items-center" @click="() => gotoRecord(item.id)">
          <div class="m-2">
            <p class="text-2xl font-bold mb-1">{{ item.name }}</p>
            <p class="text-gray-600">
              {{
                item.latest > 0
                  ? new Date(item.latest).toLocaleString()
                  : "无记录"
              }}
            </p>
          </div>
          <div class="ml-10">
            <p class="text-gray-700">过去24小时量</p>
            <p class="text-xl">
              {{ item.last }}
            </p>
          </div>
        </div>

        <template #suffix>
          <n-popconfirm
            positive-text="删除"
            negative-text="取消"
            @positive-click="() => handleDelete(item.id)"
          >
            <template #trigger>
              <n-button size="small" strong circle secondary type="error"
                ><n-icon size="1.2rem">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34z"
                      fill="currentColor"
                    ></path>
                  </svg> </n-icon
              ></n-button>
            </template>
            确认删除？
          </n-popconfirm>
        </template>
      </n-list-item>
    </n-list>
  </div>
  <NewItem></NewItem>
</template>

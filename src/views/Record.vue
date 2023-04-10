<script setup lang="jsx">
import { useRecordStore } from "../stores/record";
import { useRouter, useRoute } from "vue-router";
import * as echarts from "echarts";
import { onMounted } from "vue";

const message = useMessage();
const store = useRecordStore();
const router = useRouter();
const route = useRoute();

const data = computed(() =>
  store.data.find((item) => item.id == route.params.id)
);
const record = computed(() => data.value.record);

const handleDelete = (id) => {
  console.log(id);
  store.delRecord(route.params.id, id);
  message.success("删除成功");
};
const reportNow = () => {
  store.report(route.params.id);
  message.success("记录了报告");
};
const goReport = (rid, report) => {
  store.reportRecord(route.params.id, rid, report);
  message.success("记录了报告");
};
const disReport = (rid) => {
  store.disReport(route.params.id, rid);
  message.success("已解除报告");
};
const columns = [
  {
    title: "时间",
    render: (row) => new Date(row.time).toLocaleString(),
  },
  {
    title: "数量",
    key: "data",
  },
  {
    title: "报告",
    render: (row, index) =>
      row.report ? (
        index == record.value.length - 1 || !record.value[index + 1].report ? (
          <n-popconfirm
            positiveText="确认"
            negativeText="取消"
            onPositiveClick={() => disReport(row.id)}
          >
            {{
              trigger: () => (
                <span class="text-green-600 hover:text-green-700 transition cursor-pointer">
                  {new Date(row.report).toLocaleString()}
                </span>
              ),
              default: () => "确认解除报告？",
            }}
          </n-popconfirm>
        ) : (
          <span class="text-green-600">
            {new Date(row.report).toLocaleString()}
          </span>
        )
      ) : index == 0 || record.value[index - 1].report ? (
        <n-popconfirm
          positiveText="确认"
          negativeText="取消"
          onPositiveClick={() =>
            goReport(
              row.id,
              index == 0 ? new Date().getTime() : record.value[index - 1].report
            )
          }
        >
          {{
            trigger: () => (
              <span class="text-pink-600 hover:text-pink-700 transition cursor-pointer">
                未报告
              </span>
            ),
            default: () => "确认报告？",
          }}
        </n-popconfirm>
      ) : (
        <span class="text-pink-600">未报告</span>
      ),
  },
  {
    title: "删除",
    render: (row) => (
      <n-popconfirm
        positiveText="删除"
        negativeText="取消"
        onPositiveClick={() => handleDelete(row.id)}
      >
        {{
          trigger: () => (
            <n-button size="small" strong secondary circle type="error">
              <n-icon size="1.2rem">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34z"
                    fill="currentColor"
                  ></path>
                </svg>
              </n-icon>
            </n-button>
          ),
          default: () => "确认删除？",
        }}
      </n-popconfirm>
    ),
  },
];

if (!data) {
  router.push({ name: "home" });
}

var chart1, chart2;

const printChart = () => {
  var option1 = {
    title: {
      text: "液体量散点图",
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "time",
    },
    yAxis: {
      type: "value",
    },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        var text = "--";
        if (params) {
          let time = new Date(params.data[0]).toLocaleString();
          text = `<p class='mb-1'>${time}</p>`;
          text += "<div class='flex justify-between gap-x-4'>";
          text += `<div>${params.marker}${params.seriesName}</div>`;
          text += `<div class='font-bold'>${params.data[1]}</div>`;
          text += "</div>";
        }
        return text;
      },
    },
    series: [
      {
        data: record.value.map((item) => [item.time, item.data]),
        type: "scatter",
        name: "液体量",
      },
    ],
  };

  var option2 = {
    title: {
      text: "液体量每日图",
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "time",
    },
    yAxis: {
      type: "value",
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        var text = "--";
        if (params) {
          params = params[0];
          let time = new Date(params.data[0]).toLocaleDateString();
          text = `<p class='mb-1'>${time}</p>`;
          text += "<div class='flex justify-between gap-x-4'>";
          text += `<div>${params.marker}${params.seriesName}</div>`;
          text += `<div class='font-bold'>${params.data[1]}</div>`;
          text += "</div>";
        }
        return text;
      },
    },
    series: [
      {
        data: store.getByDay(route.params.id),
        type: "line",
        smooth: true,
        name: "液体量",
      },
    ],
  };

  chart1.clear();
  chart2.clear();

  chart1.setOption(option1);
  chart2.setOption(option2);
};

onMounted(() => {
  chart1 = echarts.init(document.getElementById("chart1"));
  chart2 = echarts.init(document.getElementById("chart2"));

  printChart();

  window.onresize = function () {
    chart1.resize();
    chart2.resize();
  };
});
</script>

<template>
  <div class="mb-1">
    <router-link
      class="text-blue-500 hover:text-blue-600"
      :to="{ name: 'home' }"
      >返回</router-link
    >
  </div>
  <div class="text-3xl font-bold">{{ data.name }}</div>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mx-4">
    <n-statistic label="未报告的量">
      {{ store.getSumUnreported(route.params.id) }}
    </n-statistic>
    <n-statistic label="过去24小时的量">
      {{ store.getSumPastTime(route.params.id, 24 * 60 * 60) }}
    </n-statistic>
    <n-statistic label="本日的量">
      {{ store.getSumToday(route.params.id, new Date().toDateString()) }}
    </n-statistic>
    <n-statistic label="24小时平均量">
      {{ Math.round(store.getAverage(route.params.id, 24 * 60 * 60)) }}
    </n-statistic>
  </div>
  <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-y-8">
    <div class="h-64 w-full" id="chart1"></div>
    <div class="h-64 w-full" id="chart2"></div>
  </div>
  <div class="mt-6 flex gap-x-4">
    <NewRecord @finish="printChart"></NewRecord>
    <n-popconfirm
      positive-text="确认"
      negative-text="取消"
      @positive-click="reportNow"
    >
      <template #trigger>
        <n-button type="info">记录报告</n-button>
      </template>
      现在记录报告？
    </n-popconfirm>
  </div>
  <n-data-table
    class="mt-4 whitespace-nowrap"
    :data="record"
    :columns="columns"
  >
  </n-data-table>
</template>

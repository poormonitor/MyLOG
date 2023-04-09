import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { nanoid } from "nanoid";

export const useRecordStore = defineStore(
  "record",
  () => {
    const data = ref([]);

    const list = computed(() => {
      return data.value.map((item) => ({
        id: item.id,
        name: item.name,
        latest: Math.max(...item.record.map((r) => r.time)),
      }));
    });

    function add(name) {
      var id = nanoid();
      data.value.push({
        id: id,
        name: name,
        record: [],
      });
      return id;
    }

    function del(id) {
      data.value = data.value.filter((item) => item.id != id);
    }

    function addRecord(id, record) {
      var rid = nanoid();
      data.value
        .find((item) => item.id == id)
        .record.push({
          id: rid,
          data: record,
          time: new Date().getTime(),
          report: false,
        });
      return rid;
    }

    function delRecord(id, rid) {
      let d = data.value.find((item) => item.id == id);
      d.record = d.record.filter((item) => item.id != rid);
    }

    function getSumUnreported(id) {
      return data.value
        .find((item) => item.id == id)
        .record.filter((item) => item.report === false)
        .map((item) => item.data)
        .reduce((prev, current) => prev + current, 0);
    }

    function getSumPastTime(id, second) {
      return data.value
        .find((item) => item.id == id)
        .record.filter(
          (item) => item.time >= new Date().getTime() - second * 1000
        )
        .map((item) => item.data)
        .reduce((prev, current) => prev + current, 0);
    }

    function getAverage(id, second) {
      let record = data.value.find((item) => item.id == id).record;
      let time = record.map((item) => item.time);
      let len = record.length;
      let length = ((Math.max(...time) - Math.min(...time)) / len) * (len + 1);
      return (
        (record.reduce((prev, current) => prev + current.data, 0) / length) *
        (second * 1000)
      );
    }

    function getDate(timestamp) {
      return new Date(new Date(timestamp).toLocaleDateString()).getTime();
    }

    function getByDay(id) {
      let sums = [];
      let record = data.value.find((item) => item.id == id).record;
      let time = record.map((item) => item.time);
      let peak = [getDate(Math.min(...time)), getDate(Math.max(...time))];
      let round = 24 * 60 * 60 * 1000;
      for (let i = peak[0]; i < peak[1] + round; i += round) {
        let range = record.filter(
          (item) => item.time >= i && item.time < i + round
        );
        sums.push([
          new Date(i).toISOString().slice(0, 10),
          range.reduce((prev, current) => prev + current.data, 0),
        ]);
      }
      return sums;
    }

    function report(id) {
      data.value
        .find((item) => item.id == id)
        .record.forEach((val) => {
          val.report = new Date().getTime();
        });
    }

    function reportRecord(id, rid, report = new Date().getTime()) {
      data.value
        .find((item) => item.id == id)
        .record.find((item) => item.id == rid).report = report;
    }

    function disReport(id, rid) {
      data.value
        .find((item) => item.id == id)
        .record.find((item) => item.id == rid).report = false;
    }

    return {
      data,
      list,
      add,
      del,
      addRecord,
      delRecord,
      getSumUnreported,
      getSumPastTime,
      getAverage,
      getByDay,
      report,
      reportRecord,
      disReport,
    };
  },
  {
    persist: true,
  }
);

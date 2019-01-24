<template>
  <div class="timeAnalysis-wrapper">
    <div id="meetingRoomUsedAll" class="meetingRoomUsedAll"></div>
    <div class="bottom">
      <div id="meetingRoomUsedNear" class="meetingRoomUsedNear"></div>
      <div id="meetingRoomUsedNearAnalysic" v-loading="loading" class="meetingRoomUsedNearAnalysic"></div>
    </div>
  </div>
</template>

<script>
import Echarts from "echarts";
import Fetch from "mixins/fetch";
import { dateFormate } from "@/utils";

export default {
  data() {
    return {
      loading: true
    };
  },
  mixins: [Fetch],
  created() {
    // 会议室时间统计，总折线图
    this.drawMeetingRoomUsedAll();
    //会议室时间统计，近期圆饼图
    this.drawMeetingRoomUsedNear();
  },
  methods: {
    // 会议室时间统计，总折线图
    drawMeetingRoomUsedAll() {
      this.$_fetch_drawMeetingRoomUsedAll().then(res => {
        let meetingRoomUsedAllOption = {
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: ["会议室使用次数"],
            orient: "vertical",
            left: "center"
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: [
              "8:00-10:00",
              "10:00-12:00",
              "12:00-14:00",
              "14:00-16:00",
              "16:00-18:00",
              "18:00-20:00",
              "20:00-22:00"
            ]
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "会议室使用次数",
              type: "line",
              data: [
                { value: res[0], name: " 8:00-10:00" },
                { value: res[1], name: "10:00-12:00" },
                { value: res[2], name: "12:00-14:00" },
                { value: res[3], name: "14:00-16:00" },
                { value: res[4], name: "16:00-18:00" },
                { value: res[5], name: "18:00-20:00" },
                { value: res[6], name: "20:00-22:00" }
              ]
            }
          ]
        };
        let drawMeetingRoomUsedAll = Echarts.init(
          document.getElementById("meetingRoomUsedAll")
        );
        drawMeetingRoomUsedAll.setOption(meetingRoomUsedAllOption);
      });
    },
    //会议室时间统计，近期圆饼图
    drawMeetingRoomUsedNear() {
      this.$_fetch_drawMeetingRoomUsedNear().then(res => {
        let nearSevenDays = [];
        for (let i = 0; i < res.length; i++) {
          nearSevenDays.push(dateFormate(res[i].key, "yyyy-MM-dd"));
        }
        let meetingRoomUsedNearOption = {
          title: {
            text: "会议室近期时间统计",
            x: "center"
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            left: "left",
            data: nearSevenDays
          },
          series: [
            {
              name: "数量",
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: [
                {
                  value: res[0].value,
                  name: nearSevenDays[0]
                },
                {
                  value: res[1].value,
                  name: nearSevenDays[1]
                },
                {
                  value: res[2].value,
                  name: nearSevenDays[2]
                },
                {
                  value: res[3].value,
                  name: nearSevenDays[3]
                },
                {
                  value: res[4].value,
                  name: nearSevenDays[4]
                },
                {
                  value: res[5].value,
                  name: nearSevenDays[5]
                },
                {
                  value: res[6].value,
                  name: nearSevenDays[6]
                }
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        };
        let drawMeetingRoomUsedNear = Echarts.init(
          document.getElementById("meetingRoomUsedNear")
        );
        drawMeetingRoomUsedNear.setOption(meetingRoomUsedNearOption);
        drawMeetingRoomUsedNear.on("mouseover", params => {
          this.loading = false;
          this.drawMeetingRoomUsedNearAnalysic(params.name);
        });
      });
    },
    //会议室时间统计，近期折线图
    drawMeetingRoomUsedNearAnalysic(dateTime) {
      this.$_fetch_drawMeetingRoomUsedNearAnalysic({
        date: dateTime
      }).then(res => {
        let meetingRoomUsedNearAnalysicOption = {
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: [name + "会议室使用次数"],
            orient: "vertical",
            left: "center"
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: [
              "8:00-10:00",
              "10:00-12:00",
              "12:00-14:00",
              "14:00-16:00",
              "16:00-18:00",
              "18:00-20:00",
              "20:00-22:00"
            ]
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: name + "会议室使用次数",
              type: "line",
              data: res
            }
          ]
        };
        let drawMeetingRoomUsedNearAnalysic = Echarts.init(
          document.getElementById("meetingRoomUsedNearAnalysic")
        );
        drawMeetingRoomUsedNearAnalysic.setOption(
          meetingRoomUsedNearAnalysicOption
        );
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.timeAnalysis-wrapper {
  height: 100%;
  margin: 10px;
  .meetingRoomUsedAll {
    width: 100%;
    height: 350px;
  }
  .bottom {
    margin-top: 20px;
    width: 100%;
    .meetingRoomUsedNear,
    .meetingRoomUsedNearAnalysic {
      display: inline-block;
      width: 50%;
      height: 350px;
    }
  }
}
</style>
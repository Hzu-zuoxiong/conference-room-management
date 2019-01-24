<template>
  <div class="capacityAnalysis-wrapper">
    <div class="top">
      <div id="meetingRoomCapacity" class="meetingRoomCapacity"></div>
      <div class="meetingRoomAreaAnalysic">
        <div id="meetingRoomAreaAnalysic" class="draw" v-loading="loading"></div>
      </div>
    </div>
    <div id="meetingRoomCapacityUsedNumber" class="meetingRoomCapacityUsedNumber"></div>
  </div>
</template>

<script>
import Echarts from "echarts";
import Fetch from "mixins/fetch";

export default {
  components: {},
  props: {},
  data() {
    return {
      loading: true,
      selectTime: ""
    };
  },
  created() {
    // 会议室容量，圆饼图
    this.drawMeetingRoomCapacity();
    // 会议室容量，柱状图
    this.drawMeetingRoomCapacityUsedNumber();
  },
  mounted() {},
  computed: {},
  mixins: [Fetch],
  methods: {
    // 会议室容量，圆饼图
    drawMeetingRoomCapacity() {
      this.$_fetch_drawMeetingRoomCapacity().then(res => {
        let meetingRoomCapacityOption = {
          title: {
            text: "会议室容量分布",
            x: "center"
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            left: "left",
            data: [
              "小型（20人）",
              "中型（40人）",
              "偏大型（60人）",
              "大型（80人）",
              "豪华（100人）"
            ]
          },
          series: [
            {
              name: "数量",
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: [
                { value: res.dataList[0], name: "小型（20人）" },
                { value: res.dataList[1], name: "中型（40人）" },
                { value: res.dataList[2], name: "偏大型（60人）" },
                { value: res.dataList[3], name: "大型（80人）" },
                { value: res.dataList[4], name: "豪华（100人）" }
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
        let drawMeetingRoomCapacity = Echarts.init(
          document.getElementById("meetingRoomCapacity")
        );
        drawMeetingRoomCapacity.setOption(meetingRoomCapacityOption);
        drawMeetingRoomCapacity.on("mouseover", params => {
          this.loading = false;
          this.drawMeetingRoomAreaAnalysic(
            "",
            "",
            params.name,
            params.dataIndex
          );
        });
      });
    },
    //会议室容量，折线图
    drawMeetingRoomAreaAnalysic(beginTime, endTime, name, index = 0) {
      // const quarter = ["第一季度", "第二季度", "第三季度", "第四季度"];
      const month = [
        "1号",
        "2号",
        "3号",
        "4号",
        "5号",
        "6号",
        "7号",
        "8号",
        "9号",
        "10号",
        "11号",
        "12号",
        "13号",
        "14号",
        "15号",
        "16号",
        "17号",
        "18号",
        "19号",
        "20号",
        "21号",
        "22号",
        "23号",
        "24号",
        "25号",
        "26号",
        "27号",
        "28号",
        "29号",
        "30号",
        "31号"
      ];
      // const weekend = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
      //判断选择的容量
      let maxPeople = 0;
      if (index === 0) {
        maxPeople = 20;
      } else if (index === 1) {
        maxPeople = 40;
      } else if (index === 2) {
        maxPeople = 60;
      } else if (index === 3) {
        maxPeople = 80;
      } else if (index === 4) {
        maxPeople = 100;
      }
      this.$_fetch_drawMeetingRoomAreaAnalysic({
        beginTime: beginTime,
        endTime: endTime,
        queryKind: 1,
        maxPeople: maxPeople
      }).then(res => {
        var meetingRoomAreaAnalysicOption = {
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
            data: month
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: name + "会议室使用次数",
              type: "line",
              data: res.dataList
            }
          ]
        };
        let meetingRoomAreaAnalysic = Echarts.init(
          document.getElementById("meetingRoomAreaAnalysic")
        );
        meetingRoomAreaAnalysic.setOption(meetingRoomAreaAnalysicOption);
      });
    },
    // 会议室容量，柱状图
    drawMeetingRoomCapacityUsedNumber() {
      this.$_fetch_drawMeetingRoomCapacityUsedNumber().then(res => {
        let meetingRoomCapacityUsedNumberOption = {
          color: ["#01AAED"],
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          grid: {
            left: "5%",
            right: "5%",
            bottom: "3%",
            containLabel: true
          },
          title: {
            text: "不同容量会议室的使用次数",
            left: "center"
          },
          xAxis: {
            type: "category",
            data: [
              "小型（20人）",
              "中型（40人）",
              "偏大型（60人）",
              "大型（80人）",
              "豪华（100人）"
            ]
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "使用次数",
              type: "bar",
              barCategoryGap: "75%",
              data: res,
              markPoint: {
                data: [
                  { type: "max", name: "最大值" },
                  { type: "min", name: "最小值" }
                ]
              }
            }
          ]
        };
        let drawMeetingRoomCapacityUsedNumber = Echarts.init(
          document.getElementById("meetingRoomCapacityUsedNumber")
        );
        drawMeetingRoomCapacityUsedNumber.setOption(
          meetingRoomCapacityUsedNumberOption
        );
      });
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.capacityAnalysis-wrapper {
  margin: 10px;
  height: 100%;
  .top {
    margin-top: 20px;
    width: 100%;
    .meetingRoomCapacity {
      display: inline-block;
      width: 50%;
      height: 350px;
    }
    .meetingRoomAreaAnalysic {
      display: inline-block;
      width: 50%;
      .draw {
        height: 300px;
      }
    }
  }
  .meetingRoomCapacityUsedNumber {
    margin-top: 20px;
    width: 100%;
    height: 350px;
  }
}
</style>
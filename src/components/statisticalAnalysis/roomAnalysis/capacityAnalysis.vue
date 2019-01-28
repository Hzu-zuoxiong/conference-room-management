<template>
  <div class="capacityAnalysis-wrapper">
    <div class="top">
      <div id="meetingRoomCapacity" class="meetingRoomCapacity"></div>
      <div class="meetingRoomAreaAnalysic" v-loading="loading">
        <el-button
          type="success"
          class="meetingRoomAreaSelect"
          size="small"
          @click="visible = true"
          plain
        >参数选择</el-button>
        <div id="meetingRoomAreaAnalysic" class="draw"></div>
      </div>
    </div>
    <div id="meetingRoomCapacityUsedNumber" class="meetingRoomCapacityUsedNumber"></div>

    <!-- 折线图参数 -->
    <div class="mask" v-show="visible">
      <div class="selectParams">
        <div class="closeX" @click="visible = false">×</div>
        <el-form class="selectForm" label-position="left" label-width="80px" :model="selectParams">
          <el-form-item label="时间段">
            <el-date-picker
              v-model="selectParams.meetingRoomAreaTime"
              type="daterange"
              align="right"
              unlink-panels
              start-placeholder="开始日期"
              range-separator="至"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="时间单位">
            <el-radio-group v-model="selectParams.meetingRoomAreaKind">
              <el-radio :label="2" border>季度</el-radio>
              <el-radio :label="1" border>月</el-radio>
              <el-radio :label="0" border>周</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-button type="primary" class="ensureSelect" @click="ensureSelect">确认选择</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Echarts from "echarts";
import Fetch from "mixins/fetch";
import { dateFormate } from "@/utils";

export default {
  components: {},
  props: {},
  data() {
    return {
      loading: true,
      selectTime: "",
      visible: false,
      selectParams: {
        meetingRoomAreaTime: "",
        beginTime: "",
        endTime: "",
        meetingRoomAreaKind: 2,
        name: "",
        index: 0
      }
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
          this.selectParams.name = params.name;
          this.selectParams.index = params.dataIndex;
          this.drawMeetingRoomAreaAnalysic(this.selectParams);
        });
      });
    },
    //会议室容量，折线图
    drawMeetingRoomAreaAnalysic(selectParams) {
      const { beginTime, endTime, name, index } = selectParams;
      const quarter = ["第一季度", "第二季度", "第三季度", "第四季度"];
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
      const weekend = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
      let xAx;
      const queryKind = this.selectParams.meetingRoomAreaKind;
      if (queryKind === 0) {
        xAx = weekend;
      } else if (queryKind === 1) {
        xAx = month;
      } else if (queryKind === 2) {
        xAx = quarter;
      }

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
        queryKind,
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
            data: xAx
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
    },
    // 折线图参数
    ensureSelect() {
      this.visible = false;
      this.drawMeetingRoomAreaAnalysic(this.selectParams);
    }
  },
  watch: {
    "selectParams.meetingRoomAreaTime"() {
      this.selectParams.beginTime = dateFormate(
        this.selectParams.meetingRoomAreaTime[0].getTime(),
        "yyyy-MM-dd"
      );
      this.selectParams.endTime = dateFormate(
        this.selectParams.meetingRoomAreaTime[1].getTime(),
        "yyyy-MM-dd"
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.capacityAnalysis-wrapper {
  margin: 10px;
  width: 100%;
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
      position: relative;
      z-index: 100;
      padding: 10px;
      width: 50%;
      text-align: center;
      .meetingRoomAreaSelect {
        position: absolute;
        top: 0;
        left: 60px;
        z-index: 200;
        cursor: pointer;
      }
      .draw {
        height: 350px;
      }
    }
  }
  .meetingRoomCapacityUsedNumber {
    margin-top: 20px;
    width: 100%;
    height: 350px;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.7);
    .selectParams {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 500px;
      height: 250px;
      margin-left: -250px;
      margin-top: -125px;
      background-color: #fff;
      border: 1px solid #333;
      .closeX {
        position: absolute;
        top: 5px;
        right: 10px;
        width: 20px;
        height: 20px;
        text-align: center;
        font-size: 38px;
        color: #f56c6c;
        cursor: pointer;
      }
      .selectForm {
        margin-top: 55px;
        padding-left: 25px;
        .ensureSelect {
          margin-left: 180px;
        }
      }
    }
  }
}
</style>
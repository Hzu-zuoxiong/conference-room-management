<template>
  <div class="attendanceAnalysis-wrapper">
    <div id="drawGuestAttendance" class="drawGuestAttendance"></div>
    <div id="drawGuestAttendanceAnalysic" v-loading="loading" class="drawGuestAttendanceAnalysic"></div>
  </div>
</template>

<script>
import Echarts from "echarts";
import Fetch from "mixins/fetch";

export default {
  components: {},
  props: {
    visitorTime: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      loading: true
    };
  },
  mixins: [Fetch],
  created() {
    // 访客考勤情况，圆饼图
    this.drawGuestAttendance();
  },
  mounted() {},
  computed: {},
  methods: {
    // 访客考勤情况，圆饼图
    drawGuestAttendance() {
      this.$_fetch_drawGuestAttendance({ day: this.visitorTime }).then(res => {
        let guestAttendanceOption = {
          title: {
            text: "访客考勤统计情况",
            x: "center"
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            left: "left",
            data: ["提前到", "准时", "早退", "到点退场", "爽约"]
          },
          series: [
            {
              name: "考勤情况",
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: [
                { value: res[0], name: "提前到" },
                { value: res[1], name: "准时" },
                { value: res[2], name: "早退" },
                { value: res[3], name: "到点退场" },
                { value: res[4], name: "爽约" }
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
        let drawGuestAttendance = Echarts.init(
          document.getElementById("drawGuestAttendance")
        );
        drawGuestAttendance.setOption(guestAttendanceOption);
        drawGuestAttendance.on("mouseover", params =>
          this.drawGuestAttendanceAnalysic(params.dataIndex, params.name)
        );
      });
    },
    // 访客考勤分析, 柱状图
    drawGuestAttendanceAnalysic(index, name) {
      this.loading = false;
      this.$_fetch_drawGuestAttendanceAnalysic({
        status: index,
        day: this.visitorTime
      }).then(res => {
        let guestName = [];
        let guestTimes = [];
        for (var i = 0; i < res.length; i++) {
          guestName.push(res[i].key);
          guestTimes.push(res[i].value);
        }
        let guestAttendanceAnalysicOption = {
          title: {
            text: name + "的次数",
            x: "center"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              data: guestName,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              name: name + "的次数",
              type: "bar",
              barWidth: "20%",
              data: guestTimes,
              itemStyle: {
                //通常情况下：
                normal: {
                  //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                  color: function(params) {
                    var colorList = [
                      "#878787",
                      "#A4D3EE",
                      "#836FFF",
                      "#63B8FF",
                      "#5CACEE"
                    ];
                    return colorList[params.dataIndex];
                  }
                },
                //鼠标悬停时：
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        };
        let drawGuestAttendanceAnalysic = Echarts.init(
          document.getElementById("drawGuestAttendanceAnalysic")
        );
        drawGuestAttendanceAnalysic.setOption(guestAttendanceAnalysicOption);
      });
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.attendanceAnalysis-wrapper {
  margin: 20px;
  .drawGuestAttendance,
  .drawGuestAttendanceAnalysic {
    display: inline-block;
    width: 50%;
    height: 350px;
  }
}
</style>
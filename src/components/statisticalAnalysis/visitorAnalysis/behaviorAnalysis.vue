<template>
  <div class="behaviorAnalysis-wrapper">
    <div id="drawGuestBehave" class="drawGuestBehave"></div>
    <div id="drawGuestBehaveAnalysic" v-loading="loading" class="drawGuestBehaveAnalysic"></div>
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
    // 访客行为统计，圆饼图
    this.drawGuestBehave();
  },
  mounted() {},
  computed: {},
  methods: {
    // 访客行为统计，圆饼图
    drawGuestBehave() {
      this.$_fetch_drawGuestBehave({ day: this.visitorTime }).then(res => {
        let guestBehaveOption = {
          title: {
            text: "访客访问情况统计",
            x: "center"
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            left: "left",
            data: ["培训会", "例会", "节日活动", "学术报告", "招待会", "其他"]
          },
          series: [
            {
              name: "数量",
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: [
                { value: res[1], name: "培训会" },
                { value: res[2], name: "例会" },
                { value: res[3], name: "节日活动" },
                { value: res[4], name: "学术报告" },
                { value: res[5], name: "招待会" },
                { value: res[0], name: "其他" }
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
        let drawGuestBehave = Echarts.init(
          document.getElementById("drawGuestBehave")
        );
        drawGuestBehave.setOption(guestBehaveOption);
        drawGuestBehave.on("mouseover", params =>
          this.drawGuestBehaveAnalysic(params.name)
        );
      });
    },
    // 访客行为统计，柱形图
    drawGuestBehaveAnalysic(name) {
      this.loading = false;
      this.$_fetch_drawGuestBehaveAnalysic({
        tagName: name,
        day: this.visitorTime
      }).then(res => {
        let guestName = [];
        let guestTimes = [];
        for (var i = 0; i < res.length - 1; i++) {
          guestName.push(res[i].key);
          guestTimes.push(res[i].value);
        }
        let guestBehaveAnalysicOption = {
          title: {
            text: "访问量前5的访客",
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
              name: "访问次数",
              type: "bar",
              barWidth: "20%",
              data: guestTimes,
              itemStyle: {
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
        let drawGuestBehaveAnalysic = Echarts.init(
          document.getElementById("drawGuestBehaveAnalysic")
        );
        drawGuestBehaveAnalysic.setOption(guestBehaveAnalysicOption);
      });
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.behaviorAnalysis-wrapper {
  margin: 20px;
  .drawGuestBehave,
  .drawGuestBehaveAnalysic {
    display: inline-block;
    width: 50%;
    height: 350px;
  }
}
</style>
<template>
    <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
    import echarts from 'echarts'
    import tdTheme from './theme.json'
    import { on, off, formatData } from '@/libs/tools'
    echarts.registerTheme('tdTheme', tdTheme)
    export default {
        name: 'TrendChart',
        props: {
            xAxisData: Array,
            seriesData: Array,
            text: String,
            subtext: String,
            unit: Number
        },
        data () {
            return {
                dom: null
            }
        },
        watch: {
            xAxisData() {
                this.echartsShow()
            }
        },
        methods: {
            resize () {
                this.dom.resize()
            },
            echartsShow() {
                this.$nextTick(() => {
                    let unit=this.unit
                    let xAxisData = this.xAxisData
                    let seriesData = this.seriesData
                    let option = {
                        title: {
                            text: this.text,
                            subtext: this.subtext,
                            x: 'center'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
                            },
                            formatter: function (params, ticket, callback) {
                                var htmlStr = ''
                                for (var i = 0; i < params.length; i++) {
                                    var param = params[i]
                                    var xName = param.name// x轴的名称
                                    var seriesName = param.seriesName// 图例名称
                                    var value = param.value// y轴值
                                    var color = param.color// 图例颜色

                                    if (i === 0) {
                                        switch (unit) {
                                            case 1:
                                                htmlStr += formatData(xName, 'hour') + '<br/>'// x轴的名称
                                                break;
                                            case 2:
                                                htmlStr += formatData(xName, 'day') + '<br/>'// x轴的名称
                                                break;
                                            case 3:
                                                htmlStr += formatData(xName, '') + '<br/>'// x轴的名称
                                                break;
                                        
                                            default:
                                                break;
                                        }
                                    
                                    }
                                    htmlStr += '<div>'
                                    // 为了保证和原来的效果一样，这里自己实现了一个点的效果
                                    htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>'

                                    // 圆点后面显示的文本
                                    htmlStr += seriesName + '：' + value + 'kwh'

                                    htmlStr += '</div>'
                                }
                                return htmlStr
                            }
                        },
                        xAxis: {
                            //name: '时间',
                            type: 'category',
                            data: xAxisData,
                            axisLabel: {
                                formatter: function (value) {
                                    var texts = []
                                    switch (unit) {
                                        case 1:
                                            texts.push(formatData(value, 'onlyHour'))
                                            break;
                                        case 2:
                                            texts.push(formatData(value, 'dayMon'))
                                            break;
                                        case 3:
                                            texts.push(formatData(value, 'mon'))
                                            break;
                                    
                                        default:
                                            break;
                                    }
                                    
                                    return texts
                                }
                            },
                        },
                        yAxis: {
                            axisLabel: {
                                formatter: function (value) {
                                    var texts = []
                                    texts.push(value + ' kwh')
                                    return texts
                                }
                            },
                            type: 'value'
                        },
                        series: [{
                            data: seriesData,
                            name: '用电量',
                            stack: '总量',
                            areaStyle: { normal: {
                                color: '#2d8cf0'
                            } },
                            type: 'bar'
                        }]
                    }
                    this.dom = echarts.init(this.$refs.dom, 'tdTheme')
                    this.dom.setOption(option, true)
                    on(window, 'resize', this.resize)
                })
            }

        },
        mounted() {
            this.echartsShow()
        },
        beforeDestroy () {
            off(window, 'resize', this.resize)
        }
    }

</script>

<style lang="less">
    .charts {
        //
    }

</style>

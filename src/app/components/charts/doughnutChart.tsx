import * as echarts from 'echarts/core'

import ReactEChartsCore from 'echarts-for-react/lib/core'
import { PieChart } from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

import { numeric } from 'shared/util'
import { shortenTailText } from 'app/helper'
import { AllocationType } from 'app/constants'

echarts.use([
  TitleComponent,
  GridComponent,
  PieChart,
  CanvasRenderer,
  LegendComponent,
  TooltipComponent,
])

const buildOptions = ({
  data,
  bgTooltip = '#233333',
}: {
  data: Record<string, AllocationType>
  bgTooltip?: string
}) => {
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: bgTooltip,
      extraCssText: 'border-radius: 0px',
      formatter: function (params: any) {
        return `<div style="width: 200px; font-weight: 400"><span style="display: flex; justify-content: space-between"><span style="font-size: 14px, font-weight: 400">Value</span> <span style="font-size: 16px; font-weight: 700">${params.data.value}</span></span> <span style="display: flex; justify-content: space-between;"><span style="font-size: 14px; font-weight: 400">Token amount</span> <span style="font-size: 16px; font-weight: 700">${params.data.tokenAmount}</span></span></div>`
      },
      textStyle: {
        color: '#F4F5F5',
      },
    },
    legend: {
      top: '15%',
      right: 'right',
      orient: 'vertical',
      formatter: function (name: string) {
        const splitedString = name.split('_')
        return `{a| ${shortenTailText(splitedString[0], 7)}}{b| ${numeric(
          Number(splitedString[1]) * 100,
        ).format('0,0.[00]')}%}`
      },
      icon: 'rect',
      textStyle: {
        width: 500,
        rich: {
          a: {
            color: '#A7ADAD',
            fontSize: 14,
          },
          b: {
            width: 50,
            padding: 16,
            fontSize: 14,
            color: '#F4F5F5',
            align: 'right',
          },
        },
      },
    },
    series: [
      {
        left: 0,
        center: [100, '50%'],
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            formatter: function (params: any) {
              const splitedString = params.name.split('_')
              return splitedString[0]
            },
            fontSize: 20,
            fontWeight: 'bold',
            color: '#F4F5F5',
            overflow: 'hidden',
          },
        },

        labelLine: {
          show: false,
        },
        data: Object.values(data).map((val) => {
          return {
            value: val.usdValue,
            name: `${val.name}_${val.ratioAirdrop}`,
            tokenAmount: val.amountToken,
            percentRatio: val.ratioAirdrop,
          }
        }),
      },
    ],
    media: [
      {
        query: {
          maxWidth: 768,
        },
        option: {
          legend: {
            textStyle: {
              width: 400,
            },
          },
        },
      },
      {
        query: {
          maxWidth: 630,
        },
        option: {
          legend: {
            textStyle: {
              width: 350,
            },
          },
        },
      },
      {
        query: {
          maxWidth: 576,
        },
        option: {
          legend: {
            textStyle: {
              width: 270,
            },
          },
        },
      },
      {
        query: {
          maxWidth: 485,
        },
        option: {
          legend: {
            textStyle: {
              width: 180,
            },
          },
        },
      },
      {
        query: {
          maxWidth: 400,
        },
        option: {
          legend: {
            top: '25%',
            textStyle: {
              width: 100,
              rich: {
                a: {
                  fontSize: 10,
                },
                b: {
                  fontSize: 10,
                },
              },
            },
          },
          series: [
            {
              center: [75, '50%'],
              radius: ['30%', '50%'],
            },
          ],
        },
      },
    ],
  }
}

const DoughnutChart = ({ data }: { data: Record<string, AllocationType> }) => {
  return (
    <ReactEChartsCore
      style={{ height: 255 }}
      echarts={echarts}
      option={buildOptions({ data, bgTooltip: '#123432' })}
      notMerge={true}
      lazyUpdate={true}
    />
  )
}

export default DoughnutChart

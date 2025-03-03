// afshan

// import { BarChart } from '@mui/x-charts/BarChart';
import ReactEcharts from "echarts-for-react";

const Chart = () => {
  const options = {
    title: {
      text: "",
    },
    // tooltip: {
    //   trigger: 'axis',
    //   axisPointer: {
    //     // type: 'shadow'
    //   }
    // },
    tooltip: {
      trigger: "item", // Trigger tooltip on individual item (bar)
      backgroundColor: "#333", // Black background for the tooltip
      textStyle: {
        color: "#fff", // White text color inside the tooltip
      },
      formatter: function (params: any) {
        const month = params.name; // Get the month (e.g., 'April')
        const value = params.value; // Get the value of the bar
        let color;

        // Tooltip formatting based on the series name
        if (params.seriesName === "Revenue") {
          color = "#4CAF50"; // Green color for Revenue
          return `${month}<br/><span style="display:inline-block;width:10px;height:10px;background-color:${color};margin-right:5px;"></span>Revenue: ${value}`;
        } else if (params.seriesName === "Transaction") {
          color = "#2196F3"; // Blue color for Transaction
          return `${month}<br/><span style="display:inline-block;width:10px;height:10px;background-color:${color};margin-right:5px;"></span>Transaction: ${value}`;
        }
      },
    },
    // legend: {},
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["April", "May", "June", "July", "August", "September", "October"],
    },
    yAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
    },
    series: [
      {
        name: "Revenue",
        type: "bar",
        itemStyle: {
          color: "#4CAF50", // Set the color for Revenue bars (Green)
        },
        data: [18203, 23489, 29034, 104970, 131744, 630230, 120000], // Sample revenue data
      },
      {
        name: "Transaction",
        type: "bar",
        itemStyle: {
          color: "#2196F3", // Set the color for Transaction bars (Blue)
        },
        data: [15000, 22000, 25000, 100000, 125000, 600000, 110000], // Sample transaction data
      },
    ],
  };

  return (
    <div className="flex w-full p-6 overflow-auto">
      {/* <BarChart
      xAxis={[{ scaleType: 'band', data: ['Revenue', 'Transaction'] }]}
      series={[{ data: [200,400] }, { data: [139,56] }]}
      width={300}
      height={300}
    /> */}
      <ReactEcharts
        option={options}
        style={{ width: "100%", height: "300px", overflow: "auto" }}
      ></ReactEcharts>
    </div>
  );
};

export default Chart;

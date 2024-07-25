import { Box, Container, Text } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

// import { DateRangePicker } from 'react-date-range';
import useAuth from "../../hooks/useAuth"
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { AnalService } from "../../client";
import { useQuery } from "@tanstack/react-query"
import Chart from "react-apexcharts";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
})

function getDataQueryOptions() {
  return {
    queryFn: () =>
      AnalService.readData({ start_date: "2024-07-17", end_date: "2024-07-18" }),
    queryKey: ["chart", 2],
  }
}

function LineChart() {
  let {
    data: data } = useQuery({
      ...getDataQueryOptions(),
      placeholderData: (prevData) => prevData,
    })

  var state = {
    options: {
      chart: {
        id: 'counts per approach'
      },
      xaxis: {
        categories: data?.[0].hours.map(item => item.time)!
      }
    },
    series: [{
      name: data?.[0].approach,
      data: data?.[0].hours.map(item => item.count)!
    },
    {
      name: data?.[1].approach,
      data: data?.[1].hours.map(item => item.count)!
    },
    {
      name: data?.[2].approach,
      data: data?.[2].hours.map(item => item.count)!
    },
    {
      name: data?.[3].approach,
      data: data?.[3].hours.map(item => item.count)!
    },
    ]
  }

  return (
    <>
      <Chart
        options={state.options}
        series={state.series}
        type="line"
        width="100%"
        height="400"
      />
    </>
  )
}

// function handleRangeSelect(ranges: any) {
//   console.log(ranges);
//   state.ranges = ranges
// }

// let state = {
//   date: new Date(),
//   ranges: [
//     {
//       startDate: new Date(),
//       endDate: new Date().getDate() - 7,
//       key: 'selection',
//     },
//   ],
// }
function Dashboard() {
  const { user: currentUser } = useAuth()
  // const selectionRange = {
  //   startDate: new Date(),
  //   endDate: new Date(),
  //   key: 'selection',
  // }
  return (
    <>
      <Container maxW="full">
        <Box pt={12} m={4}>
          <Text fontSize="2xl">
            Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
          </Text>
          <Text>Welcome back, nice to see you again!</Text>
        </Box>
        {/* <DateRangePicker
          ranges={[selectionRange]}
          onChange={(handleRangeSelect)}
          showDateDisplay={true}
        /> */}
        <Box style={{ width: '100%' }}>
          <LineChart />
        </Box>
      </Container>
    </>
  )
}

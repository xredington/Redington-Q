"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { ChartContainer, ChartTooltip, ChartConfig, ChartTooltipContent } from '@repo/ui/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";

type VisitsByMonth = {
  [key: string]: number;
};

type VisitsProps = {
  visitsByMonth: VisitsByMonth;
  totalVisits: number;
  yAxisUpperBound: number;
};

const Visits: React.FC<VisitsProps> = React.memo(({ visitsByMonth, totalVisits, yAxisUpperBound }) => {
  const chartData = Object.keys(visitsByMonth).map(month => ({
    month,
    visits: visitsByMonth[month],
  }));

  return (
    <section className={`row-span-2 flex flex-col`}>
      <div className={`col-span-2 mb-7`}>
        <h2 className={`text-3xl`}>User Statistics</h2>
      </div>
      <Card className={`flex-grow dashboard-section shadow-gray-200 shadow-lg border-gray-100 border`}>
        <CardHeader className={`flex-row justify-between items-center`}>
          <CardTitle className='text-xl'>Total Visits</CardTitle>
          <CardDescription className='text-xl text-green-500'>{totalVisits}</CardDescription>
        </CardHeader>
        <CardContent className='flex items-center justify-center'>
          <ChartContainer className='w-11/12 aspect-video' config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  left: 5,
                  right: 5,
                  top: 5,
                  bottom: 5
                }}
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5AA179" stopOpacity={1} />
                    <stop offset="100%" stopColor="#5AA179" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} fill='transparent' stroke="#08762629" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  label={{ value: 'Visits', angle: -90, position: 'insideLeft' }}
                  domain={[0, yAxisUpperBound]}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="visits"
                  type="natural"
                  stroke="url(#lineGradient)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
});

export default Visits;

const chartConfig: ChartConfig = {
  visits: {
    label: "Visits",
    color: "hsl(var(--chart-1))",
  },
};

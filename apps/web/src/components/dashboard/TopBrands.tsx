"use client";
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@repo/ui/components/ui/chart";
import { Separator } from "@repo/ui/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/ui/table";

const predefinedColors = [
 " #028F45",
  "#77BF7D",
  "#34A853",
  "#66BB6A",
  "#81C784",
  "#A5D6A7",
  "#C8E6C9",
  "#E8F5E9",
];

type BrandUsage = {
  brandName: string;
  usageCount: number;
};

type TopBrandsProps = {
  brandUsage: BrandUsage[];
};

const TopBrands: React.FC<TopBrandsProps> = React.memo(({ brandUsage }) => {
  const chartConfig = useMemo(() => {
      const config: ChartConfig = {};
      brandUsage.forEach((brand, index) => {
          if (!config[brand.brandName]) {
              config[brand.brandName] = {
                  label: brand.brandName,
                  color: predefinedColors[index % predefinedColors.length],
              };
          }
      });
      return config;
  }, [brandUsage]);

  const chartData = useMemo(() => brandUsage.map((brand) => ({
      brand: brand.brandName,
      visitors: brand.usageCount,
      fill: chartConfig[brand.brandName]?.color || "#000000",
  })), [brandUsage, chartConfig]);

  return (
      <Card className={`dashboard-section h-full shadow-gray-200 shadow-lg border-gray-100 border`}>
          <CardHeader>
              <CardTitle className={`text-xl`}>Top Brands</CardTitle>
          </CardHeader>
          <Separator className={` mx-auto mb-4 w-11/12 bg-[#08762629]`} />
          <CardContent className={`flex flex-row gap-3`}>
              <Table className='w-72 border-none text-sm'>
                  <TableHeader>
                      <TableRow className={`text-[#B2B2B3] border-none`}>
                          <TableHead>Service</TableHead>
                          <TableHead className={`text-right`}>Service Used</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {brandUsage.map((brand) => (
                          <TableRow key={brand.brandName} className={`border-none text-black`}>
                              <TableCell className={'flex items-center justify-start gap-5'}>
                                  <div className={`w-4 h-3 rounded-sm`} style={{ backgroundColor: chartConfig[brand.brandName]?.color || "#000000" }} />
                                  {brand.brandName}
                              </TableCell>
                              <TableCell className={`text-right`}>{brand.usageCount}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
              <ChartContainer
                  config={chartConfig}
                  className="aspect-square max-h-32 min-h-32 min-w-32 max-w-32"
              >
                  <PieChart>
                      <ChartTooltip
                          cursor={true}
                          content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                          data={chartData}
                          dataKey="visitors"
                          nameKey="brand"
                          innerRadius={34}
                      />
                  </PieChart>
              </ChartContainer>
          </CardContent>
      </Card>
  );
});

export default TopBrands;

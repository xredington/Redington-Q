"use client";
import React, { useEffect, useMemo } from 'react';
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

type ToolUsage = {
    toolName: string;
    usageCount: number;
};

type FavToolsProps = {
    toolUsage: ToolUsage[];
};

const FavTools: React.FC<FavToolsProps> = React.memo(({ toolUsage }) => {
    const chartConfig = useMemo(() => {
        const config: ChartConfig = {};
        toolUsage.forEach((tool, index) => {
            if (!config[tool.toolName]) {
                config[tool.toolName] = {
                    label: tool.toolName,
                    color: predefinedColors[index % predefinedColors.length],
                };
            }
        });
        return config;
    }, [toolUsage]);

    const chartData = useMemo(() => toolUsage.map((tool) => ({
        tool: tool.toolName,
        visitors: tool.usageCount,
        fill: chartConfig[tool.toolName]?.color || "#000000",
    })), [toolUsage, chartConfig]);

    return (
        <Card className={`dashboard-section h-full shadow-gray-200 shadow-lg border-gray-100 border`}>
            <CardHeader>
                <CardTitle className={`text-xl`}>Top Favorite Services</CardTitle>
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
                        {toolUsage.map((tool) => (
                            <TableRow key={tool.toolName} className={`border-none text-black`}>
                                <TableCell className={'flex items-center justify-start gap-5'}>
                                    <div className={`w-4 h-3 rounded-sm`} style={{ backgroundColor: chartConfig[tool.toolName]?.color || "#000000" }} />
                                    {tool.toolName}
                                </TableCell>
                                <TableCell className={`text-right`}>{tool.usageCount}</TableCell>
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
                            nameKey="tool"
                            innerRadius={34}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
});


export default FavTools;

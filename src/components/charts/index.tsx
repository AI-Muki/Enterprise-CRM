import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useThemeStore } from '@/store/theme-store';

const CHART_COLORS = [
  'hsl(221 83% 53%)',
  'hsl(142 71% 45%)',
  'hsl(38 92% 50%)',
  'hsl(280 65% 60%)',
  'hsl(0 84% 60%)',
  'hsl(190 90% 45%)',
];

const GRID_COLOR_LIGHT = '#e2e8f0';
const GRID_COLOR_DARK = '#1e293b';
const AXIS_COLOR_LIGHT = '#94a3b8';
const AXIS_COLOR_DARK = '#475569';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>;
  label?: string;
  formatter?: (value: number) => string;
}

function ChartTooltip({ active, payload, label, formatter }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-elevated">
      {label && <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground capitalize">{entry.name}:</span>
          <span className="font-medium text-foreground">
            {formatter ? formatter(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AreaChartCard({
  data,
  dataKeys,
  xKey = 'name',
  height = 280,
  valueFormatter,
}: {
  data: Record<string, unknown>[];
  dataKeys: string[];
  xKey?: string;
  height?: number;
  valueFormatter?: (v: number) => string;
}) {
  const { theme } = useThemeStore();
  const gridColor = theme === 'dark' ? GRID_COLOR_DARK : GRID_COLOR_LIGHT;
  const axisColor = theme === 'dark' ? AXIS_COLOR_DARK : AXIS_COLOR_LIGHT;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        <defs>
          {dataKeys.map((key, i) => (
            <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS[i]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS[i]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis
          dataKey={xKey}
          stroke={axisColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={axisColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter ? (v) => valueFormatter(Number(v)) : undefined}
        />
        <Tooltip content={<ChartTooltip formatter={valueFormatter} />} />
        {dataKeys.length > 1 && <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />}
        {dataKeys.map((key, i) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={CHART_COLORS[i]}
            strokeWidth={2}
            fill={`url(#gradient-${key})`}
            animationDuration={600}
            animationEasing="ease-out"
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function LineChartCard({
  data,
  dataKeys,
  xKey = 'name',
  height = 280,
  valueFormatter,
}: {
  data: Record<string, unknown>[];
  dataKeys: string[];
  xKey?: string;
  height?: number;
  valueFormatter?: (v: number) => string;
}) {
  const { theme } = useThemeStore();
  const gridColor = theme === 'dark' ? GRID_COLOR_DARK : GRID_COLOR_LIGHT;
  const axisColor = theme === 'dark' ? AXIS_COLOR_DARK : AXIS_COLOR_LIGHT;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey={xKey} stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke={axisColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter ? (v) => valueFormatter(Number(v)) : undefined}
        />
        <Tooltip content={<ChartTooltip formatter={valueFormatter} />} />
        {dataKeys.length > 1 && <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />}
        {dataKeys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={CHART_COLORS[i]}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
            animationDuration={600}
            animationEasing="ease-out"
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BarChartCard({
  data,
  dataKeys,
  xKey = 'name',
  height = 280,
  valueFormatter,
  stacked,
}: {
  data: Record<string, unknown>[];
  dataKeys: string[];
  xKey?: string;
  height?: number;
  valueFormatter?: (v: number) => string;
  stacked?: boolean;
}) {
  const { theme } = useThemeStore();
  const gridColor = theme === 'dark' ? GRID_COLOR_DARK : GRID_COLOR_LIGHT;
  const axisColor = theme === 'dark' ? AXIS_COLOR_DARK : AXIS_COLOR_LIGHT;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey={xKey} stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke={axisColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter ? (v) => valueFormatter(Number(v)) : undefined}
        />
        <Tooltip content={<ChartTooltip formatter={valueFormatter} />} cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} />
        {dataKeys.length > 1 && <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />}
        {dataKeys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            fill={CHART_COLORS[i]}
            radius={[4, 4, 0, 0]}
            stackId={stacked ? 'stack' : undefined}
            animationDuration={600}
            animationEasing="ease-out"
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChartCard({
  data,
  height = 280,
  valueFormatter,
}: {
  data: Array<{ name: string; value: number }>;
  height?: number;
  valueFormatter?: (v: number) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          animationDuration={600}
          animationEasing="ease-out"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip formatter={valueFormatter} />} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function Sparkline({
  data,
  dataKey = 'value',
  height = 40,
  color,
}: {
  data: Record<string, unknown>[];
  dataKey?: string;
  height?: number;
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color || CHART_COLORS[0]} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color || CHART_COLORS[0]} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color || CHART_COLORS[0]}
          strokeWidth={2}
          fill="url(#sparkline-gradient)"
          animationDuration={400}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

import dayjs from "dayjs";
import {
  ScatterChart,
  Scatter,
  Tooltip,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";


// @TODO: duration should be formatted properly, not just by ms
const formatDuration = (duration) => `${duration}ms`;

const getFill = (entry) =>
  entry.status ? "#2cbd27" : "#df1a1a";

export function CanaryStatusChart({ data, ...rest }) {

  data = data || []
  let timeRange = 0;
  if (data.length > 0) {
    (new Date(data[0].time) - new Date(data[data.length - 1].time)) / 1000 / 60
  }

  // @TODO: date should be formatted properly depending on selection, not just by DD/MM
  var formatDate = (date) => dayjs(date).format("HH:mm");
  if (timeRange > 60 * 24 * 30) {
    formatDate = (date) => dayjs(date).format("MMM DD");
  } else if (timeRange > 60 * 24) {
    formatDate = (date) => dayjs(date).format("MMM DD HH:mm");
  }
  const averageDuration =
    data && data.length > 0
      ? Object.values(data).reduce(
        (acc, current) => acc + current.duration,
        0
      ) / data.length
      : null;

  return (
    <ResponsiveContainer width="100%" height="100%" {...rest}>
      <ScatterChart
        margin={{ top: 12, right: 0, bottom: 0, left: -20 }}
        data={data}
      >
        <YAxis
          tickSize={0}
          tick={<CustomYTick tickFormatter={formatDuration} />}
          stroke="rgba(200, 200, 200, 1)"
          tickMargin={4}
          tickFormatter={formatDuration}
          fontSize={12}
          padding={{}}
          dataKey="duration"
          name="Latency"
        />
        <XAxis
          tickSize={0}
          tick={<CustomXTick tickFormatter={formatDate} />}
          stroke="rgba(200, 200, 200, 1)"
          tickMargin={4}
          tickFormatter={formatDate}
          fontSize={12}
          reversed={true}
          // type="number"
          allowDuplicatedCategory={false}
          // scale="time"
          dataKey="time"
          name="Time"
        />
        <CartesianGrid
          stroke="rgba(230, 230, 230, 1)"
          strokeWidth={1}
          strokeDasharray="8 8"
        />
        <Tooltip
          animationDuration={0}
          cursor={{ stroke: "rgba(0, 0, 0, 0.12)" }}
          content={<CustomTooltip />}
        />
        <Scatter name="Check Statuses" data={data} fill="rgba(0, 255, 0, 1)">
          {data.map((entry) => (
            <Cell
              key={`cell-${entry.time}`}
              fill={getFill(entry)}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

function CustomXTick({ tickFormatter = (value) => value, ...rest }) {
  const { x, y, payload, fontSize = 12 } = rest;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#666"
        fontSize={fontSize}
      >
        {tickFormatter(payload.value)}
      </text>
    </g>
  );
}

function CustomYTick({ tickFormatter = (value) => value, ...rest }) {
  const { x, y, payload, fontSize = 12 } = rest;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-36}
        y={0}
        dy={3}
        textAnchor="start"
        fill="#666"
        fontSize={fontSize}
      >
        {tickFormatter(payload.value)}
      </text>
    </g>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col bg-white p-3 border rounded-sm text-xs">
        <p className="">
          <span className="text-gray-500">{payload[0].name}: </span>
          <span className="ml-1 text-gray-700">
            {payload[0].value}
          </span>
        </p>
        <p className="">
          <span className="text-gray-500">{payload[1].name}: </span>
          <span className="ml-1 text-gray-700">
            {formatDuration(payload[1].value)}
          </span>
        </p>
      </div>
    );
  }

  return null;
};

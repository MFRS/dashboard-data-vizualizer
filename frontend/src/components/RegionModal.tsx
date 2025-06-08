<div className="mt-4">
  <p className="font-medium mb-1">
    CPU Trend: {(region.stats.server.cpu_load * 100).toFixed(1)}%
  </p>
  <ResponsiveContainer width="100%" height={100}>
    <LineChart
      data={
        (region as any).cpuHistory?.map((v: number, i: number) => ({
          time: i,
          cpu: v * 100,
        })) ?? []
      }
    >
      <XAxis dataKey="time" hide />
      <YAxis domain={[0, 100]} hide />
      <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
      <ReferenceLine y={80} stroke="red" strokeDasharray="3 3" />
      <ReferenceArea y1={80} y2={100} fill="red" fillOpacity={0.1} />
      <Line
        type="monotone"
        dataKey="cpu"
        stroke="#3b82f6"
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  </ResponsiveContainer>
</div>;

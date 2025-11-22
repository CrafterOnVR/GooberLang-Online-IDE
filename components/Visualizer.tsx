import React from 'react';
import { PlotData } from '../types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar
} from 'recharts';
import { Activity } from 'lucide-react';

interface VisualizerProps {
  plots: PlotData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 border border-gray-700 p-2 rounded shadow-xl text-[10px] backdrop-blur z-50">
        <p className="text-gray-300 font-bold mb-1 border-b border-gray-700 pb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="font-mono">
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(4) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const Visualizer: React.FC<VisualizerProps> = ({ plots }) => {
  if (!plots || plots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 min-h-[150px]">
        <Activity size={24} className="mb-2 opacity-20" />
        <p className="text-xs">No active visualization data.</p>
        <p className="text-[10px] opacity-60">Run a script with GB.Visual.plot()</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 h-full overflow-y-auto pr-1 custom-scrollbar">
      {plots.map((plot) => (
        <div key={plot.id} className="bg-gray-900/40 rounded border border-gray-700/50 p-2 shadow-sm hover:border-gray-600 transition-colors">
          <h3 className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider flex justify-between items-center px-1">
            {plot.title}
          </h3>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {plot.type === 'line' ? (
                <LineChart data={plot.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey={plot.xAxisKey} hide />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} width={30} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1 }} />
                  <Legend iconSize={8} fontSize={9} wrapperStyle={{fontSize: '9px', opacity: 0.7, paddingTop: '5px'}} />
                  {plot.series.map((s) => (
                    <Line 
                      key={s.key} 
                      type="monotone" 
                      dataKey={s.key} 
                      stroke={s.color} 
                      name={s.name || s.key}
                      strokeWidth={2}
                      dot={false}
                      activeDot={false} 
                      isAnimationActive={false} // CRITICAL: Disable animation for smooth real-time updates
                    />
                  ))}
                </LineChart>
              ) : plot.type === 'area' ? (
                 <AreaChart data={plot.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey={plot.xAxisKey} hide />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} width={30} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1 }} />
                  <Legend iconSize={8} fontSize={9} wrapperStyle={{fontSize: '9px', opacity: 0.7, paddingTop: '5px'}} />
                  {plot.series.map((s) => (
                    <Area 
                      key={s.key} 
                      type="monotone" 
                      dataKey={s.key} 
                      stroke={s.color} 
                      fill={s.color} 
                      fillOpacity={0.2}
                      name={s.name || s.key}
                      isAnimationActive={false} // CRITICAL
                      activeDot={false}
                    />
                  ))}
                </AreaChart>
              ) : (
                 <BarChart data={plot.data}>
                   <XAxis dataKey={plot.xAxisKey} hide />
                   <YAxis hide />
                   <Tooltip content={<CustomTooltip />} />
                   <Legend iconSize={8} fontSize={9} wrapperStyle={{fontSize: '9px', opacity: 0.7}} />
                  {plot.series.map((s) => (
                    <Bar key={s.key} dataKey={s.key} fill={s.color} name={s.name || s.key} isAnimationActive={false} />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};
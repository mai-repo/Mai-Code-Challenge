"use client"

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, Label} from 'recharts';
import { useAppContext } from 'components/context';

export default function ProgressChart() {
    const { id, setData } = useAppContext();
    const [progressData, setProgressData] = useState([]);
    const [hasMounted, setHasMounted] = useState(false);
    const COLORS = ['#963E2C', '#000000'];

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (!id) return;

        async function getStatus() {
            try {
                const response = await fetch(`https://backendcodechallenge.vercel.app/getStatus?user_id=${id}`, {
                    method: "GET",
                    headers: { 'Content-Type': 'application/json' },
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.error || 'An error occurred');

                setData(result.response);
                getProgress(result.response);
            } catch (error) {
                console.error('Error:', error.message);
            }
        }

        getStatus();
    }, [id, setData]);

    function getProgress(data) {
        let completed = 0;
        let incomplete = 0;

        data.forEach(element => {
            if (element[3] === "COMPLETED") completed += 1;
            else incomplete += 1;
        });

        setProgressData([
            { name: 'Completed', value: completed },
            { name: 'Incomplete', value: incomplete }
        ]);
    }

    if (!hasMounted) return null;

    return (
        <div>
            <section className="bg-white mx-50 p-15 border-2 border-black w-1/2">
                <h1 className="text-4xl mb-10">Progress</h1>
                <div className='flex justify-center'>
                    {progressData.length > 0 ? (
                        <PieChart width={600} height={600}>
                            <Pie
                                data={progressData}
                                innerRadius={230}
                                outerRadius={240}
                                paddingAngle={5}
                                dataKey="value"
                                startAngle={180}
                                endAngle={-180}
                            >
                                {progressData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                                {progressData.map((entry, index) => (
                                <Label
                                    key={`label-${index}`}
                                    value={entry.value}
                                    position="center"
                                    fontSize={20}
                                    fill="#000000"
                                />
                            ))}
                            </Pie>
                            <Legend verticalAlign="bottom" />
                            <Tooltip />
                        </PieChart>
                    ) : (
                        <p className="text-center text-gray-500">Loading progress data...</p>
                    )}
                </div>
            </section>
        </div>
    );
}

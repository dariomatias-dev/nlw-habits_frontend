import HabitDay from "./HabitDay";
import generateDatesFromYearBeginning from './../utils/generate-dates-from-year-beginning';
import { useState, useEffect } from "react";
import { api } from './../lib/axios';
import dayjs from "dayjs";

const weekDays = [
    'D',
    'S',
    'T',
    'Q',
    'Q',
    'S',
    'S'
];

const summaryDates = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 18 * 7;
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

type SummaryProps = Array<{
    id: string;
    date: string;
    amount: number;
    completed: number;
}>;

const SummaryTable = () => {
    const [summary, setSummary] = useState<SummaryProps>([]);

    useEffect(() => {
        api.get('summary').then(res => {
            setSummary(res.data)
        });
    }, []);

    return (
        <div className="flex w-full">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {weekDays.map((weekDay, index) => {
                    return (
                        <div
                            key={`${weekDay} - ${index}`}
                            className="flex justify-center items-center h-10 w-10 text-zinc-400 text-xl font-bold"
                        >
                            {weekDay}
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {summary.length > 0 && summaryDates.map(date => {
                    const dayInSummary = summary.find(day => {
                        return dayjs(date).isSame(day.date, 'day');
                    });

                    return (
                        <HabitDay
                            key={date.toString()}
                            date={date}
                            amount={dayInSummary?.amount}
                            defaultCompleted={dayInSummary?.completed}
                        />
                    );
                })}

                {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, index) => {
                    return (
                        <div
                            key={index}
                            className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
                        />
                    )
                })}
            </div>
        </div>
    );
};

export default SummaryTable;
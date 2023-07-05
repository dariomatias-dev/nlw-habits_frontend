import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';
import { useEffect } from 'react';
import { api } from './../lib/axios';
import { useState } from 'react';
import dayjs from 'dayjs';

interface HabitsListProps {
    date: Date;
    onCompletedChanged: (completed: number) => void;
}

interface HabitsInfoProps {
    possibleHabits: Array<{
        id: string;
        tittle: string;
        created_at: string;
    }>;
    completedHabits: string[];
}

const HabitsList = ({ date, onCompletedChanged }: HabitsListProps) => {
    const [habitsInfo, setHabitsInfo] = useState<HabitsInfoProps>();

    useEffect(() => {
        api.get('day', {
            params: {
                date: date.toISOString(),
            }
        }).then(res => {
            setHabitsInfo(res.data);
        });
    }, []);

    const isDateInPast = dayjs(date)
        .endOf('day')
        .isBefore(new Date);

    const handleToggleHabit = async (habitId: string) => {
        await api.patch(`/habits/${habitId}/toggle`);
        const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId);

        let completedHabits: string[] = []

        if (isHabitAlreadyCompleted) {
            completedHabits = habitsInfo!.completedHabits.filter(id => id != habitId);
        } else {
            completedHabits = [ ...habitsInfo!.completedHabits, habitId ]
        }

        setHabitsInfo({
            possibleHabits: habitsInfo!.possibleHabits,
            completedHabits,
        });

        onCompletedChanged(completedHabits.length)
    };

    return (
        <div className='flex flex-col gap-3 mt-6'>
            {
                habitsInfo?.possibleHabits.map(habit => {
                    return (
                        <Checkbox.Root
                            key={habit.id}
                            onCheckedChange={() => handleToggleHabit(habit.id)}
                            checked={ habitsInfo.completedHabits.includes(habit.id) }
                            disabled={isDateInPast}
                            className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'
                        >
                            <div className='h-8 w-8 rounded-lg flex justify-center items-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background'>
                                <Checkbox.Indicator>
                                    <Check size={20} className='text-white' />
                                </Checkbox.Indicator>
                            </div>

                            <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                                {habit.tittle}
                            </span>
                        </Checkbox.Root>
                    )
                })
            }
        </div>
    )
}

export default HabitsList;

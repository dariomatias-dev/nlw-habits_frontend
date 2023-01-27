import { useState, FormEvent } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";
import { api } from './../lib/axios';

const availableWeekDays = [
    'Domingo',
    'Segunda0Feira',
    'Terça-Feira',
    'Quarta-Feira',
    'Quinta-Feira',
    'Sexta-Feira',
    'Sábado'
];

const NewHabitForm = () => {
    const [title, setTitle] = useState('');
    const [weekDays, setWeekDays] = useState<number[]>([])

    const createNewHabit = async (e: FormEvent) => {
        e.preventDefault();

        if (!title || weekDays.length === 0)
            return;

        await api.post('habits', {
            title,
            weekDays,
        });

        setTitle('');
        setWeekDays([]);
    };

    const handleToggleWeekDays = (weekDay: number) => {
        if (weekDays.includes(weekDay)) {
            setWeekDays(prevState => {
                return prevState.filter(day => day !== weekDay);
            });
        } else {
            setWeekDays(prevState => [ ...prevState, weekDay ]);
        }
    };

    return (
        <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
            <label htmlFor="title" className="font-semibold leading-tight">
                Qual seu compromentimento?
            </label>

            <input
                type="text"
                id="title"
                placeholder="ex.: Exercícios, dormir bem, etc..."
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
                autoFocus
                onChange={e => setTitle(e.target.value)}
            />

            <label htmlFor="" className="font-semibold leading-tight mt-4">
                Qual a recorência?
            </label>

            <div className="flex flex-col gap-2 mt-3">
                {
                    availableWeekDays.map((weekDay, index) => {
                        return (
                            <Checkbox.Root
                                key={weekDay}
                                className='flex items-center gap-3 group'
                                checked={weekDay.includes(index)}
                                onCheckedChange={() => handleToggleWeekDays(index)}
                            >
                                <div className='h-8 w-8 rounded-lg flex justify-center items-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500'>
                                    <Checkbox.Indicator>
                                        <Check size={20} className='text-white' />
                                    </Checkbox.Indicator>
                                </div>

                                <span className='text-white leading-tight'>
                                    {weekDay}
                                </span>
                            </Checkbox.Root>
                        )
                    })
                }

            </div>

            <button type="submit" className="mt-6 rounded-lg p-4 flex  justify-center items-center gap-3 font-semibold bg-green-600 hover:bg-green-500">
                <Check size={20} weight="bold" />
                Confirmar
            </button>
        </form>
    );
};

export default NewHabitForm;

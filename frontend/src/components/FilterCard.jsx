import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { MapPin, Briefcase, DollarSign, X } from 'lucide-react'

const fitlerData = [
    {
        fitlerType: "Location",
        icon: MapPin,
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        fitlerType: "Industry",
        icon: Briefcase,
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "Data Science", "UI/UX Designer"]
    },
    {
        fitlerType: "Salary",
        icon: DollarSign,
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh", "5lakh+"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();
    const changeHandler = (value) => {
        setSelectedValue(value);
    }
    
    const clearFilters = () => {
        setSelectedValue('');
        dispatch(setSearchedQuery(''));
    }

    useEffect(()=>{
        dispatch(setSearchedQuery(selectedValue));
    },[selectedValue]);

    return (
        <div className='w-full bg-white rounded-2xl border-2 border-gray-100 shadow-lg overflow-hidden'>
            {/* Header */}
            <div className='gradient-primary p-4 text-white'>
                <div className='flex items-center justify-between'>
                    <h2 className='font-bold text-xl'>Filters</h2>
                    {selectedValue && (
                        <Button
                            onClick={clearFilters}
                            variant='ghost'
                            size='sm'
                            className='text-white hover:bg-white/20 hover:text-white rounded-lg'
                        >
                            <X className='w-4 h-4 mr-1' />
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Filter Content */}
            <div className='p-4'>
                <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                    {
                        fitlerData.map((data, index) => {
                            const Icon = data.icon;
                            return (
                                <div key={index} className='mb-6 last:mb-0'>
                                    <div className='flex items-center gap-2 mb-3 pb-2 border-b border-gray-100'>
                                        <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center'>
                                            <Icon className='w-4 h-4 text-purple-600' />
                                        </div>
                                        <h3 className='font-semibold text-gray-900'>{data.fitlerType}</h3>
                                    </div>
                                    <div className='space-y-2 ml-2'>
                                        {
                                            data.array.map((item, idx) => {
                                                const itemId = `id${index}-${idx}`
                                                const isSelected = selectedValue === item;
                                                return (
                                                    <div 
                                                        key={itemId}
                                                        className={`flex items-center space-x-3 p-2 rounded-lg transition-all cursor-pointer ${
                                                            isSelected 
                                                                ? 'bg-purple-50 border border-purple-200' 
                                                                : 'hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <RadioGroupItem 
                                                            value={item} 
                                                            id={itemId}
                                                            className='border-gray-300 text-purple-600'
                                                        />
                                                        <Label 
                                                            htmlFor={itemId} 
                                                            className={`cursor-pointer flex-1 text-sm ${
                                                                isSelected ? 'font-medium text-purple-700' : 'text-gray-700'
                                                            }`}
                                                        >
                                                            {item}
                                                        </Label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </RadioGroup>

                {/* Active Filter Display */}
                {selectedValue && (
                    <div className='mt-6 pt-6 border-t border-gray-100'>
                        <p className='text-xs text-muted-foreground mb-2'>Active Filter:</p>
                        <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium'>
                            <span>{selectedValue}</span>
                            <button onClick={clearFilters} className='hover:bg-purple-200 rounded-full p-0.5'>
                                <X className='w-3 h-3' />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FilterCard
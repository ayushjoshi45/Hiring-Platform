import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

const Browse = () => {
    useGetAllJobs();
    const {allJobs, searchedQuery} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[])
    return (
        <div className='min-h-screen bg-gradient-to-b from-purple-50/30 to-white'>
            <Navbar />
            <div className='pt-24 pb-12'>
                <div className='max-w-7xl mx-auto px-6'>
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='mb-12 text-center'
                    >
                        <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-medium mb-4'>
                            <Search className='w-4 h-4' />
                            <span>Browse Results</span>
                        </div>
                        <h1 className='text-4xl md:text-5xl font-bold mb-4'>
                            {searchedQuery ? (
                                <>
                                    Results for <span className='text-gradient'>"{searchedQuery}"</span>
                                </>
                            ) : (
                                <>
                                    All Available <span className='text-gradient'>Opportunities</span>
                                </>
                            )}
                        </h1>
                        <p className='text-muted-foreground text-lg'>
                            Found <span className='font-semibold text-purple-600'>{allJobs.length}</span> {allJobs.length === 1 ? 'job' : 'jobs'} matching your search
                        </p>
                    </motion.div>

                    {/* Jobs Grid */}
                    {allJobs.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-20'>
                            <div className='w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-6'>
                                <Sparkles className='w-12 h-12 text-purple-400' />
                            </div>
                            <h3 className='text-2xl font-bold text-gray-900 mb-2'>No Results Found</h3>
                            <p className='text-muted-foreground text-center max-w-md'>
                                We couldn't find any jobs matching your search. Try different keywords or browse all available positions.
                            </p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {
                                allJobs.map((job, index) => (
                                    <motion.div
                                        key={job._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Job job={job}/>
                                    </motion.div>
                                ))
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Browse
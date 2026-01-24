import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Briefcase } from 'lucide-react';
import { Button } from './ui/button';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase())
            })
            setFilterJobs(filteredJobs)
        } else {
            setFilterJobs(allJobs)
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className='min-h-screen bg-gradient-to-b from-purple-50/30 to-white'>
            <Navbar />
            <div className='pt-24 pb-12'>
                <div className='max-w-7xl mx-auto px-6'>
                    {/* Header */}
                    <div className='mb-8'>
                        <h1 className='text-4xl font-bold mb-3'>
                            Discover <span className='text-gradient'>Your Next Opportunity</span>
                        </h1>
                        <p className='text-muted-foreground text-lg'>
                            Showing {filterJobs.length} {filterJobs.length === 1 ? 'job' : 'jobs'} {searchedQuery && `for "${searchedQuery}"`}
                        </p>
                    </div>

                    <div className='flex gap-6'>
                        {/* Filter Sidebar - Desktop */}
                        <div className='hidden lg:block w-80 shrink-0'>
                            <div className='sticky top-24'>
                                <FilterCard />
                            </div>
                        </div>

                        {/* Mobile Filter Button */}
                        <div className='lg:hidden fixed bottom-6 right-6 z-40'>
                            <Button
                                onClick={() => setShowFilters(!showFilters)}
                                className='gradient-primary text-white rounded-full w-14 h-14 shadow-2xl hover:scale-110 transition-all'
                                size='icon'
                            >
                                <SlidersHorizontal className='w-6 h-6' />
                            </Button>
                        </div>

                        {/* Mobile Filter Overlay */}
                        {showFilters && (
                            <div className='lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm' onClick={() => setShowFilters(false)}>
                                <motion.div
                                    initial={{ x: -300 }}
                                    animate={{ x: 0 }}
                                    exit={{ x: -300 }}
                                    className='absolute left-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto'
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className='flex items-center justify-between mb-6'>
                                        <h2 className='text-xl font-bold'>Filters</h2>
                                        <button onClick={() => setShowFilters(false)} className='text-gray-500 hover:text-gray-700'>
                                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                            </svg>
                                        </button>
                                    </div>
                                    <FilterCard />
                                </motion.div>
                            </div>
                        )}

                        {/* Jobs Grid */}
                        <div className='flex-1 min-w-0'>
                            {
                                filterJobs.length <= 0 ? (
                                    <div className='flex flex-col items-center justify-center py-20'>
                                        <div className='w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-6'>
                                            <Briefcase className='w-12 h-12 text-purple-400' />
                                        </div>
                                        <h3 className='text-2xl font-bold text-gray-900 mb-2'>No Jobs Found</h3>
                                        <p className='text-muted-foreground text-center max-w-md mb-6'>
                                            We couldn't find any jobs matching your criteria. Try adjusting your filters or search terms.
                                        </p>
                                        <Button
                                            onClick={() => window.location.reload()}
                                            className='gradient-primary text-white rounded-xl'
                                        >
                                            <Search className='w-4 h-4 mr-2' />
                                            Browse All Jobs
                                        </Button>
                                    </div>
                                ) : (
                                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                                        {
                                            filterJobs.map((job, index) => (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                    key={job?._id}
                                                >
                                                    <Job job={job} />
                                                </motion.div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jobs
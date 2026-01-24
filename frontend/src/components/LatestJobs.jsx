import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const LatestJobs = () => {
    const {allJobs} = useSelector(store=>store.job);
    const navigate = useNavigate();
   
    return (
        <div className='py-20 bg-gradient-to-b from-purple-50/30 to-transparent'>
            <div className='max-w-7xl mx-auto px-6'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className='text-center mb-12'
                >
                    <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-medium mb-4'>
                        <TrendingUp className='w-4 h-4' />
                        <span>Trending Now</span>
                    </div>
                    <h2 className='text-4xl md:text-5xl font-bold mb-4'>
                        <span className='text-gradient'>Latest & Top</span> Job Openings
                    </h2>
                    <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
                        Discover the newest opportunities from top companies and kickstart your career journey
                    </p>
                </motion.div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
                    {
                        allJobs.length <= 0 ? (
                            <div className='col-span-full text-center py-20'>
                                <div className='w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4'>
                                    <Sparkles className='w-10 h-10 text-gray-400' />
                                </div>
                                <h3 className='text-xl font-semibold text-gray-600 mb-2'>No Jobs Available</h3>
                                <p className='text-muted-foreground'>Check back later for new opportunities</p>
                            </div>
                        ) : allJobs?.slice(0,6).map((job, index) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <LatestJobCards job={job}/>
                            </motion.div>
                        ))
                    }
                </div>

                {allJobs.length > 6 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className='text-center'
                    >
                        <Button
                            onClick={() => navigate('/jobs')}
                            size="lg"
                            className='gradient-primary text-white rounded-full px-8 hover:shadow-lg hover:scale-105 transition-all'
                        >
                            View All Jobs
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default LatestJobs
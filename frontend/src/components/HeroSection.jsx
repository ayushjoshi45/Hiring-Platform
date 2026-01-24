import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search, TrendingUp, Users, Award, ArrowRight, Sparkles } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    const stats = [
        { icon: Briefcase, value: "50K+", label: "Jobs Posted" },
        { icon: Users, value: "100K+", label: "Active Users" },
        { icon: Award, value: "500+", label: "Companies" },
        { icon: TrendingUp, value: "95%", label: "Success Rate" },
    ];

    return (
        <div className='relative min-h-[90vh] flex items-center justify-center overflow-hidden'>
            {/* Animated Background Elements */}
            <div className='absolute inset-0 -z-10'>
                <div className='absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float'></div>
                <div className='absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float' style={{animationDelay: '2s'}}></div>
                <div className='absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float' style={{animationDelay: '4s'}}></div>
            </div>

            <div className='max-w-7xl mx-auto px-6 py-20'>
                <div className='text-center'>
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className='inline-block'
                    >
                        <div className='inline-flex items-center gap-2 px-6 py-3 rounded-full glass-effect border border-purple-200 mb-8'>
                            <Sparkles className='w-5 h-5 text-purple-600' />
                            <span className='font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                                #1 Platform for Career Growth
                            </span>
                            <Sparkles className='w-5 h-5 text-purple-600' />
                        </div>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className='text-5xl md:text-7xl font-bold mb-6 leading-tight'
                    >
                        Find Your <span className='text-gradient'>Dream Career</span>
                        <br />
                        <span className='text-4xl md:text-6xl'>Land Your Perfect Job</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className='text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto'
                    >
                        Connect with top companies and discover opportunities that match your skills.
                        Start your journey to success today.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className='max-w-2xl mx-auto mb-16'
                    >
                        <div className='flex flex-col sm:flex-row gap-3 p-2 glass-effect rounded-2xl shadow-2xl'>
                            <div className='flex-1 flex items-center gap-3 px-4 bg-white rounded-xl'>
                                <Search className='w-5 h-5 text-gray-400' />
                                <input
                                    type="text"
                                    placeholder='Search by job title, company, or keyword...'
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && searchJobHandler()}
                                    className='flex-1 outline-none border-none py-4 text-base bg-transparent'
                                />
                            </div>
                            <Button
                                onClick={searchJobHandler}
                                size="lg"
                                className="gradient-primary text-white rounded-xl px-8 hover:shadow-lg hover:scale-105 transition-all font-semibold"
                            >
                                Search Jobs
                                <ArrowRight className='ml-2 w-5 h-5' />
                            </Button>
                        </div>

                        {/* Popular Searches */}
                        <div className='mt-4 flex flex-wrap items-center justify-center gap-2'>
                            <span className='text-sm text-muted-foreground'>Popular:</span>
                            {['Frontend Developer', 'UI/UX Designer', 'Product Manager', 'Data Scientist'].map((term) => (
                                <button
                                    key={term}
                                    onClick={() => {
                                        setQuery(term);
                                        dispatch(setSearchedQuery(term));
                                        navigate("/browse");
                                    }}
                                    className='px-3 py-1 text-sm rounded-full bg-white/80 hover:bg-white border border-gray-200 hover:border-primary transition-all hover:shadow-md'
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto'
                    >
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                                    className='glass-effect rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1'
                                >
                                    <div className='w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3'>
                                        <Icon className='w-6 h-6 text-white' />
                                    </div>
                                    <h3 className='text-2xl font-bold mb-1'>{stat.value}</h3>
                                    <p className='text-sm text-muted-foreground'>{stat.label}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

const Briefcase = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

export default HeroSection
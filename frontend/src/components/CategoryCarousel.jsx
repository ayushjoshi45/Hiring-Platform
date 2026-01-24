import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Code, Database, Palette, Layers, Brain, Smartphone, Cloud, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
    { name: "Frontend Developer", icon: Code, color: "from-blue-500 to-cyan-500" },
    { name: "Backend Developer", icon: Database, color: "from-green-500 to-emerald-500" },
    { name: "Data Science", icon: Brain, color: "from-purple-500 to-pink-500" },
    { name: "UI/UX Designer", icon: Palette, color: "from-orange-500 to-red-500" },
    { name: "FullStack Developer", icon: Layers, color: "from-indigo-500 to-purple-500" },
    { name: "Mobile Developer", icon: Smartphone, color: "from-teal-500 to-green-500" },
    { name: "DevOps Engineer", icon: Cloud, color: "from-sky-500 to-blue-500" },
    { name: "Security Analyst", icon: Shield, color: "from-red-500 to-pink-500" },
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='py-20 bg-gradient-to-b from-transparent to-purple-50/30'>
            <div className='max-w-7xl mx-auto px-6'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className='text-center mb-12'
                >
                    <h2 className='text-4xl font-bold mb-4'>
                        Explore by <span className='text-gradient'>Category</span>
                    </h2>
                    <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
                        Browse jobs by popular categories and find the perfect role that matches your expertise
                    </p>
                </motion.div>

                <Carousel 
                    className="w-full max-w-6xl mx-auto"
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {
                            categories.map((cat, index) => {
                                const Icon = cat.icon;
                                return (
                                    <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            whileHover={{ y: -8 }}
                                            className='h-full'
                                        >
                                            <button
                                                onClick={() => searchJobHandler(cat.name)}
                                                className='group w-full h-full p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300'
                                            >
                                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                                    <Icon className='w-8 h-8 text-white' />
                                                </div>
                                                <h3 className='font-semibold text-gray-800 group-hover:text-purple-600 transition-colors'>
                                                    {cat.name}
                                                </h3>
                                                <p className='text-sm text-muted-foreground mt-2'>
                                                    Explore jobs
                                                </p>
                                            </button>
                                        </motion.div>
                                    </CarouselItem>
                                )
                            })
                        }
                    </CarouselContent>
                    <CarouselPrevious className='hidden md:flex' />
                    <CarouselNext className='hidden md:flex' />
                </Carousel>
            </div>
        </div>
    )
}

export default CategoryCarousel
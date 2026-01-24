import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, DollarSign, ArrowRight, Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { motion } from 'framer-motion'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    
    const daysAgo = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        const days = Math.floor(timeDifference/(1000*24*60*60));
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return `${days} days ago`;
    }

    return (
        <motion.div
            onClick={()=> navigate(`/description/${job._id}`)}
            whileHover={{ y: -4 }}
            className='group relative p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-purple-200 cursor-pointer transition-all duration-300 hover:shadow-2xl overflow-hidden'
        >
            {/* Gradient overlay on hover */}
            <div className='absolute inset-0 bg-gradient-to-br from-purple-50/0 to-pink-50/0 group-hover:from-purple-50/50 group-hover:to-pink-50/50 transition-all duration-300' />
            
            <div className='relative z-10'>
                {/* Header */}
                <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-2 group-hover:scale-110 transition-transform'>
                            <Avatar className='w-full h-full'>
                                <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                            </Avatar>
                        </div>
                        <div>
                            <h3 className='font-semibold text-gray-900 group-hover:text-purple-600 transition-colors'>
                                {job?.company?.name}
                            </h3>
                            <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                                <MapPin className='w-3 h-3' />
                                <span>{job?.location || 'Remote'}</span>
                            </div>
                        </div>
                    </div>
                    <button className='p-2 rounded-lg hover:bg-purple-100 transition-colors'>
                        <Bookmark className='w-5 h-5 text-gray-400 hover:text-purple-600' />
                    </button>
                </div>

                {/* Job Title & Description */}
                <div className='mb-4'>
                    <h2 className='font-bold text-xl mb-2 text-gray-900 group-hover:text-purple-700 transition-colors'>
                        {job?.title}
                    </h2>
                    <p className='text-sm text-muted-foreground line-clamp-2'>
                        {job?.description}
                    </p>
                </div>

                {/* Badges */}
                <div className='flex flex-wrap gap-2 mb-4'>
                    <Badge className='bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 font-medium'>
                        {job?.position} Positions
                    </Badge>
                    <Badge className='bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200 font-medium'>
                        {job?.jobType}
                    </Badge>
                    <Badge className='bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200 font-medium'>
                        <DollarSign className='w-3 h-3 mr-1' />
                        {job?.salary} LPA
                    </Badge>
                </div>

                {/* Footer */}
                <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                    <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                        <Clock className='w-4 h-4' />
                        <span>{daysAgo(job?.createdAt)}</span>
                    </div>
                    <div className='flex items-center gap-1 text-purple-600 font-medium group-hover:gap-2 transition-all'>
                        <span className='text-sm'>View Details</span>
                        <ArrowRight className='w-4 h-4' />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default LatestJobCards
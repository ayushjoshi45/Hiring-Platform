import React from 'react'
import { Button } from './ui/button'
import { Bookmark, MapPin, Clock, DollarSign, Briefcase } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

const Job = ({job}) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    const daysAgoFunction = (mongodbTime) => {
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
            whileHover={{ y: -4 }}
            className='group p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-purple-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden relative'
        >
            {/* Gradient overlay on hover */}
            <div className='absolute inset-0 bg-gradient-to-br from-purple-50/0 to-pink-50/0 group-hover:from-purple-50/50 group-hover:to-pink-50/50 transition-all duration-300' />
            
            <div className='relative z-10'>
                {/* Header */}
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-2'>
                        <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                            <Clock className='w-4 h-4' />
                            <span>{daysAgoFunction(job?.createdAt)}</span>
                        </div>
                        <span className='w-1.5 h-1.5 rounded-full bg-gray-300'></span>
                        <Badge className='bg-green-50 text-green-700 hover:bg-green-100 border-green-200'>
                            Actively Hiring
                        </Badge>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full hover:bg-purple-100 transition-colors"
                    >
                        <Bookmark className='h-5 w-5 text-gray-400 hover:text-purple-600' />
                    </motion.button>
                </div>

                {/* Company Info */}
                <div className='flex items-center gap-3 mb-4'>
                    <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-2 group-hover:scale-110 transition-transform'>
                        <Avatar className='w-full h-full'>
                            <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                        </Avatar>
                    </div>
                    <div className='flex-1'>
                        <h3 className='font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors'>
                            {job?.company?.name}
                        </h3>
                        <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                            <MapPin className='w-3 h-3' />
                            <span>{job?.location || 'India'}</span>
                        </div>
                    </div>
                </div>

                {/* Job Details */}
                <div className='mb-4'>
                    <h2 className='font-bold text-xl mb-2 text-gray-900 group-hover:text-purple-700 transition-colors'>
                        {job?.title}
                    </h2>
                    <p className='text-sm text-muted-foreground line-clamp-3 leading-relaxed'>
                        {job?.description}
                    </p>
                </div>

                {/* Badges */}
                <div className='flex flex-wrap gap-2 mb-5'>
                    <Badge className='bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 font-medium'>
                        <Briefcase className='w-3 h-3 mr-1' />
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

                                {/* Action Buttons */}
                <div className='flex items-center gap-3 pt-4 border-t border-gray-100'>
                    <Button 
                        onClick={() => navigate(`/description/${job?._id}`)} 
                        className='flex-1 gradient-primary text-white hover:shadow-lg transition-all rounded-xl'
                    >
                        View Details
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={() => {
                            if (!user) {
                                toast.error("Please login to save jobs");
                                navigate('/login');
                            } else {
                                toast.success("Job saved for later");
                            }
                        }}
                        className='flex-1 rounded-xl hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all'
                    >
                        <Bookmark className='w-4 h-4 mr-2' />
                        Save
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}

export default Job
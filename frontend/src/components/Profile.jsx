import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, Phone, MapPin, Briefcase, Calendar, Download, Edit, Award, Target } from 'lucide-react'
import { Badge } from './ui/badge'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { motion } from 'framer-motion'
import Footer from './shared/Footer'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);

    return (
        <div className='min-h-screen bg-gradient-to-b from-purple-50/30 to-white'>
            <Navbar />
            
            {/* Hero Section with Cover */}
            <div className='relative'>
                <div className='h-48 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-gradient'></div>
                <div className='max-w-6xl mx-auto px-6 -mt-20'>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-white rounded-3xl shadow-2xl p-8 border border-gray-100'
                    >
                        {/* Profile Header */}
                        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                            <div className='flex items-center gap-6'>
                                <div className='relative'>
                                    <Avatar className="h-28 w-28 ring-4 ring-white shadow-xl">
                                        <AvatarImage src={user?.profile?.profilePhoto || 'https://github.com/shadcn.png'} alt="profile" />
                                    </Avatar>
                                    <div className='absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white'></div>
                                </div>
                                <div>
                                    <h1 className='text-3xl font-bold text-gray-900'>{user?.fullname}</h1>
                                    <p className='text-muted-foreground mt-1'>{user?.profile?.bio || 'No bio added yet'}</p>
                                    <div className='flex items-center gap-2 mt-2'>
                                        <Badge className='bg-purple-100 text-purple-700 hover:bg-purple-200'>Job Seeker</Badge>
                                        <Badge className='bg-green-100 text-green-700 hover:bg-green-200'>Active</Badge>
                                    </div>
                                </div>
                            </div>
                            <Button onClick={() => setOpen(true)} className='gradient-primary text-white rounded-xl px-6 hover:shadow-lg transition-all'>
                                <Edit className='w-4 h-4 mr-2' />
                                Edit Profile
                            </Button>
                        </div>

                        {/* Contact Info Grid */}
                        <div className='grid md:grid-cols-2 gap-4 mt-8'>
                            <div className='flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100'>
                                <div className='w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center'>
                                    <Mail className='w-5 h-5 text-purple-600' />
                                </div>
                                <div>
                                    <p className='text-xs text-muted-foreground'>Email Address</p>
                                    <p className='font-semibold text-gray-900'>{user?.email}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100'>
                                <div className='w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center'>
                                    <Phone className='w-5 h-5 text-blue-600' />
                                </div>
                                <div>
                                    <p className='text-xs text-muted-foreground'>Phone Number</p>
                                    <p className='font-semibold text-gray-900'>{user?.phoneNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className='mt-8 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100'>
                            <div className='flex items-center gap-2 mb-4'>
                                <div className='w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center'>
                                    <Award className='w-5 h-5 text-purple-600' />
                                </div>
                                <h2 className='text-xl font-bold text-gray-900'>Skills & Expertise</h2>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {
                                    user?.profile?.skills?.length > 0 ? 
                                        user.profile.skills.map((item, index) => (
                                            <Badge key={index} className='bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-100 px-4 py-2 text-sm font-medium'>
                                                {item}
                                            </Badge>
                                        )) : 
                                        <p className='text-muted-foreground'>No skills added yet. Add your skills to stand out!</p>
                                }
                            </div>
                        </div>

                        {/* Resume Section */}
                        <div className='mt-8 p-6 rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-100'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                    <div className='w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center'>
                                        <Briefcase className='w-5 h-5 text-green-600' />
                                    </div>
                                    <h2 className='text-xl font-bold text-gray-900'>Resume</h2>
                                </div>
                                {
                                    user?.profile?.resume && (
                                        <a 
                                            target='_blank' 
                                            rel='noopener noreferrer'
                                            href={user.profile.resume} 
                                            className='flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all hover:shadow-lg'
                                        >
                                            <Download className='w-4 h-4' />
                                            Download
                                        </a>
                                    )
                                }
                            </div>
                            <div className='mt-4'>
                                {
                                    user?.profile?.resume ? (
                                        <div className='flex items-center gap-3 p-4 bg-white rounded-xl border border-green-200'>
                                            <div className='w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center'>
                                                <svg className='w-6 h-6 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                                                    <path d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z' />
                                                </svg>
                                            </div>
                                            <div className='flex-1'>
                                                <p className='font-semibold text-gray-900'>{user.profile.resumeOriginalName}</p>
                                                <p className='text-sm text-muted-foreground'>Click download to view</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='text-center py-8'>
                                            <p className='text-muted-foreground mb-3'>No resume uploaded yet</p>
                                            <Button onClick={() => setOpen(true)} variant='outline' className='rounded-xl'>
                                                <Upload className='w-4 h-4 mr-2' />
                                                Upload Resume
                                            </Button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </motion.div>

                    {/* Applied Jobs Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className='mt-8 mb-12'
                    >
                        <div className='bg-white rounded-3xl shadow-xl p-8 border border-gray-100'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='w-12 h-12 rounded-xl gradient-primary flex items-center justify-center'>
                                    <Target className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <h2 className='text-2xl font-bold text-gray-900'>Application History</h2>
                                    <p className='text-muted-foreground'>Track all your job applications</p>
                                </div>
                            </div>
                            <AppliedJobTable />
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

const Upload = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

export default Profile
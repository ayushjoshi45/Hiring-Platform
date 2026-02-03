import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, Briefcase, Users, Calendar } from 'lucide-react';

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

        const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

        const applyJobHandler = async () => {
        // Check if user is logged in
        if (!user) {
            toast.error("Please login to apply for this job");
            navigate('/login');
            return;
        }

        // Check if user is a student (not recruiter)
        if (user.role !== 'student') {
            toast.error("Only job seekers can apply for jobs");
            return;
        }

        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true); // Update the local state
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

        return (
        <div className='min-h-screen bg-linear-to-b from-purple-50/30 to-white'>
            <Navbar />
            
            <div className='pt-24 pb-12'>
                <div className='max-w-5xl mx-auto px-6'>
                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate(-1)}
                        className='flex items-center gap-2 text-muted-foreground hover:text-purple-600 mb-6 transition-colors'
                    >
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                        </svg>
                        Back to Jobs
                    </motion.button>

                    {/* Main Job Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100'
                    >
                        {/* Header Section */}
                        <div className='bg-linear-to-r from-purple-600 via-pink-500 to-purple-600 p-8 text-white'>
                            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                                <div className='flex items-start gap-4'>
                                    <div className='w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center p-3'>
                                        <div className='w-full h-full rounded-xl bg-white flex items-center justify-center'>
                                            <Briefcase className='w-8 h-8 text-purple-600' />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className='text-3xl font-bold mb-2'>{singleJob?.title}</h1>
                                        <p className='text-purple-100 text-lg'>{singleJob?.company?.name}</p>
                                        <div className='flex items-center gap-2 mt-3'>
                                            <MapPin className='w-4 h-4' />
                                            <span className='text-purple-100'>{singleJob?.location || 'Remote'}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={isApplied ? null : applyJobHandler}
                                    disabled={isApplied}
                                    className={`px-8 py-6 text-lg font-semibold rounded-2xl transition-all ${
                                        isApplied 
                                            ? 'bg-white/20 cursor-not-allowed' 
                                            : 'bg-white text-purple-600 hover:bg-purple-50 hover:scale-105 shadow-lg'
                                    }`}
                                >
                                    {isApplied ? (
                                        <>
                                            <svg className='w-5 h-5 mr-2 inline' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                            </svg>
                                            Already Applied
                                        </>
                                    ) : (
                                        'Apply Now'
                                    )}
                                </Button>
                            </div>

                            {/* Quick Info Badges */}
                            <div className='flex flex-wrap gap-3 mt-6'>
                                <div className='px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20'>
                                    <div className='flex items-center gap-2'>
                                        <Briefcase className='w-4 h-4' />
                                        <span className='font-semibold'>{singleJob?.postion} Positions</span>
                                    </div>
                                </div>
                                <div className='px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20'>
                                    <div className='flex items-center gap-2'>
                                        <Clock className='w-4 h-4' />
                                        <span className='font-semibold'>{singleJob?.jobType}</span>
                                    </div>
                                </div>
                                <div className='px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20'>
                                    <div className='flex items-center gap-2'>
                                        <DollarSign className='w-4 h-4' />
                                        <span className='font-semibold'>{singleJob?.salary} LPA</span>
                                    </div>
                                </div>
                                <div className='px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20'>
                                    <div className='flex items-center gap-2'>
                                        <Users className='w-4 h-4' />
                                        <span className='font-semibold'>{singleJob?.applications?.length} Applicants</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Details Content */}
                        <div className='p-8'>
                            {/* Job Description */}
                            <div className='mb-8'>
                                <h2 className='text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
                                    <div className='w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center'>
                                        <svg className='w-5 h-5 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                                        </svg>
                                    </div>
                                    Job Description
                                </h2>
                                <p className='text-gray-700 leading-relaxed text-lg'>
                                    {singleJob?.description}
                                </p>
                            </div>

                            {/* Job Details Grid */}
                            <div className='grid md:grid-cols-2 gap-6'>
                                {/* Role */}
                                <div className='p-6 rounded-2xl bg-linear-to-br from-blue-50 to-white border border-blue-100'>
                                    <div className='flex items-center gap-3 mb-2'>
                                        <div className='w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center'>
                                            <Briefcase className='w-5 h-5 text-blue-600' />
                                        </div>
                                        <h3 className='font-semibold text-gray-600'>Role</h3>
                                    </div>
                                    <p className='text-xl font-bold text-gray-900 ml-13'>{singleJob?.title}</p>
                                </div>

                                {/* Location */}
                                <div className='p-6 rounded-2xl bg-linear-to-br from-green-50 to-white border border-green-100'>
                                    <div className='flex items-center gap-3 mb-2'>
                                        <div className='w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center'>
                                            <MapPin className='w-5 h-5 text-green-600' />
                                        </div>
                                        <h3 className='font-semibold text-gray-600'>Location</h3>
                                    </div>
                                    <p className='text-xl font-bold text-gray-900 ml-13'>{singleJob?.location}</p>
                                </div>

                                {/* Experience */}
                                <div className='p-6 rounded-2xl bg-linear-to-br from-purple-50 to-white border border-purple-100'>
                                    <div className='flex items-center gap-3 mb-2'>
                                        <div className='w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center'>
                                            <Calendar className='w-5 h-5 text-purple-600' />
                                        </div>
                                        <h3 className='font-semibold text-gray-600'>Experience Required</h3>
                                    </div>
                                    <p className='text-xl font-bold text-gray-900 ml-13'>{singleJob?.experience} years</p>
                                </div>

                                {/* Salary */}
                                <div className='p-6 rounded-2xl bg-linear-to-br from-orange-50 to-white border border-orange-100'>
                                    <div className='flex items-center gap-3 mb-2'>
                                        <div className='w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center'>
                                            <DollarSign className='w-5 h-5 text-orange-600' />
                                        </div>
                                        <h3 className='font-semibold text-gray-600'>Salary</h3>
                                    </div>
                                    <p className='text-xl font-bold text-gray-900 ml-13'>{singleJob?.salary} LPA</p>
                                </div>

                                {/* Posted Date */}
                                <div className='p-6 rounded-2xl bg-linear-to-br from-pink-50 to-white border border-pink-100'>
                                    <div className='flex items-center gap-3 mb-2'>
                                        <div className='w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center'>
                                            <Clock className='w-5 h-5 text-pink-600' />
                                        </div>
                                        <h3 className='font-semibold text-gray-600'>Posted Date</h3>
                                    </div>
                                    <p className='text-xl font-bold text-gray-900 ml-13'>
                                        {new Date(singleJob?.createdAt).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>

                                {/* Total Applicants */}
                                <div className='p-6 rounded-2xl bg-linear-to-br from-cyan-50 to-white border border-cyan-100'>
                                    <div className='flex items-center gap-3 mb-2'>
                                        <div className='w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center'>
                                            <Users className='w-5 h-5 text-cyan-600' />
                                        </div>
                                        <h3 className='font-semibold text-gray-600'>Total Applicants</h3>
                                    </div>
                                    <p className='text-xl font-bold text-gray-900 ml-13'>{singleJob?.applications?.length || 0} candidates</p>
                                </div>
                            </div>

                            {/* Apply CTA */}
                            {!isApplied && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className='mt-8 p-6 rounded-2xl bg-linear-to-r from-purple-100 to-pink-100 border-2 border-purple-200'
                                >
                                    <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                                        <div>
                                            <h3 className='text-xl font-bold text-gray-900 mb-1'>Interested in this position?</h3>
                                            <p className='text-gray-600'>Submit your application and take the next step in your career!</p>
                                        </div>
                                        <Button
                                            onClick={applyJobHandler}
                                            className='gradient-primary text-white px-8 py-6 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all'
                                        >
                                            Apply Now
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {isApplied && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className='mt-8 p-6 rounded-2xl bg-linear-to-r from-green-100 to-emerald-100 border-2 border-green-200'
                                >
                                    <div className='flex items-center gap-4'>
                                        <div className='w-12 h-12 rounded-full bg-green-500 flex items-center justify-center'>
                                            <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className='text-xl font-bold text-gray-900'>Application Submitted!</h3>
                                            <p className='text-gray-600'>Your application has been successfully submitted. Good luck!</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default JobDescription
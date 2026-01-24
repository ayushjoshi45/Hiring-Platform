import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Loader2, CheckCircle2, RefreshCw } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '@/redux/authSlice'
import Navbar from '../shared/Navbar'

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [timer, setTimer] = useState(600) // 10 minutes in seconds
    const inputRefs = useRef([])
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector(store => store.auth)

    useEffect(() => {
        // Redirect if user is verified
        if (user?.isVerified) {
            navigate('/')
        }

        // Timer countdown
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)

        return () => clearInterval(interval)
    }, [user, navigate])

    const handleChange = (index, value) => {
        if (isNaN(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value !== '' && index < 5) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').slice(0, 6)
        const newOtp = pastedData.split('')
        setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')])
        
        // Focus the last filled input or the first empty one
        const nextIndex = Math.min(newOtp.length, 5)
        inputRefs.current[nextIndex].focus()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const otpCode = otp.join('')

        console.log('=== Frontend OTP Verification ===');
        console.log('OTP Code:', otpCode);
        console.log('OTP Code Length:', otpCode.length);
        console.log('OTP Type:', typeof otpCode);
        console.log('User Email:', user?.email);

        if (otpCode.length !== 6) {
            toast.error('Please enter complete OTP')
            return
        }

        try {
            setLoading(true)
            const res = await axios.post(`${USER_API_END_POINT}/verify-otp`, {
                email: user?.email,
                otp: otpCode
            }, {
                withCredentials: true
            })

            if (res.data.success) {
                // Update user's isVerified status in Redux
                const updatedUser = { ...user, isVerified: true };
                dispatch(setUser(updatedUser));
                
                toast.success(res.data.message)
                
                // Redirect based on role
                setTimeout(() => {
                    if (user?.role === 'recruiter') {
                        navigate('/admin/companies')
                    } else {
                        navigate('/')
                    }
                }, 1000)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'OTP verification failed')
            setOtp(['', '', '', '', '', ''])
            inputRefs.current[0].focus()
        } finally {
            setLoading(false)
        }
    }

    const handleResendOTP = async () => {
        try {
            setResending(true)
            const res = await axios.post(`${USER_API_END_POINT}/resend-otp`, {
                email: user?.email
            })

            if (res.data.success) {
                toast.success(res.data.message)
                setTimer(600) // Reset timer to 10 minutes
                setOtp(['', '', '', '', '', ''])
                inputRefs.current[0].focus()
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Failed to resend OTP')
        } finally {
            setResending(false)
        }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50'>
            <Navbar />
            <div className='flex items-center justify-center min-h-screen pt-20 px-6'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='max-w-md w-full'
                >
                    {/* Header */}
                    <div className='text-center mb-8'>
                        <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4'>
                            <Mail className='w-8 h-8 text-white' />
                        </div>
                        <h1 className='text-3xl font-bold mb-2'>Verify Your Email</h1>
                        <p className='text-muted-foreground'>
                            We've sent a 6-digit OTP to<br />
                            <span className='font-semibold text-purple-600'>{user?.email}</span>
                        </p>
                    </div>

                    {/* OTP Form */}
                    <form onSubmit={handleSubmit} className='glass-effect rounded-3xl p-8 shadow-2xl border border-white/20'>
                        <div className='space-y-6'>
                            {/* OTP Input Boxes */}
                            <div className='flex gap-3 justify-center'>
                                {otp.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type='text'
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className='w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20'
                                    />
                                ))}
                            </div>

                            {/* Timer */}
                            <div className='text-center'>
                                {timer > 0 ? (
                                    <p className='text-sm text-muted-foreground'>
                                        OTP expires in <span className='font-semibold text-purple-600'>{formatTime(timer)}</span>
                                    </p>
                                ) : (
                                    <p className='text-sm text-red-600 font-semibold'>OTP has expired!</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            {loading ? (
                                <Button disabled className='w-full h-12 gradient-primary text-white rounded-xl font-semibold'>
                                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                    Verifying...
                                </Button>
                            ) : (
                                <Button 
                                    type='submit' 
                                    className='w-full h-12 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all'
                                    disabled={timer === 0}
                                >
                                    Verify Email
                                    <ArrowRight className='ml-2 w-5 h-5' />
                                </Button>
                            )}

                            {/* Resend OTP */}
                            <div className='text-center'>
                                <p className='text-sm text-muted-foreground mb-2'>Didn't receive the code?</p>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    onClick={handleResendOTP}
                                    disabled={resending}
                                    className='text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                                >
                                    {resending ? (
                                        <>
                                            <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                                            Resending...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className='mr-2 w-4 h-4' />
                                            Resend OTP
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* Help Text */}
                    <div className='mt-6 text-center'>
                        <p className='text-xs text-muted-foreground'>
                            Check your spam folder if you don't see the email in your inbox
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default VerifyOTP

import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading,user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            // toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
        // PublicRoute handles redirect if user is already logged in
        return (
        <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50'>
            <Navbar />
            <div className='flex items-center justify-center min-h-screen pt-20 px-6'>
                <div className='w-full max-w-md'>
                    {/* Header */}
                    <div className='text-center mb-8'>
                        <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4'>
                            <svg className='w-8 h-8 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                            </svg>
                        </div>
                        <h1 className='text-3xl font-bold mb-2'>Welcome Back!</h1>
                        <p className='text-muted-foreground'>Sign in to continue your job search</p>
                    </div>

                    {/* Form Card */}
                    <form onSubmit={submitHandler} className='glass-effect rounded-3xl p-8 shadow-2xl border border-white/20'>
                        <div className='space-y-5'>
                            <div>
                                <Label className='text-sm font-medium mb-2 block'>Email Address</Label>
                                <Input
                                    type="email"
                                    value={input.email}
                                    name="email"
                                    onChange={changeEventHandler}
                                    placeholder="john.doe@example.com"
                                    className='h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500/20'
                                />
                            </div>

                            <div>
                                <Label className='text-sm font-medium mb-2 block'>Password</Label>
                                <Input
                                    type="password"
                                    value={input.password}
                                    name="password"
                                    onChange={changeEventHandler}
                                    placeholder="Enter your password"
                                    className='h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500/20'
                                />
                            </div>

                            <div>
                                <Label className='text-sm font-medium mb-3 block'>I am a</Label>
                                <RadioGroup className="grid grid-cols-2 gap-3">
                                    <div className={`relative flex items-center justify-center space-x-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                        input.role === 'student' 
                                            ? 'border-purple-500 bg-purple-50' 
                                            : 'border-gray-200 hover:border-purple-200 bg-white'
                                    }`}>
                                        <Input
                                            type="radio"
                                            name="role"
                                            value="student"
                                            checked={input.role === 'student'}
                                            onChange={changeEventHandler}
                                            className="absolute opacity-0 cursor-pointer"
                                            id="r1"
                                        />
                                        <Label htmlFor="r1" className='cursor-pointer font-medium'>
                                            Job Seeker
                                        </Label>
                                    </div>
                                    <div className={`relative flex items-center justify-center space-x-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                        input.role === 'recruiter' 
                                            ? 'border-purple-500 bg-purple-50' 
                                            : 'border-gray-200 hover:border-purple-200 bg-white'
                                    }`}>
                                        <Input
                                            type="radio"
                                            name="role"
                                            value="recruiter"
                                            checked={input.role === 'recruiter'}
                                            onChange={changeEventHandler}
                                            className="absolute opacity-0 cursor-pointer"
                                            id="r2"
                                        />
                                        <Label htmlFor="r2" className='cursor-pointer font-medium'>
                                            Recruiter
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className='flex items-center justify-between text-sm'>
                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input type='checkbox' className='rounded border-gray-300 text-purple-600 focus:ring-purple-500' />
                                    <span className='text-muted-foreground'>Remember me</span>
                                </label>
                                <a href='#' className='text-purple-600 hover:text-purple-700 font-medium'>
                                    Forgot password?
                                </a>
                            </div>

                            {
                                loading ? (
                                    <Button disabled className="w-full h-12 gradient-primary text-white rounded-xl font-semibold">
                                        <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                        Signing in...
                                    </Button>
                                ) : (
                                    <Button type="submit" className="w-full h-12 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                                        Sign In
                                    </Button>
                                )
                            }
                        </div>

                        <div className='mt-6 text-center'>
                            <span className='text-muted-foreground'>Don't have an account? </span>
                            <Link to="/signup" className='text-purple-600 hover:text-purple-700 font-semibold'>
                                Create Account
                            </Link>
                        </div>
                    </form>

                    {/* Trust Badges */}
                    <div className='mt-8 text-center'>
                        <p className='text-xs text-muted-foreground mb-3'>Trusted by 100,000+ job seekers</p>
                        <div className='flex items-center justify-center gap-6 opacity-50'>
                            <span className='text-sm font-semibold'>Google</span>
                            <span className='text-sm font-semibold'>Microsoft</span>
                            <span className='text-sm font-semibold'>Amazon</span>
                            <span className='text-sm font-semibold'>Apple</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
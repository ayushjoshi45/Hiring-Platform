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

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const {loading,user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();    //formdata object
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

                try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
                        if (res.data.success) {
                // Auto-login: Set user data in Redux store
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                
                // Redirect to OTP verification page
                navigate("/verify-otp");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Registration failed");
        } finally{
            dispatch(setLoading(false));
        }
    }

        // PublicRoute handles redirect if user is already logged in
        return (
        <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50'>
            <Navbar />
            <div className='flex items-center justify-center min-h-screen pt-20 px-6 py-12'>
                <div className='w-full max-w-2xl'>
                    {/* Header */}
                    <div className='text-center mb-8'>
                        <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4'>
                            <svg className='w-8 h-8 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' />
                            </svg>
                        </div>
                        <h1 className='text-3xl font-bold mb-2'>Create Your Account</h1>
                        <p className='text-muted-foreground'>Join thousands of professionals finding their dream jobs</p>
                    </div>

                    {/* Form Card */}
                    <form onSubmit={submitHandler} className='glass-effect rounded-3xl p-8 shadow-2xl border border-white/20'>
                        <div className='space-y-5'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                <div>
                                    <Label className='text-sm font-medium mb-2 block'>Full Name</Label>
                                    <Input
                                        type="text"
                                        value={input.fullname}
                                        name="fullname"
                                        onChange={changeEventHandler}
                                        placeholder="John Doe"
                                        className='h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500/20'
                                    />
                                </div>
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
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                <div>
                                    <Label className='text-sm font-medium mb-2 block'>Phone Number</Label>
                                    <Input
                                        type="text"
                                        value={input.phoneNumber}
                                        name="phoneNumber"
                                        onChange={changeEventHandler}
                                        placeholder="+1 (234) 567-8900"
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
                                        placeholder="Create a strong password"
                                        className='h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500/20'
                                    />
                                </div>
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

                            <div>
                                <Label className='text-sm font-medium mb-2 block'>Profile Picture</Label>
                                <div className='relative'>
                                    <Input
                                        accept="image/*"
                                        type="file"
                                        onChange={changeFileHandler}
                                        className="h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                    />
                                </div>
                                <p className='text-xs text-muted-foreground mt-1'>Upload a profile picture (JPG, PNG, max 5MB)</p>
                            </div>

                            <div className='flex items-start gap-2 p-4 bg-purple-50 rounded-xl border border-purple-100'>
                                <input type='checkbox' className='mt-0.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500' required />
                                <label className='text-sm text-gray-700'>
                                    I agree to the <a href='#' className='text-purple-600 hover:text-purple-700 font-medium'>Terms of Service</a> and <a href='#' className='text-purple-600 hover:text-purple-700 font-medium'>Privacy Policy</a>
                                </label>
                            </div>

                            {
                                loading ? (
                                    <Button disabled className="w-full h-12 gradient-primary text-white rounded-xl font-semibold">
                                        <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                        Creating account...
                                    </Button>
                                ) : (
                                    <Button type="submit" className="w-full h-12 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                                        Create Account
                                    </Button>
                                )
                            }
                        </div>

                        <div className='mt-6 text-center'>
                            <span className='text-muted-foreground'>Already have an account? </span>
                            <Link to="/login" className='text-purple-600 hover:text-purple-700 font-semibold'>
                                Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup
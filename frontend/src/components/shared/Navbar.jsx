import React, { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Briefcase, Menu, X } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const isActive = (path) => location.pathname === path;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? 'glass-effect shadow-lg' : 'bg-white/80 backdrop-blur-sm'
            }`}
        >
            <div className='flex items-center justify-between mx-auto max-w-7xl h-20 px-6'>
                <Link to="/" className='flex items-center gap-2 group'>
                    <div className='w-10 h-10 rounded-xl gradient-primary flex items-center justify-center transform group-hover:scale-110 transition-transform'>
                        <Briefcase className='w-6 h-6 text-white' />
                    </div>
                    <h1 className='text-2xl font-bold tracking-tight'>
                        Career<span className='text-gradient'>Hub</span>
                    </h1>
                </Link>

                {/* Desktop Navigation */}
                <div className='hidden md:flex items-center gap-8'>
                    <ul className='flex font-medium items-center gap-1'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li>
                                        <Link to="/admin/companies">
                                            <Button 
                                                variant="ghost" 
                                                className={`relative ${
                                                    isActive('/admin/companies') ? 'text-primary' : ''
                                                }`}
                                            >
                                                Companies
                                                {isActive('/admin/companies') && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                                    />
                                                )}
                                            </Button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/admin/jobs">
                                            <Button 
                                                variant="ghost"
                                                className={`relative ${
                                                    isActive('/admin/jobs') ? 'text-primary' : ''
                                                }`}
                                            >
                                                Jobs
                                                {isActive('/admin/jobs') && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                                    />
                                                )}
                                            </Button>
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link to="/">
                                            <Button 
                                                variant="ghost"
                                                className={`relative ${
                                                    isActive('/') ? 'text-primary' : ''
                                                }`}
                                            >
                                                Home
                                                {isActive('/') && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                                    />
                                                )}
                                            </Button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/jobs">
                                            <Button 
                                                variant="ghost"
                                                className={`relative ${
                                                    isActive('/jobs') ? 'text-primary' : ''
                                                }`}
                                            >
                                                Jobs
                                                {isActive('/jobs') && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                                    />
                                                )}
                                            </Button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/browse">
                                            <Button 
                                                variant="ghost"
                                                className={`relative ${
                                                    isActive('/browse') ? 'text-primary' : ''
                                                }`}
                                            >
                                                Browse
                                                {isActive('/browse') && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                                    />
                                                )}
                                            </Button>
                                        </Link>
                                    </li>
                                </>
                            )
                        }
                    </ul>

                    {
                        !user ? (
                            <div className='flex items-center gap-3'>
                                <Link to="/login">
                                    <Button variant="outline" className="rounded-full hover:border-primary hover:text-primary transition-all">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="rounded-full gradient-primary text-white hover:shadow-lg hover:scale-105 transition-all">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Avatar className="cursor-pointer ring-2 ring-primary/20 hover:ring-primary transition-all">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                        </Avatar>
                                    </motion.div>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-0 overflow-hidden">
                                    <div className='gradient-primary p-4 text-white'>
                                        <div className='flex gap-3 items-center'>
                                            <Avatar className="h-12 w-12 ring-2 ring-white/50">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-semibold text-lg'>{user?.fullname}</h4>
                                                <p className='text-sm text-white/80'>{user?.profile?.bio || 'No bio available'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='p-2'>
                                        {
                                            user && user.role === 'student' && (
                                                <Link to="/profile">
                                                    <Button variant="ghost" className='w-full justify-start gap-2'>
                                                        <User2 className='w-4 h-4' />
                                                        View Profile
                                                    </Button>
                                                </Link>
                                            )
                                        }
                                        <Button onClick={logoutHandler} variant="ghost" className='w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50'>
                                            <LogOut className='w-4 h-4' />
                                            Logout
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>

                {/* Mobile Menu Button */}
                <button
                    className='md:hidden p-2'
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className='md:hidden glass-effect border-t'
                    >
                        <div className='px-6 py-4 space-y-2'>
                            {user && user.role === 'recruiter' ? (
                                <>
                                    <Link to="/admin/companies" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className='w-full justify-start'>Companies</Button>
                                    </Link>
                                    <Link to="/admin/jobs" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className='w-full justify-start'>Jobs</Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className='w-full justify-start'>Home</Button>
                                    </Link>
                                    <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className='w-full justify-start'>Jobs</Button>
                                    </Link>
                                    <Link to="/browse" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className='w-full justify-start'>Browse</Button>
                                    </Link>
                                </>
                            )}
                            {!user && (
                                <div className='pt-2 space-y-2'>
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="outline" className='w-full'>Login</Button>
                                    </Link>
                                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className='w-full gradient-primary text-white'>Get Started</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

export default Navbar
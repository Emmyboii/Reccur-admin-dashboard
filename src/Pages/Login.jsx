import { useEffect, useState } from 'react'
import Logo from '../Images/Logo_base2.svg';
import { useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const Login = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [validationError, setValidationError] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [showModal, setShowModal] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setValidationError((prev) => ({ ...prev, [e.target.name]: '' }));
    }

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let error = {}

        if (!emailRegex.test(formData.email)) {
            error.email = 'Please enter a valid email address.'
        }

        if (!formData.password) {
            error.password = 'Password is needed to sign in.'
        }

        setValidationError(error)
        return Object.keys(error).length === 0;
    }

    const Login = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch(`https://api.reccur.co/api/v1/login`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok || !data.token) {
                setShowModal(true);
                setStatus({
                    message: data.message || 'Something went wrong! Try again later.',
                    type: 'error'
                });
                return;
            }

            const token = data.token;

            // ✅ Only store token when response is successful
            localStorage.setItem('reccurAdminToken', token);
            localStorage.setItem('tokenTimestamp', Date.now());

            navigate('/');

        } catch (error) {
            setShowModal(true);
            setStatus({ message: 'Something went wrong! Try again later.', type: 'error' });
            console.error('Login error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (showModal) {
            const timer = setTimeout(() => {
                setShowModal(false);
                setStatus({ message: '', type: '' });
            }, 3500);

            return () => clearTimeout(timer);
        }
    }, [showModal]);

    return (
        <div className='h-[90vh] w-full sm:p-10 p-5'>
            <div className='flex flex-col gap-10 h-full relative'>
                <div className='flex items-center justify-between 3xl:ml-10'>
                    <a href="/">
                        <div className='flex gap-2 items-center'>
                            <img className='3xl:size-10' src={Logo} alt="" />
                            <p className='text-[#1D1C1F] sp:text-[20px] text-[18px] 3xl:text-[35px] font-semibold'>reccur</p>
                        </div>
                    </a>
                </div>
                <div className='mx-auto flex flex-col sm:w-[500px] w-full justify-center h-[90vh]'>
                    <div className='flex flex-col gap-4 items-center'>
                        <p className='text-[#1D1C1F] text-[36px] 3xl:text-[58px] text-center font-semibold'>Sign in</p>
                    </div>
                    <form onSubmit={Login} className='flex flex-col gap-4 text-[14px] 3xl:text-[28px] font-medium text-[#525154]' action="">
                        {showModal && (
                            <div className={`${status.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white absolute md:top-14 z-50 top-12 sm:right-6 right-2 p-3 rounded-md flex items-center text-center justify-between`}>
                                <p className='text-[16px] 3xl:text-[22px] font-bold'>
                                    {status.message}
                                </p>
                            </div>
                        )}
                        <div className='flex flex-col gap-[6px]'>
                            <p className='font-medium text-[#525154]'>Email</p>
                            <input
                                className='w-full px-[14px] py-[10px] rounded-lg border border-[#D2D0D6]'
                                type="email"
                                name="email"
                                onChange={handleChange}
                                placeholder='Enter your email'
                            />
                            {validationError.email && <p className='text-[#EF4444] font-normal text-[14px] 3xl:text-[23px]'>{validationError.email}</p>}
                        </div>
                        <div className='flex flex-col gap-[6px]'>
                            <p className='font-medium text-[#525154]'>Password</p>
                            <div className='flex items-center'>
                                <input
                                    className='w-full px-[14px] py-[10px] rounded-lg border border-[#D2D0D6]'
                                    onChange={handleChange}
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    placeholder='Enter your password'
                                />
                                {formData.password && (
                                    showPassword ?
                                        <IoEyeOffOutline onClick={togglePasswordVisibility} className='ml-[-30px] size-4 cursor-pointer' />
                                        :
                                        <IoEyeOutline onClick={togglePasswordVisibility} className='ml-[-30px] size-4 cursor-pointer' />
                                )}
                            </div>
                            {validationError.password && <p className='text-[#EF4444] font-normal text-[14px] 3xl:text-[23px]'>{validationError.password}</p>}
                        </div>
                        <div className='flex flex-col gap-3'>
                            <button
                                className={`text-white flex gap-3 items-center justify-center py-3 px-5 w-full rounded-lg ${isSubmitting ? 'bg-[#E8E1F5]' : 'bg-[#531CB3]'}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    'Loading...'
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </div>
                    </form>
                    {/* <hr className='border-[#E6E4EB]' /> */}
                    {/* <button className='px-4 py-3 w-full flex justify-center gap-3 rounded-lg border border-[#E6E4EB]'>
                        <img src={google} alt="" />
                        <p className='text-[#525154] font-medium text-[16px] 3xl:text-[25px]'>Sign up with Google</p>
                    </button> */}
                    {/* <p className='text-[14px] 3xl:text-[23px] font-normal text-[#525154] text-center'>Don't have an account? <a href='/signup' className='text-[#531CB3] cursor-pointer'>Sign up</a></p> */}
                </div>
            </div>
        </div>
    )
}

export default Login
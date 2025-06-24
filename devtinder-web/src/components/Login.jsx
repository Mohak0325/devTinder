import axios from 'axios';
import { useState , useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../redux/slices/UserSlice';
import {BASE_URL} from '../utils/constants';

const Login = () => {
    const [emailId, setEmailId] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async() => {
        setError('');
        try{
            const res = await axios.post(BASE_URL +'/auth/login', {
                email: emailId,
                password: password
            } , {withCredentials: true});
            dispatch(addUser(res?.data?.user));
            return navigate('/');
        }
        catch(err){
            setError(err?.response?.data || "Something went wrong");
        }
    }

    const handleSignUp = async () => {
        setError('');

        try{
            const res = await axios.post(BASE_URL +'/auth/signup', {
                email: emailId,
                password: password,
                firstName : firstName,
                lastName: lastName
            } , {withCredentials: true});
            
            dispatch(addUser(res?.data?.user));
            return navigate('/profile');
        }
        catch(err){
            setError(err?.response?.data || "Something went wrong");
        }
    }

    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => {
            setError('');
            }, 4000);
            return () => clearTimeout(timeout);
        }
    }, [error]);
    
    return (
        <div className="flex justify-center items-center my-15">
            <div className="card bg-base-200 w-96 shadow-sm">
                <div className="card-body">
                    <h2 className="card-title justify-center">{isLoggedIn ? "Login" : "Sign Up"}</h2>
                    
                    <div className="flex justify-center items-center flex-col">

                        {!isLoggedIn && (
                            <>
                                <label className="form-control w-full max-w-xs my-2">
                                    <div className="label">
                                        <span className="label-text">First Name:</span>
                                    </div>
                                    <input
                                    type="text" 
                                    placeholder="First Name"
                                    required 
                                    onChange={(e) => setFirstName(e.target.value)} 
                                    value={firstName} 
                                    className="input border-2 focus:outline-0 w-full max-w-xs" />
                                </label>
                                <label className="form-control w-full max-w-xs my-2">
                                    <div className="label">
                                        <span className="label-text">Last Name:</span>
                                    </div>
                                    <input
                                    type="text" 
                                    placeholder="Last Name"
                                    required 
                                    onChange={(e) => setLastName(e.target.value)} 
                                    value={lastName} 
                                    className="input border-2 focus:outline-0 w-full max-w-xs" />
                                </label>
                            </>
                        )}
                        <label className="form-control w-full max-w-xs my-2">
                            <div className="label">
                                <span className="label-text">Email ID</span>
                            </div>
                            <input
                            type="email" 
                            placeholder="Email"
                            required 
                            onChange={(e) => setEmailId(e.target.value)} 
                            value={emailId} 
                            className="input border-2 focus:outline-0 w-full max-w-xs" />
                        </label>
                        <label className="form-control w-full max-w-xs my-2">
                            <div className="label">
                                <span className="label-text">Password</span>
                            </div>
                            <input 
                            type="password" 
                            placeholder="Password" 
                            required
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password} 
                            className="input border-2 focus:outline-0 w-full max-w-xs" />
                        </label>
                        <p className='text-red-500'>{error}</p>
                    </div>
                    <div className="card-actions justify-center m-2 ">
                        <button className="btn btn-primary" onClick={isLoggedIn ? handleLogin : handleSignUp}>{isLoggedIn ? "Login" : "Signup"}</button>
                    </div>

                    <p className='m-auto cursor-pointer py-2' onClick={() => setIsLoggedIn(value => !value)}>{isLoggedIn ? "New User?SignUp Here" : "Existing User?Login Here"}</p>
                </div>
            </div>
        </div>
    )
}

export default Login;
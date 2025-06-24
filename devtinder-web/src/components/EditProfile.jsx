import { useState } from 'react';
import UserCard from './UserCard.jsx';
import {BASE_URL} from '../utils/constants';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../redux/slices/UserSlice';
import { toast } from 'react-hot-toast';

const Profile = ({user}) => {
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [age , setAge] = useState(user.age ? user.age : undefined);
    const [gender , setGender] = useState(user.gender ? user.gender : undefined);
    const [photoURL , setPhotoURL] = useState(user.photoURL ? user.photoURL : undefined); 
    const [about , setAbout] = useState(user.about ? user.about : undefined);
    const [skills , setSkills] = useState(user.skills ? user.skills : undefined);
    const [error , setError] = useState('');
    const dispatch = useDispatch();

    const saveProfile = async() => {
        setError('');
        try{
            const res = await axios.patch(BASE_URL + '/profile/edit' , 
                {firstName , lastName , about , age , gender , photoURL , skills },
                {withCredentials: true}
            )
            dispatch(addUser(res?.data));
            toast.success('Profile updated successfully!');
            return;
        }
        catch(err) {
            setError(err?.response?.data);
        }
    }
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center my-10 px-4 overflow-hidden'>
            <div className="flex justify-center items-center mx-10">
                <div className="card bg-base-200 w-96 shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title justify-center">Edit Profile</h2>
                        
                        <div className="flex justify-center items-center flex-col">
                            <label className="form-control w-full max-w-xs my-2">
                                <div className="label">
                                    <span className="label-text">First Name:</span>
                                </div>
                                <input
                                type="text" 
                                placeholder="First Name" 
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
                                onChange={(e) => setLastName(e.target.value)} 
                                value={lastName} 
                                className="input border-2 focus:outline-0 w-full max-w-xs" />
                            </label>
                            <label className="form-control w-full max-w-xs my-2">
                                <div className="label">
                                    <span className="label-text">Photo URL:</span>
                                </div>
                                <input
                                type="text" 
                                placeholder="photoURL" 
                                onChange={(e) => setPhotoURL(e.target.value)} 
                                value={photoURL} 
                                className="input border-2 focus:outline-0 w-full max-w-xs" />
                            </label>  
                            <label className="form-control w-full max-w-xs my-2">
                                <div className="label">
                                    <span className="label-text">Age:</span>
                                </div>
                                <input
                                type="text" 
                                placeholder="Age" 
                                onChange={(e) => setAge(e.target.value)} 
                                value={age} 
                                className="input border-2 focus:outline-0 w-full max-w-xs" />
                            </label>
                            <label className="form-control w-full max-w-xs my-2">
                                <div className="label">
                                    <span className="label-text">Gender:</span>
                                </div>
                                <input
                                type="text" 
                                placeholder="Gender" 
                                onChange={(e) => setGender(e.target.value)} 
                                value={gender} 
                                className="input border-2 focus:outline-0 w-full max-w-xs" />
                            </label>
                            <label className="form-control w-full max-w-xs my-2">
                                <div className="label">
                                    <span className="label-text">Skills:</span>
                                </div>
                                <input
                                type="text" 
                                placeholder="skills" 
                                onChange={(e) => setSkills(e.target.value)} 
                                value={skills} 
                                className="input border-2 focus:outline-0 w-full max-w-xs" />
                            </label>  
                            <label className="form-control w-full max-w-xs my-2">
                                <div className="label">
                                    <span className="label-text">About:</span>
                                </div>
                                <textarea
                                maxLength={200}
                                rows={4}
                                cols={50}
                                placeholder="Tell something about yourself..." 
                                onChange={(e) => setAbout(e.target.value)} 
                                value={about} 
                                className="textarea textarea-bordered focus:outline-0 w-full max-w-xs resize-none overflow-y-hidden" />
                            </label>
                                                  
                        </div>
                        <p className='text-red-500'>{error}</p>
                        <div className="card-actions justify-center m-2 ">
                            <button className="btn btn-primary" onClick={saveProfile}>Save Profile</button>
                        </div>
                    </div>
                </div>
            </div>
            <UserCard user = { {firstName , lastName , about , age , gender , photoURL , skills } }/>
        </div>
    )
}

export default Profile;
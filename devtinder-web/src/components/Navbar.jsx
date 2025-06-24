import { useSelector , useDispatch } from "react-redux";
import { Link , useNavigate } from "react-router-dom";
import { removeUser } from "../redux/slices/UserSlice";
import {BASE_URL}  from "../utils/constants";
import axios from "axios";

const Navbar = () => {

    const user = useSelector((state) => state.user);
    // console.log(user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async() => {
        try{
            await axios.post(BASE_URL + '/auth/logout', {} , {
                withCredentials: true
            });
            dispatch(removeUser());
            return navigate('/auth');
        }
        catch(err){
            console.log("Error:" + err.message);
        }
    }
    return (
        <div className="navbar bg-base-300 shadow-sm">
            <div className="flex-1">
                <Link to='/' className="btn btn-ghost text-xl">DevTinder</Link>
            </div>
            {
                user && (
                    <div className="flex gap-2 items-center">
                        <div className="form-control">Welcome {user.firstName}</div>
                        <div className="dropdown dropdown-end mx-4">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Profile"
                                        src={user.photoURL ? user.photoURL : "https://as1.ftcdn.net/v2/jpg/11/28/72/50/1000_F_1128725045_1Xv5xuXLcAEW9Sm0ToMJEeTgYFPOUV1r.jpg"} />
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu-sm dropdown-content menu p-2 z-[1] shadow bg-base-100 rounded-box w-52">
                                <li><Link to ="/profile">Profile</Link></li>
                                <li><Link to ="/connections">Connections</Link></li>
                                <li><Link to ="/requests">Request</Link></li>
                                <li><Link onClick={handleLogout} >Logout</Link></li>
                            </ul>

                        </div>
                    </div>
                )
            }


            
        </div>
    );
}

export default Navbar;


import { Outlet } from "react-router-dom";
import { useDispatch , useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../redux/slices/UserSlice";
import { useEffect , useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import {BASE_URL} from "../utils/constants";

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading , setLoading] = useState(false);

    const fetchUser = async () => {
        try{
            setLoading(true);
            const res = await axios.get(BASE_URL + '/profile/view', {
                withCredentials: true
            });
            dispatch(addUser(res?.data?.user));
        } catch(err){
            return navigate('/auth');   
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

      if (loading) return <div className="text-center py-10"> Checking session...</div>;

    return (
        <>
        <Navbar/>
        <Outlet/>
        </>
    );
}

export default Body;
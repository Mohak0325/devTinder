import { useDispatch , useSelector } from "react-redux";
import {BASE_URL} from "../utils/constants";
import axios from "axios";
import { setFeed } from "../redux/slices/FeedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";


const Feed = () => {
    const feed = useSelector((state) => state.feed);
    const dispatch = useDispatch();

    const getFeed =  async() => {
        try{
            if(feed) return;
            const res = await axios.get(BASE_URL + "/user/feed", {
                withCredentials: true,
            })
            dispatch(setFeed(res?.data?.data));
        }
        catch(err) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        getFeed();
    } , []);
    return (
        feed?.length > 0 ? (
            <div className="flex justify-center mt-10">
                <UserCard user={feed[0]}/>
            </div>
        ) : (
            <div className="flex justify-center mt-10">
                <h1 className="font-bold text-2xl">No New User Found</h1>
            </div>
        )
        
    )
}

export default Feed;
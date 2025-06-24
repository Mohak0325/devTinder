import { useDispatch } from "react-redux";
import {BASE_URL}  from "../utils/constants";
import axios from "axios";
import { clearFeed } from "../redux/slices/FeedSlice";

const UserCard = ({user}) => {
    const dispatch = useDispatch();

    const handleSendRequest = async (status , userId) => {
        try{
            const res = await axios.post(BASE_URL+ "/request/send/" + status + "/" + userId ,
                 {}, {withCredentials: true});
                 dispatch(clearFeed(userId));

        }
        catch (error) {
            console.error("Error sending request:", error);
        }
    }

    const {firstName , lastName , age , gender , photoURL , about , skills} = user;
    
    return (
        <div className="card bg-base-300 w-85 shadow-sm">
            <figure>
                <img
                className="rounded-t-md h-64 object-cover w-full"
                src={photoURL}
                alt="photo" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{firstName && lastName && firstName + " " + lastName} </h2>
                {age && gender && (<p>{age + ", " + gender}</p>)}
                {skills && (<p>{skills}</p>)}
                <p>{about}</p>
                <div className="card-actions justify-center my-4">
                    <button className="btn btn-primary bg-blue-500 hover:bg-blue-700 rounded-md"
                    onClick={() => handleSendRequest("ignored" , user._id)}
                    >Ignore</button>
                    <button className="btn btn-secondary bg-pink-500 hover:bg-pink-700 rounded-md"
                    onClick={() => handleSendRequest("interested" , user._id)}
                    >Interseted</button>
                </div>
            </div>
        </div>
    )
}

export default UserCard;
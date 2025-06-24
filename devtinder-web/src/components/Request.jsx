import axios from "axios";
import { useDispatch , useSelector } from "react-redux";
import { addRequest } from "../redux/slices/RequestSlice";
import {BASE_URL} from "../utils/constants";
import { useEffect } from "react";

const Request = () => {
    const requests = useSelector((store) => store.request);  
    const dispatch = useDispatch();


    const reviewRequest = async (requestId, status) => {
        try{
            await axios.post(BASE_URL + "/request/review/" +status + "/" + requestId, {} , {withCredentials: true});
            fetchRequest();
        }
        catch (error) {
            console.error("Error reviewing request:", error);
        }
    }

    const fetchRequest = async () => {
        try{
            const res = await axios.get(BASE_URL + "/user/requests/received", 
                {withCredentials: true}
            );
            dispatch(addRequest(res?.data?.data));

        }
        catch (error) {
            console.error("Error fetching request:", error);
        }
    }

    useEffect(() => {
        fetchRequest();
    }, []);
     
    if (!requests) return <p className="text-center mt-10">Loading...</p>;
    if (requests?.length === 0) return <p className="text-center mt-10">No Requests Found</p>;

    return (
        <div className="px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-6">Connection Requests</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
                {requests.map((request) => {
                    const { firstName, lastName, age, gender, skills, about , photoURL } = request.fromUserId;

                    return (
                        <div
                          className="flex flex-col items-center border border-gray-300 rounded-xl p-6 shadow-md w-full max-w-md mx-auto sm:mx-4"
                          key={request._id}
                        >
                          <img
                            src={photoURL}
                            alt={`${firstName} ${lastName}`}
                            className="w-24 h-24 rounded-full object-cover mb-4"
                          />
                          <h2 className="text-lg font-semibold">{firstName} {lastName}</h2>
                          {age && <p className="text-sm text-gray-500">Age: {age}</p>}
                          {gender && <p className="text-sm text-gray-500">Gender: {gender}</p>}
                          {skills && <p className="text-sm text-gray-500 text-center mt-1">Skills: {skills}</p>}
                          {about && <p className="text-sm text-gray-500 text-center mt-1">About: {about}</p>}
                          <div className="flex gap-2 mt-4">
                            <button className="btn bg-blue-500 hover:bg-blue-700"
                            onClick={() => reviewRequest(request._id, "accepted")}
                            >Accept</button>
                            <button className="btn bg-pink-500 hover:bg-pink-700"
                            onClick={() => reviewRequest(request._id, "rejected")}
                            >Reject</button>
                          </div>
                        </div>
                      );
                })}
            </div>
        </div>
    );
}

export default Request;
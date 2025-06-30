import {BASE_URL} from "../utils/constants"
import axios from "axios";
import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../redux/slices/ConnectionSlice";
import { useNavigate } from "react-router-dom";

const Connections = () => {
    const connections = useSelector((state) => state.connection);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const fetchData = async () => {
        try {
            const res = await axios.get(BASE_URL + '/user/connections', { withCredentials: true });
            dispatch(addConnection(res?.data?.data));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!connections) return <p className="text-center mt-10">Loading...</p>;
    if (connections.length === 0) return <p className="text-center mt-10">No Connection Found</p>;

    return (
        <div className="px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Connections</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {connections.map((connection) => {
            const { firstName, lastName, age, gender, skills, about, photoURL } = connection;
            const targetUserId = connection._id;

            return (
                <div
                className="flex flex-col items-center border border-gray-300 rounded-xl p-6 shadow-md w-full max-w-md mx-auto sm:mx-4"
                key={targetUserId}
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

                {/* Chat Button */}
                <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={() => navigate(`/chat/${targetUserId}`)}
                >
                    Chat
                </button>
                </div>
            );
            })}
        </div>
        </div>

    );
};

export default Connections;


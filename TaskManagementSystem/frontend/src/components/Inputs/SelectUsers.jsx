import React, {useEffect, useState} from 'react'
import { API_PATHS } from '../../utils/apiPaths.js'
import axiosInstance from '../../utils/axiosInstance.js'
import { LuUsers } from 'react-icons/lu';

const SelectUsers = ({selectedUsers, setSelectedUsers}) => {
    const [allUsers, setAllUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

    const getAllUsers = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
            if (response.status?.length > 0) {
                setAllUsers(response.data);
            }
        } 
        catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const toggleUserSelection = (userId) => {
        setTempSelectedUsers((prev) => {
            prev.includes(userId) 
            ? prev.filter((id) => id !== userId) 
            : [...prev, userId];
        });
    };

    const handleAssign = () => {
        setSelectedUsers(tempSelectedUsers);
        setIsModalOpen(false);
    };

    const selectUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl);

    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        if (selectedUsers.length === 0) {
            setTempSelectedUsers([]);
        }
        return () => {}; 
    }, [selectedUsers]);


    return (
        <div className='space-y-4 mt-2'>
            {selectUserAvatars.length ===0 && (
                <button className='card-btn' onClick={() => setIsModalOpen(true)}>
                    <LuUsers className='text-sm' /> Add Members
                </button>
            )}
        </div>
    )
}

export default SelectUsers;
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

function ListOfStudent() {
    const [students, setStudent] = useState([]);
    const [message, setMessage]  = useState('');
    const [refresh, setRefresh]  = useState(false);
    const apiURL = "https://localhost:44396/api/v1/student/";

    useEffect (() => {
        getAllStudents();
    },[refresh]);

    const getAllStudents = () =>{
        try {
            axios.get(`${apiURL}getallstudent`)
            .then((response) =>{
                setStudent(response.data);
            })
            .else((response) =>{
                console.error('No data found in response:', response);
            })
        } catch (error) {
            console.error('Error fetching item:', error);
        }
    };

    const onDelete = (studentId) =>{
        try {
            console.log(studentId);
            axios.delete(`${apiURL}deletethestudent/${studentId}`)
            .then((res) =>{
                setMessage(res.data.message || 'Deleted the Student!'); 
                {message &&(
                    <p style={{color: false ? 'green' : 'red'}}>{message}</p>
                )}
                setRefresh(prev => !prev);
            })
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data.message || error.response.statusText}`);
                console.error("Server responded with error:", error.response.data);
            } else if (error.request) {
                setMessage("Error: No response from server. Please check your network.");
                console.error("No response from server:", error.request);
            } else {
                setMessage(`Error: ${error.message}`);
                console.error("Error setting up request:", error.message);
            }
        }
    }

    function formatDate(dateTimeString) {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        if (isNaN(date)) return 'Invalid Date';
        const day   = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year  = date.getFullYear();
        return `${day}-${month}-${year}`;
    }      

    if (students.length === 0)
    {
        return <h1>no user found</h1>
    }
    else{
        return (
            <>
            <div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '8px' }} >SL.No</th>
                            <th style={{ border: '1px solid black', padding: '8px' }} >Name</th>
                            <th style={{ border: '1px solid black', padding: '8px' }} >Phone Number</th>
                            <th style={{ border: '1px solid black', padding: '8px' }} >Location</th>
                            <th style={{ border: '1px solid black', padding: '8px' }} >Joining Date</th>
                            <th style={{ border: '1px solid black', padding: '8px' }} >Title</th>
                            <th style={{ border: '1px solid black', padding: '8px' }} >Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {students.map((player, i) => (
                        <tr key={player.studentId}>
                            <td style={{ border: '1px solid black', padding: '8px' }} >{i + 1}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }} >{player.name}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }} >{player.phoneNumber}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }} >{player.location}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }} >{formatDate(player.joiningDate)}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }} >{player.title}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                            <Link to={`/updatestudent/${player.studentId}`}>Edit</Link>
                            <button onClick={() => onDelete(player.studentId)}>Delete</button>
                           </td>
                       </tr>    
                    ))}
                    </tbody>
                </table>
            </div>
            </>
        )
    };   
}

export default ListOfStudent;
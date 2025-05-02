import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function UpdateStudent(){
    const [name, setName]               = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation]       = useState('');
    const [joiningDate, setJoiningDate] = useState('');
    const [title, setTitle]             = useState('');
    const [message, setMessage]         = useState('');
    const {studentId}                   = useParams();
    const navigate                      = useNavigate();

    const apiURL = "https://localhost:44396/api/v1/student/";

    useEffect(()=>{
        const getStudent = () =>{
            try {
                console.log(studentId);
                axios.get(`${apiURL}getstudent/${studentId}`)
                .then((res) =>{
                    setName(res.data.name);
                    setJoiningDate(res.data.joiningDate);
                    setLocation(res.data.location);
                    setPhoneNumber(res.data.phoneNumber);
                    setTitle(res.data.title);
                })
                .else((res) => {
                    console.error('No data found in response:', res);
                })
            } catch (error) {
                console.error('Error fetching item:', error);
            }
        };
        getStudent();
    },[studentId]);

    const update = (e) =>{
        e.preventDefault();
        try {
            const response = axios.put(`${apiURL}updatethestudent/${studentId}`,{
                name        : name,
                phoneNumber : phoneNumber,
                location    : location,
                joiningDate : joiningDate,
                title       : title,
                gradeID     : 2 //default value
            });
            if (response != null) {
                setMessage(response.data || 'User updated successfully!');
                setName('');
                setPhoneNumber('');
                setLocation('');
                setJoiningDate('');
                setTitle('');
                navigate(-1);
            } else {
                setMessage('Error: No data received from server.');
                console.error('No data received from server:', response);
            }
        } 
        catch (error) {
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
        return `${year}-${month}-${day}`;
    }
    
    const handleBack = () => {
        navigate(-1);
    };

    return(
        <div style={{ 
            fontFamily: 'Arial, sans-serif', 
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}>
            
           <h2 style={{ color: '#333', marginBottom: '20px' }}>Update The Student</h2>
            <form onSubmit={update}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="userName" 
                    style={{ display: 'block', marginBottom: '5px' }}>
                        User Name:</label>
                    <input 
                        type="text" 
                        value={name} onChange={ (e) => setName(e.target.value)} 
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }} 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="phoneNumber" style={{ display: 'block', marginBottom: '5px' }}>Phone Number:</label>
                    <input 
                        type="number"
                        value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} 
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }} 
                    />
               </div>
               <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="location" style={{ display: 'block', marginBottom: '5px' }}>Location:</label>
                    <input 
                        type="text" 
                        value={location} onChange={(e) => setLocation(e.target.value)}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }} 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="joiningDate" style={{ display: 'block', marginBottom: '5px' }}>Joining Date:</label>
                    <input 
                        type="date" 
                        value={formatDate(joiningDate)} onChange={(e) => setJoiningDate(e.target.value)}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }} 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
                    <input 
                        type="text" 
                        value={title} onChange={(e) => setTitle(e.target.value)}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }} 
                    />
                </div>
                <button 
                    type = "button"
                    onClick = {handleBack}
                    style = {{ 
                        padding: '10px 15px', 
                        backgroundColor: '#ccc', 
                        color: 'black', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        width: '100%'
                    }}
                    > Back
               </button>
               &nbsp;&nbsp;&nbsp;
                <button 
                    type="submit" 
                    style={{ 
                        padding: '10px 15px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer' ,
                        width: '100%'
                    }}
                    > Update
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default UpdateStudent;
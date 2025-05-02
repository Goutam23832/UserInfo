import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function AddStudent(){
    const [name, setName]               = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation]       = useState('');
    const [joiningDate, setJoiningDate] = useState('');
    const [title, setTitle]             = useState('');
    const [isAdded, setNewStudentAdded] = useState(false);
    const [message, setMessage]         = useState('');
    const [photo, setPhoto]             = useState(null);

    const navigate = useNavigate();
    const apiURL   = "https://localhost:44396/api/v1/student/addnewstudent";

    const handelOnSubmit = async (e) => {
        e.preventDefault();
        try {
            var response = await axios.post(apiURL,{
                name        : name,
                phoneNumber : phoneNumber,
                location    : location,
                joiningDate : joiningDate,
                title       : title,
                gradeID     : 2 //default value
            });
            setMessage(response.data.message || 'Student added successfully!'); 
            setNewStudentAdded(true);
            setName('');
            setPhoneNumber('');
            setLocation('');
            setJoiningDate('');
            setTitle('');
            navigate("/listofstudent");
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
            
           <h2 style={{ color: '#333', marginBottom: '20px' }}>Add New Student</h2>
            {message &&(
                <p style={{color: isAdded ? 'green' : 'red'}}>{message}</p>
            )}
            <form onSubmit={handelOnSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="userName" 
                    style={{ display: 'block', marginBottom: '5px' }}>
                        User Name:</label>
                    <input 
                        type="text" 
                        value={name} onChange={ (e) => setName(e.target.value)} required
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }} 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="phoneNumber" style={{ display: 'block', marginBottom: '5px' }}>Phone Number:</label>
                    <input 
                        type="number"
                        value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required 
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }} 
                    />
               </div>
               <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="location" style={{ display: 'block', marginBottom: '5px' }}>Location:</label>
                    <input 
                        type="text" 
                        value={location} onChange={(e) => setLocation(e.target.value)} required
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }} 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="joiningDate" style={{ display: 'block', marginBottom: '5px' }}>Joining Date:</label>
                    <input 
                        type="date" 
                        value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} required
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }} 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
                    <input 
                        type="text" 
                        value={title} onChange={(e) => setTitle(e.target.value)} required
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
                    > Add Student
                </button>
            </form>
        </div>
    )
}

export default AddStudent;
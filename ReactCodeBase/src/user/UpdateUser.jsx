import axios from "axios";
import React, { useEffect, useState } from "react";
import {useParams, useNavigate } from 'react-router-dom';

const UpdateUser = () =>{
        const {id}                         = useParams();
        const navigate                     = useNavigate();
        const [name, setName]              = useState('');
        const [email, setEmail]            = useState('');
        const [roll, setRoll]              = useState('');
        const [message, setMessage]        = useState('');
        const [photo, setPhoto]            = useState(null);
    
        const apiURL = "https://localhost:44396/api/v1/user/";

        useEffect(() => {
            const getUser = async () => {
                try {
                    const res = await axios.get(`${apiURL}getuser/${id}`);
                    if (res && res.data) {
                        setName(res.data.name);
                        setEmail(res.data.email);
                        setRoll(res.data.roll);
                        setPhoto(res.data.imagePath);
                        console.log(res.data);
                    } else {
                        console.error('No data found in response:', res);
                    }
                } catch (error) {
                    console.error('Error fetching item:', error);
                }
            };
            getUser();
        }, [id]);

        const update = (e) =>{
            e.preventDefault();
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('roll', roll);
            if (e.target.photo.files[0]) {
                formData.append('ImagePath', e.target.photo.files[0]); 
            }
            try {
                const response = axios.put(`${apiURL}updatetheuser/${id}`, formData, {
                    Headers:
                    {
                       'Content-Type': 'multipart/form-data',
                    }
                });
                if (response != null) {
                    setMessage(response.data || 'User updated successfully!');
                    setName('');
                    setEmail('');
                    setRoll('');
                    setPhoto('');
                    navigate('/'); 
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

        const handleBack = () => {
            navigate(-1);
        };

        const handlePhotoChange = (e) => {
            setPhoto(e.target.files[0]);
        };

    return(
        <div style={{  
            fontFamily: 'Arial, sans-serif', 
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}>
            <h1>Update User</h1>
            <form onSubmit={update}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor = "userName" 
                    style = {{ display: 'block', marginBottom: '5px' }}>
                        User Name:</label>
                    <input 
                        type  = "text" 
                        value = {name} 
                        onChange = { (e) => setName(e.target.value)} 
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }} 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="emailAddress" style={{ display: 'block', marginBottom: '5px' }}>Email Address:</label>
                    <input 
                        type = "email"
                        value = {email} 
                        onChange = {(e) => setEmail(e.target.value)}
                        style = {{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }} 
                    />
               </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="userRoll" style={{ display: 'block', marginBottom: '5px' }}>User Roll:</label>
                    <input 
                        type="text" 
                        value={roll} 
                        onChange={(e) => setRoll(e.target.value)}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }} 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="image" style={{ display: 'block', marginBottom: '5px' }}>Photo:</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        name="photo" // Add a name to input.
                        onChange={handlePhotoChange} 
                        required 
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }} 
                    />
                </div>
                <img src={`https://localhost:44396${photo}`}
                    style={{ maxWidth: '1000px', maxHeight: '120px' }}
                    />
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
                    type = "submit" 
                    style = {{ 
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
};
export default UpdateUser;
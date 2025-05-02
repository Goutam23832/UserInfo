import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddUser(){

    const [name, setName]            = useState('');
    const [email, setEmail]          = useState('');
    const [roll, setRoll]            = useState('');
    const [isAdded, setNewUserAdded] = useState(false);
    const [message, setMessage]      = useState('');
    const [photo, setPhoto]          = useState(null);

    const navigate = useNavigate();
    const apiURL   = "https://localhost:44396/api/v1/user/addnewuser";

    const handelOnSubmit = async (e) => {
        e.preventDefault();

        console.log(`Name: ${name}, Email: ${email}, Roll: ${roll}`);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('roll', roll);
            if (e.target.photo.files[0]) 
            {
                formData.append('ImagePath', e.target.photo.files[0]);
            }

         const response = await axios.post(apiURL, formData, {
            Headers:
              {
                 'Content-Type': 'multipart/form-data',
              }
            });
            setMessage(response.data.message || 'User added successfully!'); 
            setNewUserAdded(true);
            setName('');
            setEmail('');
            setRoll('');
            setPhoto('');
            navigate('/');

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
    };

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleBack = () => {
        navigate(-1);
    };

    return  (
        <div style={{ 
            fontFamily: 'Arial, sans-serif', 
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}>
            
           <h2 style={{ color: '#333', marginBottom: '20px' }}>Add new User</h2>
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
                    <label htmlFor="emailAddress" style={{ display: 'block', marginBottom: '5px' }}>Email Address:</label>
                    <input 
                        type="email"
                        value={email} onChange={(e) => setEmail(e.target.value)} required 
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }} 
                    />
               </div>
               <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="userRoll" style={{ display: 'block', marginBottom: '5px' }}>User Roll:</label>
                    <input 
                        type="text" 
                        value={roll} onChange={(e) => setRoll(e.target.value)} required
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }} 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="image" style={{ display: 'block', marginBottom: '5px' }}>Photo:</label>
                    <input 
                        type="file"
                        accept="image/*"
                        name="photo"
                        onChange={handlePhotoChange}
                        required
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }} 
                    />
                </div>
                <img src={`https://localhost:44396${photo}`}
                     style={{ maxWidth: '100px', maxHeight: '100px' }}
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
                    > Add User
                </button>
            </form>
        </div>
    );
}

export default AddUser;
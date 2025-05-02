import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

function ListOfUser() {
    const [users, setUsers]           = useState([]);
    const [message, setMessage]       = useState('');
    const [refresh, setRefresh]       = useState(false);
    const apiURL                      = "https://localhost:44396/api/v1/user/";
    const [Option, setSelected]       = useState("");

    useEffect(() =>{
        getAllusers();
    }, [refresh]);

    const getAllusers = () => {
        axios.get(`${apiURL}getallusers`)
        .then((res) =>{
            setUsers(res.data);
        })
        .catch ((err) =>{
            console.log(err);
        });
    };
     
    const onDelete = (id) => {
       try {
         axios.delete(`${apiURL}deletetheuser/${id}`)
         .then((res) =>{
             setMessage(res.data.message || 'Deleted the User!'); 
             {message &&(
                 <p style={{color: false ? 'green' : 'red'}}>{message}</p>
             )}
             setRefresh(prev => !prev);
         })
       } 
       catch (error) 
       {
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

    const handleChange = async (event) => {
        if (!event.target.value) {
          alert('Please select a report type');
          return;
        }
    
        try {
          const response = await axios.get(
            `${apiURL}exportthereport/${event.target.value}`,
            { responseType: 'blob' } 
          );
          // Generate a link to download the file
          const url  = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
    
          let fileName = `user_report.${getExtension(event.target.value)}`;
          link.href    = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
        } catch (error) {
          alert('Download failed');
          console.error(error);
        }    
      };

    const getExtension = (type) => {
        switch (type) {
          case 'pdf':      return 'pdf';
          case 'excel':    return 'xlsx';
          case 'textfile': return 'txt';
          default:         return 'docx';
        }
      };

    if(users.length ===0)
    {
        return <h1>no user found</h1>
    }
    else{
        return (                              
            <div>
                <h1 align="center">Users Details</h1>
               <div className="p-4">
                    <label htmlFor="roles" className="block mb-2 text-sm font-medium">
                        Select Report type:
                    </label>
                    <select
                        id="roles"
                        value={Option}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="">-- Choose Report type --</option>
                        <option value="excel">Excel</option>
                        <option value="word">Word</option>
                        <option value="pdf">PDF</option>    
                        <option value="textfile">Text</option>
                    </select>

                    <p className="mt-3">You selected: {Option}</p>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '8px' }} >SL.No</th>
                            <th style={{ border: '1px solid black', padding: '8px' }} >Name</th>
                            <th style={{ border: '1px solid black', padding: '8px' }} >Email</th>
                            <th style={{ border: '1px solid black', padding: '8px' }} >Roll</th>
                            <th style={{ border: '1px solid black', padding: '8px' }} >Image</th>
                            <th style={{ border: '1px solid black', padding: '8px' }} >Action</th>
                        </tr> 
                    </thead>
                    <tbody>
                    {users.map((player, i) => (
                        <tr key={player.id}>
                            <td style={{ border: '1px solid black', padding: '8px' }} >{i + 1}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }} >{player.name}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }} >{player.email}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }} >{player.roll}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }} >
                            {player.imagePath && (
                                        <img
                                            src={`https://localhost:44396${player.imagePath}`}
                                            alt={player.name}
                                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                                        />
                                    )}
                             </td>
                             
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                            <Link to={`/updateuser/${player.id}`}>Edit</Link>
                            &nbsp; &nbsp;
                            <button onClick={() => onDelete(player.id)}>Delete</button>
                           </td>
                       </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    }  
}

export default ListOfUser;
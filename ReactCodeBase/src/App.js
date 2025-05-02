import './App.css';
import React          from 'react';
import AddUser        from './user/AddUser';
import ListOfUsers    from './user/ListOfuser';
import UpdateUser     from './user/UpdateUser'
import ListOfStudents from './students/ListOfStudents';
import AddStudent     from './students/AddStudent';
import UpdateStudent  from './students/UpdateStudent';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
    <div>
      <nav>
      <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
          <li style={{ marginRight: '10px' }}><Link to="/">Home</Link></li>
          <li style={{ marginRight: '10px' }}><Link to="/adduser">Create User</Link></li>
          <li style={{ marginRight: '10px' }}><Link to="/addstudent">Create Student</Link></li>
          <li style={{ marginRight: '10px' }}><Link to="/listofstudent">Details of Students</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element = {<ListOfUsers/>} />
        <Route path="/adduser" element = {<AddUser/>}/>
        <Route path="/addstudent" element = {<AddStudent/>}/>
        <Route path="/listofstudent" element = {<ListOfStudents/>}/>
        <Route path="/updateuser/:id" element = {<UpdateUser/>}/>
        <Route path="/updatestudent/:studentId" element = {<UpdateStudent/>}/>
      </Routes>
    </div>
  </Router>
  );
}
export default App;
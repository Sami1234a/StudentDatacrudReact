import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { toast } from 'react-toastify';

function App() {
  const [input, setinput] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    roll: "",
  });

  const [student, setStudent] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [currentStudentId, setCurrentStudentId] = useState(null); // Track which student is being edited

  const handleInputchange = (e) => {
    setinput((prevstate) => ({
      ...prevstate,
      [e.target.name]: e.target.value,
    }));
  };

  const handledataSubmit = async (e) => {
    e.preventDefault();
  
    // Check if any input field is empty
    if (!input.name || !input.email || !input.phone || !input.location || !input.roll) {
      toast.error("All fields are required");
      return; // Prevent the form from submitting if validation fails
    }
  
    if (isEditing) {
      // Update existing student
      await axios.put(`http://localhost:5050/students/${currentStudentId}`, input);
      toast.success("Data Updated");
      setIsEditing(false);
      setCurrentStudentId(null);
    } else {
      // Create new student
      await axios.post("http://localhost:5050/students", input);
      toast.success("Data Sent");
    }
  
    // Reset the input fields after submission
    setinput({
      name: "",
      email: "",
      phone: "",
      location: "",
      roll: "",
    });
  
    getAllstudent();
  };
  

  const getAllstudent = async () => {
    const response = await axios.get("http://localhost:5050/students");
    setStudent(response.data);
  };

  useEffect(() => {
    getAllstudent();
  }, []);

  const handleDeletdata = async (id) => {
    await axios.delete(`http://localhost:5050/students/${id}`);
    getAllstudent();
    toast.error("Data Deleted");
  };

  const handleEditButton = (student) => {
    setIsEditing(true);
    setCurrentStudentId(student.id);
    setinput(student);
  };

  return (
    <>
      <div className="student-area">
        <div className="student-card-form">
          <form className='forms' onSubmit={handledataSubmit}>
            <input type="text" placeholder='Type Your Name'
              onChange={handleInputchange} value={input.name} name='name' />
            <input type="text" placeholder='Type Your Roll Number'
              onChange={handleInputchange} value={input.roll} name='roll' />
            <input type="text" placeholder='Type Your Email'
              onChange={handleInputchange} value={input.email} name='email' />
            <input type="text" placeholder='Type Your Phone Number'
              onChange={handleInputchange} value={input.phone} name='phone' />
            <input type="text" placeholder='Type Your Location'
              onChange={handleInputchange} value={input.location} name='location' />
            <button type='submit'>{isEditing ? 'Update' : 'Send'}</button>
          </form>
        </div>
        
        <div className="student-data">
          <table border={1}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Roll</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {student.length > 0 ? (
                student.reverse().map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>{item.location}</td>
                    <td>{item.roll}</td>
                    <td>
                      <button onClick={() => handleEditButton(item)}>Edit</button>
                      <button onClick={() => handleDeletdata(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>No Data Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;

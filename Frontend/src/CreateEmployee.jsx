import React, { useState } from 'react'
import axios from 'axios'
import './App.css'

const CreateEmployee = () => {
    // state to hold form input values
    const [employee, setEmployee] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [messageType, setMessageType] = useState('');

    const handleInputChanges = (e) => {
        const { name, value } = e.target;
        setEmployee({
            ...employee,
            [name]: value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post('/api/employees', employee);
            setMessageType('success');
            setMessage('Employee Created Successfully!');
            setEmployee({ firstName: '', lastName: '', email: '' });
        } catch (error) {
            setMessageType('danger');
            setMessage('Error creating employee. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg border-0 animate__animated animate__fadeIn">
                <div className="card-header bg-primary text-white">
                    <h2 className="text-center mb-0">Create New Employee</h2>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="firstName" className="form-label">First Name:</label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg transition-effect" 
                                id="firstName"
                                name="firstName" 
                                value={employee.firstName} 
                                onChange={handleInputChanges} 
                                required 
                                placeholder="Enter first name"
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="lastName" className="form-label">Last Name:</label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg transition-effect" 
                                id="lastName"
                                name="lastName" 
                                value={employee.lastName} 
                                onChange={handleInputChanges} 
                                required 
                                placeholder="Enter last name"
                            />
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input 
                                type="email" 
                                className="form-control form-control-lg transition-effect" 
                                id="email"
                                name="email" 
                                value={employee.email} 
                                onChange={handleInputChanges} 
                                required 
                                placeholder="Enter email address"
                            />
                        </div>
                        <div className="d-grid">
                            <button 
                                type="submit" 
                                className="btn btn-primary btn-lg glow-button" 
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Creating...
                                    </>
                                ) : (
                                    'Create New Employee'
                                )}
                            </button>
                        </div>
                    </form>
                    {message && (
                        <div className={`alert alert-${messageType} mt-3 animate__animated animate__fadeIn`} role="alert">
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreateEmployee
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateEmployee from './UpdateEmployee'; // Import the modal component
import './App.css';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null); // State for selected employee ID
    const [fadeIn, setFadeIn] = useState(false);

    // Fetch employees from API
    const fetchEmployees = async () => {
        setLoading(true);
        setFadeIn(false);
        try {
            const response = await axios.get("/api/employees");
            setEmployees(response.data);
            setTimeout(() => setFadeIn(true), 100); // Add a small delay before fading in
        } catch (err) {
            setError("Error fetching employee data");
        } finally {
            setLoading(false);
        }
    };

    // Update employee logic
    const updateEmployee = (employeeId) => {
        setSelectedEmployeeId(employeeId); // Set the selected employee ID
        setShowModal(true); // Show the modal
    };

    // Delete employee logic
    const deleteEmployee = async (employeeId) => {
        const confirmed = window.confirm("Are you sure you want to delete this employee?");
        if (confirmed) {
            try {
                await axios.delete(`/api/employees/${employeeId}`);
                
                // Find the employee to remove and animate its removal
                const elementToRemove = document.getElementById(`employee-${employeeId}`);
                if (elementToRemove) {
                    elementToRemove.classList.add('animate__animated', 'animate__fadeOutRight');
                    elementToRemove.addEventListener('animationend', () => {
                        fetchEmployees(); // Refresh employee list after animation completes
                    });
                } else {
                    fetchEmployees();
                }
            } catch (error) {
                console.error("Error deleting employee:", error);
                alert("Failed to delete employee");
            }
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleModalClose = () => {
        setShowModal(false); // Close the modal
        setSelectedEmployeeId(null); // Clear the selected employee ID
    };

    if (loading) return (
        <div className='container d-flex justify-content-center align-items-center' style={{height: '50vh'}}>
            <div className="spinner-grow text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
    
    if (error) return (
        <div className='container mt-5'>
            <div className='alert alert-danger text-center animate__animated animate__shakeX'>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
            </div>
        </div>
    );

    return (
        <div className='container mt-5 animate__animated animate__fadeIn'>
            <div className="card shadow-lg border-0">
                <div className="card-header bg-primary text-white">
                    <h2 className='text-center mb-0'>Employee List</h2>
                </div>
                <div className="card-body">
                    <div className="d-grid mb-4">
                        <button 
                            className='btn btn-primary glow-button' 
                            onClick={fetchEmployees}
                        >
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Refresh Employee List
                        </button>
                    </div>
                    
                    {employees.length === 0 ? (
                        <div className="alert alert-info text-center">
                            <i className="bi bi-info-circle-fill me-2"></i>
                            No Employees found
                        </div>
                    ) : (
                        <div className='row'>
                            {employees.map((employee) => (
                                <div 
                                    key={employee.id} 
                                    id={`employee-${employee.id}`}
                                    className={`col-md-6 mb-4 ${fadeIn ? 'animate__animated animate__fadeIn' : ''}`}
                                    style={{animationDelay: `${employees.indexOf(employee) * 0.1}s`}}
                                >
                                    <div className='card h-100 shadow-sm hover-card transition-effect'>
                                        <div className='card-body d-flex flex-column'>
                                            <div className="employee-avatar mb-3 mx-auto">
                                                <div className="avatar-circle bg-primary text-white">
                                                    {employee.firstName[0]}{employee.lastName[0]}
                                                </div>
                                            </div>
                                            <h5 className='card-title text-center'>
                                                {employee.firstName} {employee.lastName}
                                            </h5>
                                            <p className="text-center text-muted mb-3">{employee.email}</p>
                                            <div className="mt-auto">
                                                <div className="d-grid gap-2">
                                                    <button
                                                        className="btn btn-outline-primary transition-effect"
                                                        onClick={() => updateEmployee(employee.id)}
                                                    >
                                                        <i className="bi bi-pencil-square me-1"></i>
                                                        Update
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger transition-effect"
                                                        onClick={() => deleteEmployee(employee.id)}
                                                    >
                                                        <i className="bi bi-trash me-1"></i>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Render the UpdateEmployee modal */}
            {showModal && (
                <UpdateEmployee
                    employeeId={selectedEmployeeId} // Pass the selected employee ID
                    onClose={handleModalClose} // Handle modal close
                    onUpdate={fetchEmployees} // Refresh the employee list after update
                />
            )}
        </div>
    );
};

export default EmployeeList;

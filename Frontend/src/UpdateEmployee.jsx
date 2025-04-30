import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const UpdateEmployee = ({ employeeId, onClose, onUpdate }) => {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchEmployee = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/employees/${employeeId}`);
                setEmployee(response.data);
            } catch (err) {
                setError("Error fetching employee data");
            } finally {
                setLoading(false);
            }
        };

        if (employeeId) {
            fetchEmployee();
        }
    }, [employeeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await axios.put(`/api/employees/${employeeId}`, employee);
            onUpdate(); // Call the onUpdate function to refresh the employee list
            onClose();  // Close the modal
        } catch (error) {
            console.error("Error updating employee:", error);
            setError("Failed to update employee. Please try again.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-body text-center p-5">
                        <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading employee data...</p>
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Error</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="alert alert-danger animate__animated animate__shakeX" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {error}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered animate__animated animate__fadeInDown" role="document">
                <div className="modal-content shadow-lg">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            <i className="bi bi-pencil-square me-2"></i>
                            Update Employee
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            {error && (
                                <div className="alert alert-danger animate__animated animate__shakeX mb-3">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {error}
                                </div>
                            )}
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg transition-effect"
                                    id="firstName"
                                    name="firstName"
                                    value={employee.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg transition-effect"
                                    id="lastName"
                                    name="lastName"
                                    value={employee.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg transition-effect"
                                    id="email"
                                    name="email"
                                    value={employee.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button 
                                type="submit" 
                                className="btn btn-primary glow-button"
                                disabled={updating}
                            >
                                {updating ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check2-circle me-2"></i>
                                        Update Employee
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateEmployee;

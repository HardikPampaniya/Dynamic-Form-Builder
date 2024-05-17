import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatButton from './ChatButton'; // Import the ChatButton component

function HomePage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [savedForms, setSavedForms] = useState([]);
    const [submittedForms, setSubmittedForms] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { submittedForm } = location.state || {};

    useEffect(() => {
        fetchSavedForms();
        fetchSubmittedForms();
    }, []);

    useEffect(() => {
        if (submittedForm) {
            setSubmittedForms([...submittedForms, submittedForm]);
        }
    }, [submittedForm]);

    const fetchSavedForms = async () => {
        try {
            const response = await fetch('http://localhost:5000/savedDrafts');
            if (response.ok) {
                const data = await response.json();
                setSavedForms(data);
            } else {
                console.error('Failed to fetch saved forms');
            }
        } catch (error) {
            console.error('Error while fetching saved forms:', error);
        }
    };

    const fetchSubmittedForms = async () => {
        try {
            const response = await fetch('http://localhost:5000/submittedForms');
            if (response.ok) {
                const data = await response.json();
                setSubmittedForms(data);
            } else {
                console.error('Failed to fetch submitted forms');
            }
        } catch (error) {
            console.error('Error while fetching submitted forms:', error);
        }
    };

    const handleNext = () => {
        if (name && description) {
            navigate('/form', { state: { name, description } });
        } else {
            alert('Please fill in all fields.');
        }
    };

    const handleLogout = () => {
        alert("Logout Successfully")
        navigate("/");
    };

    const copyFormLink = (formId) => {
        const formLink = window.location.origin + '/form/' + formId;
        navigator.clipboard.writeText(formLink);
        alert('Form link copied to clipboard!');
    };

    const handleUpdate = (formId) => {
        navigate(`/update-form/${formId}`);
    };

    const handleDelete = async (formId) => {
        try {
            const response = await fetch(`http://localhost:5000/submittedForms/${formId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setSubmittedForms(submittedForms.filter(form => form.id !== formId));
                alert('Form deleted successfully!');
            } else {
                console.error('Failed to delete form');
            }
        } catch (error) {
            console.error('Error while deleting form:', error);
        }
    };

    const viewFormResponses = (questionId) => {
        navigate(`/form-responses/${questionId}`);
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
            <h1 className="text-center">Welcome</h1>
            <p className="text-center text-muted mb-4">Please mention the name and title of the form that you want to create</p>
            <div className="mb-3">
                <label className="form-label">Name:</label>
                <input
                    type="text"
                    className="form-control form-control-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Description:</label>
                <input
                    type="text"
                    className="form-control form-control-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <button className="btn btn-primary me-2" onClick={handleNext}>Next</button>

            <div className="mt-4">
                <h3>Your Submitted Forms</h3>
                {submittedForms.map((form, index, question) => {
                    // console.log(form.id)
                    return (
                        <div className="card mt-3" key={index}>
                            <div className="card-body">
                                <h5 className="card-title">{form.name}</h5>
                                <p className="card-text">{form.description}</p>
                                <button className="btn btn-secondary me-2" onClick={() => copyFormLink(form.id)}>Copy Link</button>
                                <button className="btn btn-warning me-2" onClick={() => handleUpdate(form.id)}>Update</button>
                                <button className="btn btn-danger me-2" onClick={() => handleDelete(form.id)}>Delete</button>
                                <button className="btn btn-info me-2" key={index} onClick={() => viewFormResponses(form.id)}>Responses</button>
                            </div>
                        </div>
                    )
                })}
            </div>

            <ChatButton /> {/* Add this line to render the chat button */}
        </div>
    );
}

export default HomePage;

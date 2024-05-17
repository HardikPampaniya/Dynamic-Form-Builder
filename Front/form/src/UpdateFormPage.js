// UpdateFormPage.js

import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

function UpdateFormPage() {
    const { formId } = useParams();
    const [formData, setFormData] = useState(null);
    const [updatedName, setUpdatedName] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [updatedQuestions, setUpdatedQuestions] = useState([]);
    const [updatedOptions, setUpdatedOptions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch form data by formId when component mounts
        fetchFormData(formId);
    }, [formId]);

    const fetchFormData = async (formId) => {
        try {
            const response = await fetch(`http://localhost:5000/getFormData/${formId}`);
            if (response.ok) {
                const data = await response.json();
                setFormData(data);
                setUpdatedName(data.name);
                setUpdatedDescription(data.description);
                setUpdatedQuestions(data.questions);
            } else {
                console.error('Failed to fetch form data');
            }
        } catch (error) {
            console.error('Error while fetching form data:', error);
        }
    };
    
    
    const handleUpdateForm = async () => {
        const updatedFormData = {
            name: updatedName,
            description: updatedDescription,
            questions: updatedQuestions,
        };
    
        try {
            const response = await fetch(`http://localhost:5000/updateForm/${formId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormData),
            });

    
            if (response.ok) {
                console.log(JSON.stringify(updatedFormData));
                alert('Form updated successfully');
                navigate("/home");
            } else {
                console.error('Failed to update form');
            }
        } catch (error) {
            console.error('Error while updating form:', error);
        }
    };
    

    return (
        <div className="container mt-5">
            <h1 className="text-center">Update Form</h1>
            <p className="text-center text-muted mb-4">Update your form details</p>
            <div className="mb-3">
                <label className="form-label">Name:</label>
                <input
                    type="text"
                    className="form-control form-control-sm"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Description:</label>
                <input
                    type="text"
                    className="form-control form-control-sm"
                    value={updatedDescription}
                    onChange={(e) => setUpdatedDescription(e.target.value)}
                />
            </div>
            {updatedQuestions.map((question, index) => (
                <div key={index}>
                    <div className="mb-3">
                        <label className="form-label">Question {index + 1}:</label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            value={question.question}
                            onChange={(e) => {
                                const updatedQues = [...updatedQuestions];
                                updatedQues[index].question = e.target.value;
                                setUpdatedQuestions(updatedQues);
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Options:</label>
                        {question.options.map((option, idx) => (
                            <input
                                key={idx}
                                type="text"
                                className="form-control form-control-sm"
                                value={option.label}
                                onChange={(e) => {
                                    const updatedOpts = [...question.options];
                                    updatedOpts[idx].label = e.target.value;
                                    const updatedQues = [...updatedQuestions];
                                    updatedQues[index].options = updatedOpts;
                                    setUpdatedQuestions(updatedQues);
                                }}
                            />
                        ))}
                    </div>
                </div>
            ))}
            <button className="btn btn-primary" onClick={handleUpdateForm}>Update Form</button>
        </div>
    );
}

export default UpdateFormPage;

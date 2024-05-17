import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function FillFormPage() {
    const { formId } = useParams(); 
    const [formData, setFormData] = useState(null);
    const [formResponses, setFormResponses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (formId) {
            fetchFormData(formId);
        }
    }, [formId]);

    const fetchFormData = async (formId) => {
        try {
            const response = await fetch(`http://localhost:5000/getFormData/${formId}`);
            if (response.ok) {
                const data = await response.json();
                setFormData(data);
                const initialResponses = data.questions.map(question => ({ question: question.question, response: '' }));
                setFormResponses(initialResponses);
            } else {
                console.error('Failed to fetch form data');
            }
        } catch (error) {
            console.error('Error while fetching form data:', error);
        }
    };

    const handleTextChange = (index, value) => {
        setFormResponses(prevResponses => {
            const newFormResponses = [...prevResponses];
            newFormResponses[index] = { ...newFormResponses[index], response: value };
            return newFormResponses;
        });
    };
    

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:5000/submitFormResponse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ formId: formData.id, responses: formResponses }),

            });
            if (response.ok) {
                alert('Form submitted successfully');
                navigate(`/home`);
            } else {
                console.error('Failed to submit form');
            }
        } catch (error) {
            console.error('Error while submitting form:', error);
        }
    };

    
    
    

    return (
        <div className="container mt-5">
            <h1 className="text-center">Fill Form</h1>
            <p className="text-center text-muted mb-4">Fill out the form below</p>
            {formData && (
                <div>
                    <h3 className="text-center">Name : {formData.name}</h3>
                    <h4 className="text-center"> Description : {formData.description}</h4>
                    <form onSubmit={handleFormSubmit}>
                        {formData.questions.map((question, index) => (
                            <div key={index} className="mb-3">
                                <label className="form-label">Question {index + 1}:</label>
                                <p>{question.question}</p>
                                {question.type === 'text' ? (
                                    <textarea
                                        rows="1"
                                        className="form-control"
                                        value={formResponses[index].response}
                                        onChange={(e) => handleTextChange(index, e.target.value)}
                                    />
                                ) : question.type === 'textarea' ? (
                                    <textarea
                                        rows="4"
                                        className="form-control"
                                        value={formResponses[index].response}
                                        onChange={(e) => handleTextChange(index, e.target.value)}
                                    />
                                ) : question.type === 'checkbox' || question.type === 'radio' ? (
                                    question.options.map((option, optionIndex) => (
                                        <div key={optionIndex}>
                                            <input
                                                type={question.type}
                                                id={`option_${index}_${optionIndex}`}
                                                name={`question_${index}`}
                                                value={option.label}
                                                onChange={(e) => {
                                                    const newFormResponses = [...formResponses];
                                                    newFormResponses[index].response = e.target.value;
                                                    setFormResponses(newFormResponses);
                                                }}
                                            />
                                            <label htmlFor={`option_${index}_${optionIndex}`}>{option.label}</label>
                                        </div>
                                    ))
                                ) : question.type === 'dropdown' ? (
                                    <select
                                        className="form-select"
                                        value={formResponses[index].response}
                                        onChange={(e) => handleTextChange(index, e.target.value)}
                                    >
                                        <option value="">Select an option</option>
                                        {question.options.map((option, optionIndex) => (
                                            <option key={optionIndex} value={option.label}>{option.label}</option>
                                        ))}
                                    </select>
                                ) : null}
                            </div>
                        ))}
                        <button type="submit" className="btn btn-primary">Submit Form</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default FillFormPage;

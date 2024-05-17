import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [inputType, setInputType] = useState('text');
    const [isRequired, setIsRequired] = useState(false);
    const [options, setOptions] = useState([]);
    const [currentOption, setCurrentOption] = useState('');
    const [currentOptionLabel, setCurrentOptionLabel] = useState('');
    const [editIndex, setEditIndex] = useState(null); 
    const navigate = useNavigate();

    const location = useLocation();
    const { name, description } = location.state || {};

    useEffect(() => {
        // Load draft data if available
        const draftData = localStorage.getItem('formDraft');
        if (draftData) {
            setQuestions(JSON.parse(draftData));
        }
    }, []);

    
    const handleQuestionChange = (e) => {
        setCurrentQuestion(e.target.value);
    };

    const handleInputTypeChange = (e) => {
        setInputType(e.target.value);
        setOptions([]);
        setCurrentOptionLabel('');
    };

    const handleLogout = () => {
        alert("Logout Successfully")
        navigate("/");
    };

    const handleToggleRequired = () => {
        setIsRequired(!isRequired);
    };

    const handleOptionChange = (e) => {
        setCurrentOption(e.target.value);
    };

    const handleOptionLabelChange = (e) => {
        setCurrentOptionLabel(e.target.value);
    };

    const addQuestion = () => {
        if (currentQuestion.trim() === '') return;
        const question = {
            question: currentQuestion,
            type: inputType,
            isRequired,
            options: inputType === 'text' || inputType === 'textarea' ? [] : options.map(option => ({ label: option, value: option }))
        };
        if (editIndex !== null) {
            const updatedQuestions = [...questions];
            updatedQuestions[editIndex] = question;
            setQuestions(updatedQuestions);
            setEditIndex(null); // Reset editIndex after editing
        } else {
            setQuestions([...questions, question]);
        }
        setCurrentQuestion('');
        setIsRequired(false);
        setOptions([]);
        setCurrentOption('');
        setCurrentOptionLabel('');
    };

    const addOption = () => {
        if (currentOption.trim() === '') return;
        setOptions([...options, currentOption]);
        setCurrentOption('');
    };

    const editQuestion = (index) => {
        const question = questions[index];
        setCurrentQuestion(question.question);
        setInputType(question.type);
        setIsRequired(question.isRequired);
        if (question.type === 'dropdown' || question.type === 'checkbox' || question.type === 'radio') {
            setOptions(question.options.map(opt => opt.label));
        } else {
            setOptions([]);
        }
        setEditIndex(index);
    };
    
    const deleteQuestion = (index) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            const updatedQuestions = [...questions];
            updatedQuestions.splice(index, 1);
            setQuestions(updatedQuestions);
        }
    };

    const saveDraft = async () => {
        const Data = { 
            name,
            description,
            questions,
            is_draft: 1 // Indicates it's a draft
        };
    
        try {
            const response = await fetch('http://localhost:5000/savedraft', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Data) 
            });
    
            if (response.ok) {
                alert('Save as a Draft successfully!');
                toast.success("Form saved as draft successfully!");
            } else {
                console.error('Failed to save form as draft');
            }
        } catch (error) {
            console.error('Error while saving form as draft:', error);
        }
    };
    
    const handleSubmit = async () => {
        localStorage.removeItem('formDraft');
    
        const Data = { 
            name,
            description,
            questions,
            is_draft: 0 
        };
    
        try {
            const response = await fetch('http://localhost:5000/submitForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Data) 
            });
    
            if (response.ok) {
                toast.success("Form submitted successfully!");
                alert('Form created successfully!');
                window.location.reload();
            } else {
                console.error('Failed to submit form');
            }
        } catch (error) {
            console.error('Error while submitting form:', error);
        }
    };
    

    const renderInputField = (type) => {
        switch (type) {
            case 'text':
                return <input type="text" className="form-control mb-3" />;
            case 'textarea':
                return <textarea className="form-control mb-3"></textarea>;
            case 'dropdown':
            case 'checkbox':
            case 'radio':
                return (
                    <>
                        <input type="text" value={currentOption} onChange={handleOptionChange} className="form-control mb-3" placeholder="Option" />
                        <button onClick={addOption} className="btn btn-primary mb-2">Add Option</button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mt-5" style={{ backgroundColor: 'rgba(136, 118, 69, 0.3)' }}>
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
            <div className="border p-4">
                <h2 className="text-center mb-4">Create Form</h2>
                <h3 className="text-center mb-4">Name: {name}</h3>
                <h3 className="text-center mb-4">Description: {description}</h3>
                <div className="mb-3">
                    <label className="form-label">Question{isRequired && <span style={{ color: 'red' }}>*</span>}:</label>
                    <input type="text" value={currentQuestion} onChange={handleQuestionChange} className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Input Type:</label>
                    <select value={inputType} onChange={handleInputTypeChange} className="form-select">
                        <option value="text">Text</option>
                        <option value="textarea">Textarea</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="radio">Radio Button</option>
                    </select>
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="isRequired" checked={isRequired} onChange={handleToggleRequired} />
                    <label className="form-check-label" htmlFor="isRequired">Required</label>
                </div>
                {['checkbox', 'radio'].includes(inputType) && (
                    <div className="mb-3">
                        <h4>Add Options:</h4>
                        {renderInputField(inputType)}
                    </div>
                )}
                {inputType === 'dropdown' && (
                    <div className="mb-3">
                        <h4>Select Options:</h4>
                        {renderInputField(inputType)}
                    </div>
                )}
                <button onClick={addQuestion} className="btn btn-primary mb-3">
                {editIndex !== null ? 'Update Question' : 'Add Question'}</button>
                <div className="form-preview">
                    <h3 className="mb-3">Form Preview</h3>
                    <form>
                        {questions.map((q, index) => (
                            <div key={index} className="mb-3">
                                <label className="form-label">{index + 1}. {q.question}{q.isRequired && <span style={{ color: 'red' }}>*</span>}</label>
                                <div>
                                    <button onClick={() => editQuestion(index)} className="btn btn-sm btn-info me-2">Edit</button>
                                    <button onClick={() => deleteQuestion(index)} className="btn btn-sm btn-danger">Delete</button>
                                </div>
                                {q.type === 'text' || q.type === 'textarea' ? (
                                    renderInputField(q.type)
                                ) : (
                                    q.type === 'dropdown' ? (
                                        <select className="form-select mb-3" value={currentOption} onChange={handleOptionChange}>
                                            {q.options.map((option, idx) => (
                                                <option key={idx} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        q.options.map((option, idx) => (
                                            <div key={idx} className="form-check">
                                                <input className="form-check-input" type={q.type} value={option.value} id={`option-${index}-${idx}`} />
                                                <label className="form-check-label" htmlFor={`option-${index}-${idx}`}>{option.label}</label>
                                            </div>
                                        ))
                                    )
                                )}
                            </div>
                        ))}
                    </form>
                </div>
                <button onClick={handleSubmit} className="btn btn-primary">Submit Form</button>
                <button onClick={saveDraft} className="btn btn-secondary me-2">Save as Draft</button>
            </div>
        </div>
    );
}

export default Home;

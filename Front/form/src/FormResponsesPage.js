
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function FormResponsesPage() {
    const { questionId } = useParams();
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        fetchResponses(questionId);
    }, [questionId]);

    const fetchResponses = async (questionId) => {
        try {
            const response = await fetch(`http://localhost:5000/form-responses/${questionId}`);
            if (response.ok) {
                const responseData = await response.json();
                setResponses(responseData);
            } else {
                console.error('Failed to fetch responses for form');
            }
        } catch (error) {
            console.error('Error while fetching responses:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Form Responses</h1>
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Response</th>
                    </tr>
                </thead>
                <tbody>
                    {responses.map((response, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{response}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FormResponsesPage;

import React from 'react'
import Login from './Login'
import { BrowserRouter, Routes, Route, } from 'react-router-dom'
import Signup from './Signup'
import Home from './Home'
import Form from './Form'
import UpdateFormPage from './UpdateFormPage';
import FillFormPage from './FillFormPage'
import FormResponsesPage from './FormResponsesPage'




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
      <Route path='/signup' element={<Signup />}></Route>
      <Route path='/home' element={<Home />}></Route>
      <Route path='/form' element={<Form />}></Route>
      <Route path="/update-form/:formId" element={<UpdateFormPage />} />
      <Route path="/form/:formId" element={<FillFormPage />} />
      <Route path="/form-responses/:questionId" element={<FormResponsesPage />} />


</Routes >
</BrowserRouter >
)
}
export default App
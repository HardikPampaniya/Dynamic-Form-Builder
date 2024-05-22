const express = require("express")
const userController = require('../controllers/loginController.js');

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/submitform', userController.submitForm);
router.post('/savedraft', userController.saveDraft);
router.get('/submittedForms', userController.getSubmittedForms);
router.get('/savedDrafts', userController.getSavedDrafts);

router.delete('/submittedForms/:id', userController.deleteForm); 
router.patch('/updateForm/:formId', userController.updateForm);
router.get('/getFormData/:formId', userController.getFormDataById);
router.get('/form/:Id', userController.fillForm);
router.post('/submitFormResponse', userController.submitFormResponse );
router.get('/form-responses/:questionId', userController.getQuestionResponses);



module.exports = router;

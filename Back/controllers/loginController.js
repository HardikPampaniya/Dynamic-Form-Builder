const jwt = require('jsonwebtoken');
const db = require('../db').promise();
const bcrypt = require('bcrypt'); 
const jwtKey = 'form';
const saltRounds = 5;

exports.signup = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?, ?, ?)";

        const values = [
            req.body.name,
            req.body.email,
            hashedPassword 
        ];

        const [result] = await db.query(sql, values);

        const token = jwt.sign({ email: req.body.email }, jwtKey, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;
    

    try {
        const [rows] = await db.query('SELECT * FROM login WHERE email = ?', [email]);
        const user = rows[0];
        console.log(user);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email ' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        console.log(passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, jwtKey, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.submitForm = async (req, res) => {
    try {
        const { id, name, description, questions } = req.body;
        const sql = "INSERT INTO questions (`id`, `name`, `description`, `questions`) VALUES (?, ?, ?, ?)";
        const values = [id, name, description, JSON.stringify(questions)];
        const [data] = await db.query(sql, values);
        return res.json(data);
    } catch (error) {
        console.error('Error inserting form data into the database:', error);
        return res.json("Error");
    }
};

exports.saveDraft = async (req, res) => {
    try {
        const { id, name, description, questions } = req.body;
        const sql = "INSERT INTO questions (`id`, `name`, `description`, `questions`, `is_draft`) VALUES (?, ?, ?, ?, 1)";
        const values = [id, name, description, JSON.stringify(questions)];
        const [data] = await db.query(sql, values);
        return res.json(data);
    } catch (error) {
        console.error('Error saving draft data into the database:', error);
        return res.json("Error");
    }
};

exports.getSubmittedForms = async (req, res) => {
    try {
        const sql = "SELECT * FROM questions ";
        const [data] = await db.query(sql);
        return res.json(data);
    } catch (error) {
        console.error('Error fetching submitted forms from the database:', error);
        return res.json("Error");
    }
};

exports.getSavedDrafts = async (req, res) => {
    try {
        const sql = "SELECT * FROM questions WHERE is_draft = 1";
        const [data] = await db.query(sql);
        return res.json(data);
    } catch (error) {
        console.error('Error fetching saved drafts from the database:', error);
        return res.json("Error");
    }
};

exports.deleteForm = async (req, res) => {
    try {
        const formId = req.params.id;
        const sql = "DELETE FROM questions WHERE id = ?";
        const [data] = await db.query(sql, [formId]);
        return res.json(data);
    } catch (error) {
        console.error('Error deleting form from the database:', error);
        return res.json("Error");
    }
};

exports.updateForm = async (req, res) => {
    try {
        const formId = req.params.formId;
        const { name, description, questions } = req.body;
        const sql = "UPDATE questions SET name = ?, description = ?, questions = ? WHERE id = ?";
        const values = [name, description, JSON.stringify(questions), formId];
        const [result] = await db.query(sql, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No matching record found' });
        }
        console.log('Form updated successfully');
        return res.json({ message: 'Form updated successfully' });
    } catch (error) {
        console.error('Error updating form data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getFormDataById = async (req, res) => {
    try {
        const formId = req.params.formId;
        const sql = "SELECT * FROM questions WHERE id = ?";
        const [result] = await db.query(sql, [formId]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Form not found' });
        }
        const formData = result[0];
        const formQuestions = JSON.parse(formData.questions);
        const response = {
            id: formData.id,
            name: formData.name,
            description: formData.description,
            questions: formQuestions
        };
        return res.json(response);
    } catch (error) {
        console.error('Error fetching form data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.fillForm = async (req, res) => {
    try {
        const Id = req.params.Id;
        const sql = "SELECT * FROM questions WHERE id = ?";
        const [result] = await db.query(sql, [Id]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Form not found' });
        }
        const formData = result[0];
        const formQuestions = JSON.parse(formData.questions);
        const response = {
            id: formData.id,
            name: formData.name,
            description: formData.description,
            questions: formQuestions
        };
        return res.json(response);
    } catch (error) {
        console.error('Error fetching form data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.submitFormResponse = async (req, res) => {
    try {
        const { formId, responses } = req.body;
        const sql = "INSERT INTO responses (id, response) VALUES (?, ?)";
        const values = [formId, JSON.stringify(responses)];
        await db.query(sql, values);
        console.log('Form responses inserted successfully');
        return res.json({ message: 'Form responses inserted successfully' });
    } catch (error) {
        console.error('Error inserting form responses into the database:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getQuestionResponses = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const sql = "SELECT id,response FROM responses WHERE id = ?";
        const [result] = await db.query(sql, [questionId]);
        const responses = result.map(row => row.response);
        return res.json(responses);
    } catch (error) {
        console.error('Error fetching responses for question:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


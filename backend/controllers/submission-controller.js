import Submission from "../models/submission-model.js"

const submit = async (req, res) => {
    try {
        const { problem, language, verdict } = req.body;
        const submission = await Submission(
            { user, problem, code, language, verdict }
        );
        await submission.save();

    } catch (err) {
        res.status(500).json({
            status: 'unsuccessful',
            message: err.message,
        });
    }
}

export default submit

import SaveCode from "../models/save-code-model.js"

const saveCode = async (req, res) => {
    try {
        const user_id = req.user.user._id;

        let { language, code, problemNumber } = req.body;
        problemNumber = problemNumber || -1;

        if (!language || !code) {
            return res.status(400).json({
                status: "unsuccessful",
                message: "All fields are required: code, language",
            });
        }
        code = atob(code);

        const result = await SaveCode.findOneAndUpdate(
            { user: user_id, problem: problemNumber, language: language },
            {
                code: code,
                savedAt: Date.now()  // Update the savedAt field with the current date and time
            },
            {
                new: true,
                upsert: true,
            }
        );

        if (!result) {
            return res.status(404).json({ status: "not found", message: "Record not found" });
        }

        res.status(200).json({ status: "ok", message: "Code updated successfully" });
    } catch (err) {
        console.error(err)
        res.status(500).json({ status: "unsucessful", message: err.message });
    }
}

const getsavedCode = async (req, res) => {
    try {
        const user_id = req.user.user._id;
        let { language, problemNumber } = req.query;
        problemNumber = problemNumber || -1;

        const query = { user: user_id, problem: problemNumber };
        if (language) {
            query.language = language;
        }

        const savedcode = await SaveCode.findOne(query)
            .sort({ savedAt: -1 })
            .lean()
            .exec();

        if (savedcode) {
            res.status(200).json({ status: "ok", language: savedcode.language || "python", code: savedcode.code || "" })
        }
        else {
            res.status(200).json({ status: "ok", language: "python", code: "" })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ status: "unsucessful", language: "python", code: "", message: err.message })
    }
}

export { getsavedCode, saveCode };
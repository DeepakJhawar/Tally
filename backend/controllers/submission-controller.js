import Submission from "../models/submission-model.js"
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import util from 'util';
import { v4 as uuidv4 } from 'uuid';

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

const execPromise = util.promisify(exec);

const runCode = async (language, code, input, output) => {
    const uniqueId = uuidv4();
    const executable = `tempCode_${uniqueId}`;
    const fileName = `${executable}.${getFileExtension(language)}`;

    try {
        // Determine the Docker image to use based on the language
        const imageName = getDockerImageName(language);
        if (!imageName) {
            throw new Error('Unsupported language');
        }

        // Create a temp file to hold the code
        await fs.writeFile(fileName, code);

        // Construct the Docker run command
        const command = `sudo docker run --rm -e EXECUTABLE=${executable} -v ${process.cwd()}:/usr/src/app --memory="256m" --memory-swap="500m" --cpus="1.0" ${imageName}`;

        const timeout = 30000; // 30 seconds
        const execPromiseWithTimeout = (cmd) => {
            return Promise.race([
                execPromise(cmd),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
            ]);
        };

        // Execute the command
        const { stdout, stderr } = await execPromiseWithTimeout(command);

        if (stderr.includes('timeout')) {
            throw new Error('Execution timed out');
        }

        // Compare output to expected output
        const passed = stdout.trim() === expectedOutput.trim();
        return {
            status: passed ? 'passed' : 'failed',
            output: stdout.trim(),
            expectedOutput: expectedOutput.trim(),
        };
    } catch (error) {
        console.log(error.message)
        if (error.message.includes('sudo')) {
            return {
                status: 'failed',
                error: 'Memory limit exceeded',
            };
            ;
        }

        return {
            status: 'failed',
            error: error.stderr || error.message,
        };
    } finally {
        // Clean up the temp file
        try {
            await fs.unlink(executable);
        } catch (err){}
        try {
            await fs.unlink(fileName);
        } catch (err) {
            console.error(`Failed to delete file: ${fileName}`, err);
        }
    }
}

const submitCode = async (req, res) => {
    const { language, code, problemId } = req.body;
    const response = await runCode(language, code, "", "hello world");
    if (response.status == "failed"){
        res.status(400).json(response)
    }
    else {
        res.status(200).json(response)
    }
    
};

const getDockerImageName = (language) => {
    switch (language) {
        case 'python':
            return 'code-judge-python';
        case 'javascript':
            return 'code-judge-nodejs';
        case 'cpp':
            return 'code-judge-cpp';
        case 'c':
            return 'code-judge-c';
        default:
            return null;
    }
};

const getFileExtension = (language) => {
    switch (language) {
        case 'python':
            return 'py';
        case 'javascript':
            return 'js';
        case 'cpp':
            return 'cpp';
        default:
            return '';
    }
};

export { submitCode, getDockerImageName, getFileExtension, submit };


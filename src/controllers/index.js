const services = require("../services");
const Login = async (req, res) => {
    try {
        const result = await services.Login(req);
        if (result.isSuccess) {
            res.status(result.status_code).send(result);
        } else {
            res.status(result.status_code).send({ message: result.message });
        } 
    } catch (error) {
        res.status(400).send({ message: 'An error occurred while login.' });
    }
};
const GetQuestion = async (req, res) => {
    try {
        const result = await services.GetQuestion(req);
        if (result.isSuccess) {
            res.status(result.status_code).send(result);
        } else {
            res.status(result.status_code).send({ message: result.message });
        } 
    } catch (error) {
        res.status(400).send({ message: 'An error occurred while getting questions.' });
    }
};
const SubmitAnswer = async (req, res) => {
    try {
        const result = await services.SubmitAnswer(req);
        if (result.isSuccess) {
            res.status(result.status_code).send(result);
        } else {
            res.status(result.status_code).send({ message: result.message });
        } 
    } catch (error) {
        console.log("Error Submit answer:", error);
        res.status(400).send({ message: 'An error occurred while submit answer.' });
    }
};
const UploadAnswerS3 = async (req, res) => {
    try {
        const result = await services.UploadAnswers();
        if (result.isSuccess) {
            res.status(result.status_code).send(result);
        } else {
            res.status(result.status_code).send({ message: result.message });
        } 
    } catch (error) {
        res.status(400).send({ message: 'An error occurred while submit answer.' });
    }
};
module.exports =
{
    Login,
    GetQuestion,
    SubmitAnswer,
    UploadAnswerS3
}
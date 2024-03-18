const axios = require('axios');
const AWS = require('aws-sdk');
const csv = require('csv');
const assert = require('node:assert');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

require("dotenv").config();

const EVENT_TYPE = process.env.JAMSAI_EVENT_TYPE;
const SOURCE = process.env.JAMSAI_SOURCE;
const REF_ID_PREFIX = process.env.JAMSAI_SOURCE_REF_ID;
const BUCKET = process.env.AWS_S3_BUCKET;
const PATH = process.env.AWS_S3_PATH;
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});
const BUCKET_ANSWER = process.env.AWS_S3_ANSWER_BUCKET;
const PATH_ANSWER = process.env.AWS_S3_ANSWER_PATH;
const s3_ANSWER = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ANSWER_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_ANSWER_SECRET_ACCESS_KEY,
});

const Login = async (req) => {
  try {
    const { user_id } = req.body;
    if (user_id) {
        const token_result = await getToken();
        if (!token_result) 
            return {
                isSuccess: false,
                status_code: 400,
                message: "Get token fail",
            };
        const { access_token } = token_result;
        const res = await axios({
            method: 'get',
            url: process.env.JAMSAI_API_URL + '/' + user_id,
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
        })
        if (res && res.data) {
            const { code, message, reference, data } = res.data
            const result = {
                ...data,
                reference
            }
            return {
                isSuccess: message == "Success",
                status_code: 200,
                data: result,
                message: "Success",
            };
        } else {
            return {
            isSuccess: false,
            status_code: 400,
            message: "Login fail",
            };
        }
    } else {
        return {
          isSuccess: false,
          status_code: 400,
          message: "User id can not be empty",
        };
    }
  } catch (err) {
    console.log("Error Login:", err);
    return {
      isSuccess: false,
      status_code: 400,
      message: "An error occurred while Login",
    };
  }
};
const getToken = async () => {
    try {
        //form.append('scope', 'crm/product crm/user');
        const res = await axios({
            method: 'post',
            url: process.env.JAMSAI_API_AUTHEN_URL,
            data: {
                grant_type: 'client_credentials'
            },
            headers: {
                'Content-Type': `application/x-www-form-urlencoded`,
            },
            auth: {
              username: process.env.JAMSAI_API_CLIENT_ID,
              password: process.env.JAMSAI_API_CLIENT_SECRET
            },
        })
        return res.data;
      } catch (err) {
        console.log("Error getToken:", err);
        return null;
      }
};
const GetQuestion = async (req) => {
  try {
    return {
        isSuccess: true,
        status_code: 200,
        message: "Success",
        data: {
            questions: [
                {
                    id: 1,
                    question: '',
                    choices: [
                        {
                            id: 101,
                            answer: 'a',
                            next: 2
                        },
                        {
                            id: 102,
                            answer: 'b',
                            next: 3
                        },
                        {
                            id: 103,
                            answer: 'c',
                            next: 4
                        },
                        {
                            id: 104,
                            answer: 'd',
                            next: 5
                        },
                    ],
                    theme: 1
                },
                {
                    id: 2,
                    question: '',
                    choices: [
                        {
                            id: 201,
                            answer: 'a',
                            next: 6
                        },
                        {
                            id: 202,
                            answer: 'b',
                            next: 6
                        },
                        {
                            id: 203,
                            answer: 'c',
                            next: 6
                        },
                        {
                            id: 204,
                            answer: 'd',
                            next: 6
                        },
                    ],
                    theme: 2
                },
                {
                    id: 3,
                    question: '',
                    choices: [
                        {
                            id: 301,
                            answer: 'a',
                            next: 7
                        },
                        {
                            id: 302,
                            answer: 'b',
                            next: 7
                        },
                        {
                            id: 303,
                            answer: 'c',
                            next: 7
                        },
                        {
                            id: 304,
                            answer: 'd',
                            next: 7
                        },
                    ],
                    theme: 3
                },
                {
                    id: 4,
                    question: '',
                    choices: [
                        {
                            id: 401,
                            answer: 'a',
                            next: 8
                        },
                        {
                            id: 402,
                            answer: 'b',
                            next: 8
                        },
                        {
                            id: 403,
                            answer: 'c',
                            next: 8
                        },
                        {
                            id: 404,
                            answer: 'd',
                            next: 8
                        },
                    ],
                    theme: 4
                },
                {
                    id: 5,
                    question: '',
                    choices: [
                        {
                            id: 501,
                            answer: 'a',
                            next: 9
                        },
                        {
                            id: 502,
                            answer: 'b',
                            next: 9
                        },
                        {
                            id: 503,
                            answer: 'c',
                            next: 9
                        },
                        {
                            id: 504,
                            answer: 'd',
                            next: 9
                        },
                    ],
                    theme: 5
                },
                {
                    id: 6,
                    question: '',
                    choices: [
                        {
                            id: 601,
                            answer: 'a',
                            next: 10
                        },
                        {
                            id: 602,
                            answer: 'b',
                            next: 10
                        },
                        {
                            id: 603,
                            answer: 'c',
                            next: 10
                        },
                        {
                            id: 604,
                            answer: 'd',
                            next: 10
                        },
                    ],
                    theme: 2
                },
                {
                    id: 7,
                    question: '',
                    choices: [
                        {
                            id: 701,
                            answer: 'a',
                            next: 11
                        },
                        {
                            id: 702,
                            answer: 'b',
                            next: 11
                        },
                        {
                            id: 703,
                            answer: 'c',
                            next: 11
                        },
                        {
                            id: 704,
                            answer: 'd',
                            next: 11
                        },
                    ],
                    theme: 3
                },
                {
                    id: 8,
                    question: '',
                    choices: [
                        {
                            id: 801,
                            answer: 'a',
                            next: 12
                        },
                        {
                            id: 802,
                            answer: 'b',
                            next: 12
                        },
                        {
                            id: 803,
                            answer: 'c',
                            next: 12
                        },
                        {
                            id: 804,
                            answer: 'd',
                            next: 12
                        },
                    ],
                    theme: 4
                },
                {
                    id: 9,
                    question: '',
                    choices: [
                        {
                            id: 901,
                            answer: 'a',
                            next: 13
                        },
                        {
                            id: 902,
                            answer: 'b',
                            next: 13
                        },
                        {
                            id: 903,
                            answer: 'c',
                            next: 13
                        },
                        {
                            id: 904,
                            answer: 'd',
                            next: 13
                        },
                    ],
                    theme: 5
                },
                {
                    id: 10,
                    question: '',
                    choices: [
                        {
                            id: 1001,
                            answer: 'a',
                            next: null
                        },
                        {
                            id: 1002,
                            answer: 'b',
                            next: null
                        },
                        {
                            id: 1003,
                            answer: 'c',
                            next: null
                        },
                        {
                            id: 1004,
                            answer: 'd',
                            next: null
                        },
                    ],
                    theme: 2
                },
                {
                    id: 11,
                    question: '',
                    choices: [
                        {
                            id: 1101,
                            answer: 'a',
                            next: null
                        },
                        {
                            id: 1102,
                            answer: 'b',
                            next: null
                        },
                        {
                            id: 1103,
                            answer: 'c',
                            next: null
                        },
                        {
                            id: 1104,
                            answer: 'd',
                            next: null
                        },
                    ],
                    theme: 3
                },
                {
                    id: 12,
                    question: '',
                    choices: [
                        {
                            id: 1201,
                            answer: 'a',
                            next: null
                        },
                        {
                            id: 1202,
                            answer: 'b',
                            next: null
                        },
                        {
                            id: 1203,
                            answer: 'c',
                            next: null
                        },
                        {
                            id: 1204,
                            answer: 'd',
                            next: null
                        },
                    ],
                    theme: 4
                },
                {
                    id: 13,
                    question: '',
                    choices: [
                        {
                            id: 1301,
                            answer: 'a',
                            next: null
                        },
                        {
                            id: 1302,
                            answer: 'b',
                            next: null
                        },
                        {
                            id: 1303,
                            answer: 'c',
                            next: null
                        },
                        {
                            id: 1304,
                            answer: 'd',
                            next: null
                        },
                    ],
                    theme: 5
                },
            ]
        }
    };
  } catch (err) {
    console.log("Error get questions:", err);
    return {
      isSuccess: false,
      status_code: 400,
      message: "An error occurred while getting questions",
    };
  }
};
const SubmitAnswer = async (req) => {
  try {
    const { jamsai_id, answers } = req.body;
    const result = CalculateBenefit(answers);
    const data = {
        jamsai_id: jamsai_id,
        answers: JSON.stringify(answers),
        created_at: new Date(),
    }
    if (jamsai_id) {
        const existAnswer = await prisma.book_fair_event_answers.findMany({
            where: {
                jamsai_id: jamsai_id
            },
        });
        await prisma.book_fair_event_answers.create({
            data: data,
        });
        await CreateHeartCsv(data);
        return {
            isSuccess: true,
            status_code: 200,
            message: "Success",
            data: {
                reward_id: result,
                is_earn: (existAnswer && existAnswer.length > 0)
            }
        };
    } else {
        await prisma.book_fair_event_answers.create({
            data: data,
        });
        return {
            isSuccess: true,
            status_code: 200,
            message: "Success",
            data: {
                reward_id: result,
                is_earn: false
            }
        };
    }
  } catch (err) {
    console.log("Error Submit answer:", err);
    return {
      isSuccess: false,
      status_code: 400,
      message: "An error occurred while submit answer",
    };
  }
};
const CalculateBenefit = (answers) => {
    if (answers && answers.length > 2) {
        if (answers[0] == 1) {
            if (answers[1] == 1) {
                return 1;
            } else if (answers[1] == 2) {
                return 2;
            } else if (answers[1] == 3) {
                return 3;
            } else if (answers[1] == 4) {
                return 4;
            } else return 1;
        } else if (answers[0] == 2) {
            if (answers[1] == 1) {
                return 5;
            } else if (answers[1] == 2) {
                return 6;
            } else if (answers[1] == 3) {
                return 7;
            } else if (answers[1] == 4) {
                return 8;
            } else return 1;
        } else if (answers[0] == 3) {
            if (answers[1] == 1) {
                return 9;
            } else if (answers[1] == 2) {
                return 10;
            } else if (answers[1] == 3) {
                return 11;
            } else if (answers[1] == 4) {
                return 12;
            } else return 1;
        } else if (answers[0] == 4) {
            if (answers[1] == 1) {
                return 13;
            } else if (answers[1] == 2) {
                return 14;
            } else if (answers[1] == 3) {
                return 15;
            } else if (answers[1] == 4) {
                return 16;
            } else return 1;
        } else return 1;
    } else return 1;
};
const UploadAnswers = async () => {
    try {
        const answers = await prisma.book_fair_event_answers.findMany({
            where: {
                upload_s3_at: null
            },
        });
        await CreateAnswerCsv(answers);
        await prisma.book_fair_event_answers.updateMany({
            where: {
                upload_s3_at: null,
            },
            data: {
                upload_s3_at: new Date(),
            },
        });
        return {
            isSuccess: true,
            status_code: 200,
            message: "Success"
        };
    } catch (err) {
        console.log("Error Submit answer:", err);
        return {
          isSuccess: false,
          status_code: 400,
          message: "An error occurred while submit answer",
        };
    }
};
const CreateAnswerCsv = async (answers) => {
    try {
        let data = [];
        for(var element of answers){
            const ans = JSON.parse(element.answers)
            if (ans && ans.length == 4) {
                data = [
                    ...data,
                    {
                        id: element.jamsai_id.toString(), 
                        q1: ans[0], 
                        q2: ans[1], 
                        q3: ans[2], 
                        q4: ans[3], 
                        timestamp: ConvertDatetimeFormat(element.created_at)
                    }
                ]
            }
        }
        const csvWriter = createObjectCsvWriter({
            path: 'output.csv',
            header: [
              { id: 'id', title: 'Jamsai ID' },
              { id: 'q1', title: 'Q1' },
              { id: 'q2', title: 'Q2' },
              { id: 'q3', title: 'Q3' },
              { id: 'q4', title: 'Q4' },
              { id: 'timestamp', title: 'Timestamp' }
            ]
        });
        csvWriter.writeRecords(data)
        .then(() => {
            const fileContent = fs.readFileSync('output.csv');
            const key = `${PATH_ANSWER}/kiosk_answers_${new Date().getTime()}.csv`
            const putObjectCommand = {
                Bucket: BUCKET_ANSWER, 
                Key: key,
                Body: fileContent,
            };
            s3_ANSWER.upload(putObjectCommand, function (err, data) {
                fs.unlink('output.csv', (err) => {
                    if (err) {
                      console.error('Error deleting file:', err);
                      return;
                    }
                    console.log('File deleted successfully');
                });
                if (err) {
                    return err;
                }
                if (data) {
                    return true;
                }
            });
        })
        .catch(err => {
            console.error('Error writing CSV file:', err);
            return null;
        });
    } catch (err) {
        console.log("Error Submit answer:", err);
        return null;
    }
};
const CreateHeartCsv = async (element) => {
    try {
        const data = [{
            id: element.jamsai_id.toString(), 
            event_type: EVENT_TYPE, 
            source: SOURCE, 
            ref_id: REF_ID_PREFIX + element.created_at.getTime().toString(),
            timestamp: ConvertDatetimeFormat(element.created_at)
        }];
        const csvWriter = createObjectCsvWriter({
            path: 'output1.csv',
            header: [
              { id: 'timestamp', title: 'CREATED_AT' },
              { id: 'id', title: 'JAMSAI_ID' },
              { id: 'event_type', title: 'EVENT_TYPE' },
              { id: 'source', title: 'SOURCE' },
              { id: 'ref_id', title: 'SOURCE_REF_ID' }
            ]
        });
        csvWriter.writeRecords(data)
        .then(() => {
            const fileContent = fs.readFileSync('output1.csv');
            const key = `${PATH}/kiosk_${new Date().getTime()}.csv`
            const putObjectCommand = {
                Bucket: BUCKET, 
                Key: key,
                Body: fileContent,
            };
            s3.upload(putObjectCommand, function (err, data) {
                fs.unlink('output1.csv', (err) => {
                    if (err) {
                      console.error('Error deleting file:', err);
                      return;
                    }
                    console.log('File deleted successfully');
                });
                if (err) {
                    return err;
                }
                if (data) {
                    return true;
                }
            });
        })
        .catch(err => {
            console.error('Error writing CSV file:', err);
            return null;
        });
    } catch (err) {
        console.log("Error Submit answer:", err);
        return null;
    }
};
const ConvertDatetimeFormat = (dat) => {
    return ('0' + dat.getDate()).slice(-2) + '/'
    + ('0' + (dat.getMonth() + 1)).slice(-2) + '/'
    + dat.getFullYear() + ' '
    + ('0' + dat.getHours()).slice(-2) + ':'
    + ('0' + dat.getMinutes()).slice(-2) + ':'
    + ('0' + dat.getSeconds()).slice(-2)
}
module.exports = {
    Login,
    GetQuestion,
    SubmitAnswer,
    UploadAnswers
};
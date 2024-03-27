const axios = require('axios');
const AWS = require('aws-sdk');
const csv = require('csv');
const assert = require('node:assert');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const csvjson = require('csvjson');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

require("dotenv").config();

const EVENT_TYPE = process.env.JAMSAI_EVENT_TYPE;
const SOURCE = process.env.JAMSAI_SOURCE;
const REF_ID_PREFIX = process.env.JAMSAI_SOURCE_REF_ID;
const BUCKET = process.env.AWS_S3_BUCKET;
const PATH = process.env.AWS_S3_PATH;
const s3 = new AWS.S3({
    accessKeyId: "AKIARPJPOQ76N27DXEFH",
    secretAccessKey: "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",
    region: "ap-southeast-1"
});
const BUCKET_ANSWER = process.env.AWS_S3_ANSWER_BUCKET;
const PATH_ANSWER = process.env.AWS_S3_ANSWER_PATH;
const s3_ANSWER = new AWS.S3({
    accessKeyId: "AKIARPJPOQ76N27DXEFH",
    secretAccessKey: "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",
    region: "ap-southeast-1"
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
      const id = (jamsai_id && (typeof jamsai_id == 'string')) ? BigInt(jamsai_id) : jamsai_id
      const result = CalculateBenefit(answers);
      const data = {
          jamsai_id: id,
          answers: JSON.stringify(answers),
          created_at: new Date(),
      }
      if (id) {
          const existAnswer = await prisma.book_fair_event_answers.findMany({
              where: {
                  jamsai_id: id
              },
          });
          await prisma.book_fair_event_answers.create({
              data: data,
          });
          const uploadData = CreateHeartCsv(data);
          const key = `${PATH}/kiosk_${new Date().getTime()}.csv`
          const putObjectCommand = {
              Bucket: BUCKET, 
              Key: key,
              Body: uploadData,
              ContentType: 'text/csv',
          };
          const upload_result = await s3.upload(putObjectCommand, function (err, data) {
              if (err) {
                  console.log('Upload error', err);
                  return err
              }
              if (data) {
                  console.log('Upload successfully', data);
                  return data;
              }
          }).promise();
          return {
              isSuccess: true,
              status_code: 200,
              message: "Success",
              upload: key,
              upload_result: upload_result,
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
        message: err,
      };
    }
  };
const CalculateBenefit = (answers) => {
    if (answers && answers.length > 3) {
        if (answers[0] == 1 || answers[0] == '1') {
            if (answers[2] == 1 || answers[2] == '1') {
                return 12;
            } else if (answers[2] == 2 || answers[2] == '2') {
                return RandomData([10, 9]);
            } else if (answers[2] == 3 || answers[2] == '3') {
                return 13;
            } else if (answers[2] == 4 || answers[2] == '4') {
                return 11;
            } else return 12;
        } else if (answers[0] == 3 || answers[0] == '3') {
            if (answers[2] == 1 || answers[2] == '1') {
                return 6;
            } else if (answers[2] == 2 || answers[2] == '2') {
                return 7;
            } else if (answers[2] == 3 || answers[2] == '3') {
                return 8;
            } else if (answers[2] == 4 || answers[2] == '4') {
                return RandomData([6, 7]);
            } else return 6;
        } else if (answers[0] == 4 || answers[0] == '4') {
            if (answers[2] == 1 || answers[2] == '1') {
                return 14;
            } else if (answers[2] == 2 || answers[2] == '2') {
                return 15;
            } else if (answers[2] == 3 || answers[2] == '3') {
                return 15;
            } else if (answers[2] == 4 || answers[2] == '4') {
                return 14;
            } else return 14;
        } else if (answers[0] == 2 || answers[0] == '2') {
            if (answers[2] == 1 || answers[2] == '1') {
                return RandomData([3, 5]);
            } else if (answers[2] == 2 || answers[2] == '2') {
                return 4;
            } else if (answers[2] == 3 || answers[2] == '3') {
                return 2;
            } else if (answers[2] == 4 || answers[2] == '4') {
                return 1;
            } else return 4;
        } else return 1;
    } else return 1;
};
const RandomData = (data) => {
    const randInd = (Math.floor(Math.random() * 2));
    return data[randInd];
}
const UploadAnswers = async () => {
    try {
        const answers = await prisma.book_fair_event_answers.findMany({
            where: {
                upload_s3_at: null
            },
        });
        const uploadData = CreateAnswerCsv(answers);
        const key = `${PATH_ANSWER}/kiosk_answers_${new Date().getTime()}.csv`
        const putObjectCommand = {
            Bucket: BUCKET_ANSWER, 
            Key: key,
            Body: uploadData,
            ContentType: 'text/csv',
        };
        const upload_result = await s3_ANSWER.upload(putObjectCommand, function (err, data) {
            if (err) {
                console.log('Upload error', err);
                return err
            }
            if (data) {
                console.log('Upload successfully', data);
                return data;
            }
        }).promise();
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
            message: "Success",
            upload: key,
            upload_result: upload_result,
        };
    } catch (err) {
        console.log("Error Submit answer:", err);
        return {
          isSuccess: false,
          status_code: 400,
          message: err,
        };
    }
};
const CreateAnswerCsv = (answers) => {
    try {
        let data = [];
        for(var element of answers){
            const ans = JSON.parse(element.answers)
            if (ans && ans.length == 4) {
                data = [
                    ...data,
                    {
                        Jamsai_ID: element.jamsai_id ? element.jamsai_id.toString() : '-', 
                        Q1: ans[0], 
                        Q2: ans[1], 
                        Q3: ans[2], 
                        Q4: ans[3], 
                        Timestamp: ConvertDatetimeFormat(element.created_at)
                    }
                ]
            }
        }
        return csvjson.toCSV(data, { headers: 'key' });
    } catch (err) {
        console.log("Error Submit answer:", err);
        return null;
    }
};
const CreateHeartCsv = (element) => {
    try {
        const data = [{
            JAMSAI_ID: element.jamsai_id ? element.jamsai_id.toString() : '-', 
            EVENT_TYPE: EVENT_TYPE, 
            SOURCE: SOURCE, 
            SOURCE_REF_ID: REF_ID_PREFIX + element.created_at.getTime().toString(),
            CREATED_AT: ConvertDatetimeFormat(element.created_at)
        }];
        return csvjson.toCSV(data, { headers: 'key' });
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
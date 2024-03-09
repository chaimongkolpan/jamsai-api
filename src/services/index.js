const axios = require('axios');
require("dotenv").config();
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
    // check update heart
    // if true update heart
    // save answer
    // random reward
    return {
        isSuccess: true,
        status_code: 200,
        message: "Success",
        data: {
            image: '',
            qr: '',
            is_earn_heart: false
        }
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

module.exports = {
    Login,
    GetQuestion,
    SubmitAnswer
};
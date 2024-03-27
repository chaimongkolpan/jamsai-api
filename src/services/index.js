const SubmitAnswer = async (req) => {
    try {
      const { jamsai_id, answers } = req.body;
      const id = jamsai_id && (typeof jamsai_id == 'string') ? BigInt(jamsai_id) : jamsai_id
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
        message: "An error occurred while submit answer",
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
                          id: element.jamsai_id ? element.jamsai_id.toString() : '-', 
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
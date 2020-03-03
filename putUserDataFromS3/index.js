// "use strict";

// const AWS = require("aws-sdk");
// const s3 = new AWS.S3();

// exports.handler = async event => {
//   const { name } = event.Records[0].s3.bucket;
//   const { key } = event.Records[0].s3.object;

//   const params = {
//     Bucket: name,
//     Key: key
//   };

//   try {
//     const data = await s3.getObject(params).promise();
//     const usersStr = data.Body.toString();
//     const usersJSON = JSON.parse(usersStr);
//     console.log(`USERSTR::: ${usersStr}`);
//     console.log(`USERJSON:: ${usersJSON}`);
//   } catch (err) {
//     console.log(err);
//   }
// };

// from above testing with single data set
// "use strict";

// const AWS = require("aws-sdk");
// const s3 = new AWS.S3();
// const documentClient = new AWS.DynamoDB.DocumentClient();

// exports.handler = async event => {
//   const { name } = event.Records[0].s3.bucket;
//   const { key } = event.Records[0].s3.object;

//   const getObjectParams = {
//     Bucket: name,
//     Key: key
//   };

//   try {
//     const s3data = await s3.getObject(getObjectParams).promise();
//     const usersStr = s3data.Body.toString();
//     const usersJSON = JSON.parse(usersStr);
//     console.log(`USERSTR::: ${usersStr}`);
//     console.log(`USERJSON:: ${usersJSON}`);

//     const { id, firstname, lastname } = usersJSON[0];
//     const putParams = {
//       TableName: "Users-2",
//       Item: {
//         id: id,
//         firstname: firstname,
//         lastname: lastname
//       }
//     }

//     const putItemData = await documentClient.put(putParams).promise();
//     console.log('PUT ITEM DATA >>>', putItemData)
//   } catch (err) {
//     console.log(err);
//   }
// };

// from above testing with multiple data set
"use strict";

const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  let statusCode = 0;
  let responseBody = "";
  const { name } = event.Records[0].s3.bucket;
  const { key } = event.Records[0].s3.object;

  const getObjectParams = {
    Bucket: name,
    Key: key
  };

  try {
    const s3data = await s3.getObject(getObjectParams).promise();
    const usersStr = s3data.Body.toString();
    const usersJSON = JSON.parse(usersStr);
    console.log(`USERSTR::: ${usersStr}`);

    await Promise.all(
      usersJSON.map(async user => {
        const { id, firstname, lastname } = user;
        const putParams = {
          TableName: "Users-2",
          Item: {
            id: id,
            firstname: firstname,
            lastname: lastname
          }
        };
        await documentClient.put(putParams).promise();
      })
    );

    // const putItemData = await documentClient.put(putParams).promise();
    // console.log("PUT ITEM DATA >>>", putItemData);
    responseBody = `Succeeded in  adding users`;
    statusCode = 201;
  } catch (err) {
    responseBody = `Error adding users ${err}`;
    statusCode = 403;
  }

  const response = {
    statusCode: statusCode,
    body: responseBody
  };
  return response;
};

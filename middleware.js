const moment = require('moment');
const redis = require('redis');

const redisClient = redis.createClient();
const maxRequest = 1000;

const dcardMiddleware = (req, res, next) => {
  redisClient.get(req.ip, (err, results) => {
    if(err) throw err;

    // 沒有request紀錄
    if(results === null) {
      let requestArray = [];
      let requestLog = {
        requestTimeStamp: moment().unix(),
        requestCount: 1
      };
      requestArray.push(requestLog);
      redisClient.set(req.ip, JSON.stringify(requestArray));
      next();
    }
    // 有request紀錄
    else {
      let record = JSON.parse(results);
      let startTimeStamp = moment().subtract(1, 'hour').unix();

      let requestInOneHour = record.filter(item => {
        return item.requestTimeStamp > startTimeStamp;
      });

      let requestCountInOneHour = requestInOneHour.reduce((acc, item) => {
        return acc + item.requestCount;
      }, 0);
      console.log("requestCountInOneHour", requestCountInOneHour);

      let remainRequest = maxRequest - requestCountInOneHour;
      let remainTime = (requestInOneHour.length === 0) ? 60 * 60 : requestInOneHour[0].requestTimeStamp + (60 * 60) - moment().unix();
      console.log('remainRequest', remainRequest);
      console.log('remainTime', remainTime);

      // 一小時內超過1000次request
      if(remainRequest === 0) {
        res.status(429).send('Too many requests!');
      }
      else {
        let requestLog = {
          requestTimeStamp: moment().unix(),
          requestCount: 1
        };
        requestInOneHour.push(requestLog);
        
        redisClient.set(req.ip, JSON.stringify(requestInOneHour));

        res.setHeader('X-RateLimit-Remaining', remainRequest);
        res.setHeader('X-RateLimit-Reset', remainTime);
        next();
      }
    }
  })
}

module.exports = dcardMiddleware;
# Dcard Middleware

### Demand
* 限制每小時來自同一個 IP 的請求數量不得超過 1000
* 在 response headers 中加入剩餘的請求數量 (X-RateLimit-Remaining) 以及 rate limit 歸零的時間 (X-RateLimit-Reset)
* 如果超過限制的話就回傳 429 (Too Many Requests)
* 可以使用各種資料庫達成

### Language
Nodejs, Express

### Database
Redis

### Install package
```
npm install
```

### Start project (Running on 3000 port)
```
npm start
```

# Titan_back_end
此專案為打卡機的後端伺服器

### 環境需求

* Node.js 14.16.0 以上
* MySQL 8.0.28  
  <br />
### 本地安裝方式

#### node.js
至[官網下載](https://nodejs.org/en/)

#### MySQL 
至[官網下載](https://dev.mysql.com/)
  <br />

## 安裝步驟
1. 下載專案  <br />
```git clone https://github.com/eruc1117/Titan_back_end.git```

2. 移動至專案資料夾  <br />
```cd Titan_back_end```

3. 套件下載  <br />
```npm install```

4. 補上環境變數 .env <br />

* JWT_SECRET=自行設定  <br />
* user=root (MySql使用 需要跟資料庫設定相同)
* host=127.0.0.1 (MySql使用 需要跟資料庫設定相同)
* database= (MySql使用 需要跟資料庫設定相同)
* password= (MySql使用 需要跟資料庫設定相同)
* port=3306 (MySql使用 需要跟資料庫設定相同)

* PORT=3000 (伺服器使用)

* secret=自訂

* googleEmail=自訂(需進行 Google 低安全性應用程式存取權設定的信箱)
* googleSecret=自訂(信箱所設定的密碼)

5. 執行MySQL，並新增一個 local MYSQL Connections，並填入以下訊息：
* user=root
* host=127.0.0.1
* database=Titan
* password=自訂
* port=3306

6. 回到專案，在專案Terminal上建立表 <br />
```npm run sqlTable```
7. 在專案Terminal上建立種子資料 <br />
```npm run seedData```

8. 在使用的 Database 建立 procedure

```
DELIMITER //
CREATE PROCEDURE insertCheckTime(IN id INT, IN startTime datetime, IN endTime datetime)
BEGIN
  DECLARE idExist INT DEFAULT 0;
  SET idExist = (SELECT COUNT(id) FROM checkTime WHERE userId = id AND start > UNIX_TIMESTAMP(startTime) AND start < UNIX_TIMESTAMP(endTime));
  IF (idExist > 0)
  THEN
  BEGIN 
	UPDATE checkTime SET end = UNIX_TIMESTAMP(NOW()) WHERE userId = id AND start > UNIX_TIMESTAMP(startTime) AND start < UNIX_TIMESTAMP(endTime);
  END;
  ELSE
  BEGIN
	INSERT INTO checkTime (userId, start) VALUES (id, UNIX_TIMESTAMP(NOW()));
  END;
  END IF;
  SELECT userId, CONVERT_TZ(FROM_UNIXTIME(start), 'SYSTEM', '+8:00') AS start, CONVERT_TZ(FROM_UNIXTIME(end), 'SYSTEM', '+8:00') AS end FROM checkTime WHERE userId = id AND start > UNIX_TIMESTAMP(startTime) AND start < UNIX_TIMESTAMP(endTime);
END//
DELIMITER ;
```

9. 伺服器運行  <br />
```npm run start```

這個專案是前後端分離之專案。 <br />
前端 [Github 連結](https://github.com/eruc1117/Titan_front_end) 

### 測試用帳號

#### 前台帳號
帳號: user0
密碼: titaner

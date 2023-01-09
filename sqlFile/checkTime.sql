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
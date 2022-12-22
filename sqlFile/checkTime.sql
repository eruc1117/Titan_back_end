DELIMITER //
CREATE PROCEDURE insertCheckTime(IN id INT, IN startTime datetime, IN endTime datetime)
BEGIN
  DECLARE idExist INT DEFAULT 0;
  SET idExist = (SELECT COUNT(id) FROM Titan.checkTime WHERE userId = id AND start > startTime AND start < endTime);
  IF (idExist > 0)
  THEN
  BEGIN 
	UPDATE Titan.checkTime SET end = NOW() WHERE userId = id AND start > startTime AND start < endTime;
  END;
  ELSE
  BEGIN
	INSERT INTO Titan.checkTime (userId, start) VALUES (id, NOW());
  END;
  END IF;
  SELECT * FROM Titan.checkTime WHERE userId = id AND start > startTime AND start < endTime;
END//
DELIMITER ;
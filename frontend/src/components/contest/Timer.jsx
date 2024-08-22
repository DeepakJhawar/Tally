import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const CountdownTimer = ({ startTime, endTime }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      let timeDifference = 0;
      if (now < start) {
        timeDifference = start - now;
      } else if (now >= start && now <= end) {
        timeDifference = end - now;
      } else {
        timeDifference = 0;
      }

      setTimeLeft(formatTime(timeDifference));
      checkCritical(timeDifference);
    };

    calculateTimeLeft();
    const intervalId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, [startTime, endTime]);

  const formatTime = (timeDifference) => {
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const checkCritical = (timeDifference) => {
    const criticalTime = 10 * 60 * 1000; // 10 minutes in milliseconds
    if (timeDifference <= criticalTime) {
      setIsCritical(true);
    } else {
      setIsCritical(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: 1,
        borderRadius: 1,
        border: '1px solid #ddd',
        backgroundColor: 'secondary',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        Time Left:
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          color: isCritical ? 'red' : 'white', // Red if critical, else white
          marginLeft: 2,
        }}
      >
        {timeLeft}
      </Typography>
    </Box>
  );
};

export default CountdownTimer;

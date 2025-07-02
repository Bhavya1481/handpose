

export const drawHand = (predictions, ctx) => {
    if (!predictions || !ctx) return;
  
    if (predictions.length > 0) {
      console.log("Drawing hands...");
      
      predictions.forEach((prediction) => {
        const landmarks = prediction.landmarks;
  
        // Draw landmarks (21 points)
        for (let i = 0; i < landmarks.length; i++) {
          const [x, y] = landmarks[i];
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        }
  
        // Draw connections
        const fingerJoints = [
          [0, 1, 2, 3, 4],       // Thumb
          [0, 5, 6, 7, 8],       // Index
          [0, 9, 10, 11, 12],    // Middle
          [0, 13, 14, 15, 16],   // Ring
          [0, 17, 18, 19, 20]    // Pinky
        ];
  
        fingerJoints.forEach((finger) => {
          for (let i = 0; i < finger.length - 1; i++) {
            const startIdx = finger[i];
            const endIdx = finger[i + 1];
  
            ctx.beginPath();
            ctx.moveTo(
              landmarks[startIdx][0],
              landmarks[startIdx][1]
            );
            ctx.lineTo(
              landmarks[endIdx][0],
              landmarks[endIdx][1]
            );
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });
      });
    } else {
      console.log("No hands detected");
    }
  };
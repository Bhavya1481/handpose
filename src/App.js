import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import { drawHand } from './utilities';
import './App.css';

const App = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [model, setModel] = useState(null);

  // Load handpose model
  useEffect(() => {
    let animationFrameId;
    
    const loadHandPose = async () => {
      try {
        await tf.ready();
        const loadedModel = await handpose.load();
        setModel(loadedModel);
        setLoading(false);
        return loadedModel;
      } catch (err) {
        setError("Failed to load hand detection model");
        console.error(err);
      }
    };

    loadHandPose().then(loadedModel => {
      if (loadedModel) {
        const detect = async () => {
          if (webcamRef.current?.video?.readyState === 4) {
            try {
              const video = webcamRef.current.video;
              const videoWidth = video.videoWidth;
              const videoHeight = video.videoHeight;

              // Set canvas dimensions
              canvasRef.current.width = videoWidth;
              canvasRef.current.height = videoHeight;

              // Detect hands
              const predictions = await loadedModel.estimateHands(video);
              
              // Draw results
              const ctx = canvasRef.current.getContext('2d');
              drawHand(predictions, ctx);
            } catch (err) {
              console.error('Error during hand detection:', err);
            }
          }
          animationFrameId = requestAnimationFrame(detect);
        };
        detect();
      }
    });

    // Cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (model) {
        model.dispose();
      }
    };
  }, []);

  const handleWebcamError = (err) => {
    setError("Failed to access webcam. Please ensure you have granted camera permissions.");
    console.error(err);
  };

  return (
    <div className="container">
      {error ? (
        <div className="error">{error}</div>
      ) : loading ? (
        <div className="loading">Loading hand detection model...</div>
      ) : (
        <div className="camera-wrapper">
          <Webcam
            ref={webcamRef}
            className="webcam"
            audio={false}
            onUserMediaError={handleWebcamError}
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: "user"
            }}
          />
          <canvas
            ref={canvasRef}
            className="canvas"
          />
        </div>
      )}
    </div>
  );
};

export default App;
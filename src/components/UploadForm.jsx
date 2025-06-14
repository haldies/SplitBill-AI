import React, { useState, useRef } from "react";

export default function UploadForm({ onExtracted }) {
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    stopCamera();
    
    canvas.toBlob(blob => {
      processImage(blob);
    }, 'image/jpeg', 0.9);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processImage(file);
  };

  const processImage = async (file) => {
    setLoading(true);
    setTimeout(() => {
      const dummyData = {
        items: [
          { item: "MIE GACOAN LV 2", qty: 1, price: 20000 },
          { item: "MIE GACOAN LV 1", qty: 1, price: 18182 },
          { item: "UDANG KEJU", qty: 1, price: 18182 },
          { item: "LUMPIA UDANG", qty: 1, price: 18182 },
          { item: "SIOMAY AYAM", qty: 1, price: 18182 },
          { item: "CHOCOAN ICE - NP", qty: 1, price: 18182 },
          { item: "ES PETAK UMPET", qty: 1, price: 10000 },
          { item: "AIR MINERAL BOTOL", qty: 1, price: 4546 },
          { item: "ES TEKLEK", qty: 1, price: 6364 }
        ]
      };
      setLoading(false);
      onExtracted(dummyData.items);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E0EDF1] shadow-sm">
      {!showCamera ? (
        <div className="space-y-4">     
          <div className="flex flex-col space-y-3">
            <button 
              onClick={startCamera}
              className="flex items-center justify-center gap-2 bg-[#8DBCC7] hover:bg-[#7CA9B4] text-white py-3 px-4 rounded-lg transition-colors font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <circle cx="12" cy="13" r="4"></circle>
                <line x1="12" y1="13" x2="12" y2="13.01"></line>
              </svg>
              Take Photo
            </button>
            
            <div className="flex items-center">
              <div className="flex-grow border-t border-[#E0EDF1]"></div>
              <span className="px-3 text-[#5D8B9C] text-sm">or</span>
              <div className="flex-grow border-t border-[#E0EDF1]"></div>
            </div>
            
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#8DBCC7] text-[#3A6B7A] py-3 px-4 rounded-lg hover:bg-[#F5F9FA] transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Choose from Gallery
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          <div className="flex justify-center gap-3">
            <button 
              onClick={stopCamera}
              className="flex-1 py-2 px-4 border border-[#8DBCC7] text-[#3A6B7A] rounded-lg hover:bg-[#F5F9FA] transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={capturePhoto}
              className="flex-1 py-2 px-4 bg-[#8DBCC7] hover:bg-[#7CA9B4] text-white rounded-lg transition-colors"
            >
              Capture
            </button>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="mt-4 flex flex-col items-center text-[#5D8B9C]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8DBCC7] mb-2"></div>
          <p>Processing receipt image...</p>
        </div>
      )}
    </div>
  );
}
import React, { useState, useRef } from "react";
import { extractTextFromImage } from "../utils/ocr";
import axios from "axios";
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
                video: { facingMode: "environment" },
                audio: false,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Tidak dapat mengakses kamera.");
            setShowCamera(false);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
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

        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        stopCamera();

        canvas.toBlob((blob) => {
            if (blob) processImage(blob);
        }, "image/jpeg", 0.9);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        processImage(file);
    };

    const processImage = async (file) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await axios.post("https://be-splitbill-50598077190.asia-southeast2.run.app/vision-analyze", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Response from server:", response);

            const parsedItems = response.data.result;
            onExtracted(parsedItems);
            console.log("Parsed items:", parsedItems);
        } catch (err) {
            console.error("Gagal memproses gambar:", err);
            alert("Gagal membaca atau memproses gambar.");
        } finally {
            setLoading(false);
        }
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
                            📷 Take Photo
                        </button>

                        <div className="flex items-center">
                            <div className="flex-grow border-t border-[#E0EDF1]"></div>
                            <span className="px-3 text-[#5D8B9C] text-sm">or</span>
                            <div className="flex-grow border-t border-[#E0EDF1]"></div>
                        </div>

                        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#8DBCC7] text-[#3A6B7A] py-3 px-4 rounded-lg hover:bg-[#F5F9FA] transition-colors cursor-pointer">
                            📁 Choose from Gallery
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

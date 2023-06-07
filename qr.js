const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const resultContainer = document.getElementById('result');

// Check if the browser supports getUserMedia
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Access the back camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function(error) {
            console.log("Unable to access the camera: " + error);
        });
}

// Listen for video frames and try to decode QR codes
video.addEventListener('play', function() {
    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    function scanQRCode() {
        context.drawImage(video, 0, 0, width, height);
        const imageData = context.getImageData(0, 0, width, height);

        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
            resultContainer.innerText = code.data;
        }

        requestAnimationFrame(scanQRCode);
    }

    scanQRCode();
});
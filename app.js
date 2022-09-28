let imgElement = document.getElementById('imageSrc');
let imgElement1 = document.getElementById('imageSrc1');
let imgElement2 = document.getElementById('imageSrc2');
let imgElement3 = document.getElementById('imageSrc3');
let imgElement4 = document.getElementById('imageSrc4');
let imgElement5 = document.getElementById('imageSrc5');
let inputElement = document.getElementById('fileInput');
let pwImg = document.getElementById('pwImg');
let pwInput = document.getElementById('pwInput');

inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);
imgElement.onload = function () {
    let src = cv.imread(imgElement);
    let dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.imshow('canvasOutput1', dst);
    src.delete();
    dst.delete();
};


// codenya ============================================
pwInput.addEventListener('change', (e) => {
    pwImg.src = URL.createObjectURL(e.target.files[0]);
}, false);
pwImg.onload = function () {
    let src = cv.imread(pwImg);
    let dst = new cv.Mat();
    let ksize = new cv.Size(5, 5);
    cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
    cv.imshow('pwOutput', dst);
    src.delete(); dst.delete();
    cobaCanny();
};

function cobaCanny() {
    let src = cv.imread('pwOutput');
    let dst = new cv.Mat();
    cv.Canny(src, dst, 30, 30 * 2.5, 3, false);
    cv.imshow('pwOutput1', dst);
    src.delete(); dst.delete();
    // cobaFill();
    cobaDilate();

};
function cobaFill() {
    let src = cv.imread('pwOutput4');
    let size = src.size();
    let pt = new cv.Point(size.width / 2, size.height / 2);
    let range = [64, 64, 64, 0];

    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    let mask = new cv.Mat.zeros(size.height + 2, size.width + 2, cv.CV_8U);
    cv.floodFill(src, mask, pt, new cv.Scalar(), new cv.Rect(), range, range, (cv.FLOODFILL_MASK_ONLY));
    cv.threshold(mask, mask, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

    cv.imshow('pwOutput2', mask);
    src.delete(); mask.delete();
    // cobaDilate();

    // let mRgbMat = cv.imread('pwOutput1');
    // cv.cvtColor(mRgbMat, mRgbMat, cv.COLOR_RGBA2RGB);
    // let mask = new cv.Mat(new Size(mRgbMat.cols() / 8.0, mRgbMat.rows() / 8.0), CvType.CV_8UC1, new Scalar(0.0));
    // let img = new cv.Mat();
    // mRgbMat.copyTo(img);
    // let mGreyScaleMat = new cv.Mat();
    // cv.cvtColor(mRgbMat, mGreyScaleMat, Imgproc.COLOR_RGB2GRAY, 3);
    // cv.medianBlur(mGreyScaleMat, mGreyScaleMat, 3);
    // let cannyGreyMat = new cv.Mat();
    // cv.Canny(mGreyScaleMat, cannyGreyMat, 30, 30 * 2.5, 3);
    // let hsvImage = new cv.Mat();
    // cv.cvtColor(img, hsvImage, Imgproc.COLOR_RGB2HSV);
    // cv.imshow('pwOutput2', hsvImage);
};

function cobaDilate() {
    let src = cv.imread('pwOutput1');
    let dst = new cv.Mat();
    let M = cv.Mat.ones(5, 5, cv.CV_8U);
    let anchor = new cv.Point(-1, -1);
    cv.dilate(src, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
    cv.imshow('pwOutput3', dst);
    src.delete(); dst.delete(); M.delete();
    cobaErode();
};
function cobaErode() {
    let src = cv.imread('pwOutput3');
    let dst = new cv.Mat();
    let M = cv.Mat.ones(5, 5, cv.CV_8U);
    let anchor = new cv.Point(-1, -1);
    cv.erode(src, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
    cv.imshow('pwOutput4', dst);
    src.delete(); dst.delete(); M.delete();
    cobaFill();
};


// Cobacoba ==========================================
var elm = document.getElementById('pwOutput2');
elm.addEventListener('click', getPosition, false);
function getPosition(e) {
    var bnds = e.target.getBoundingClientRect();
    var x = e.clientX - bnds.left;
    var y = e.clientY - bnds.top;
    var pelem = document.getElementById('poss');
    let src = cv.imread('pwOutput2');
    let dst = new cv.Mat();
    let z = parseInt(x) + parseInt(y);
    cv.Canny(src, dst, 30, 30 * 2.5, 3, false);
    cv.imshow('pwOutput2', dst);
    src.delete(); dst.delete();

    pelem.innerHTML = "pos x: " + x + "; pos y:" + y;
}

function fill() {
    var index
}

function callback() {
    let trackbar = document.getElementById('trackbar');
    let alpha = trackbar.value / trackbar.max;
    let beta = (1.0 - alpha);
    let src1 = cv.imread('imageSrc1');
    let src2 = cv.imread('imageSrc2');
    let dst = new cv.Mat();
    cv.addWeighted(src1, alpha, src2, beta, 0.0, dst, -1);
    cv.imshow('canvasOutput2', dst);
    dst.delete();
    src1.delete();
    src2.delete();
};

function threshold() {
    let trackbar2 = document.getElementById('trackbar2').value;
    let trackbar3 = document.getElementById('trackbar3').value;
    let th1 = parseInt(trackbar2);
    let th2 = parseInt(trackbar3);
    let src = cv.imread(imgElement3);
    // let src = cv.imread('dilateOutput');
    // let src = cv.imread('erodeOutput');

    let dst = new cv.Mat();
    // cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
    cv.Canny(src, dst, th1, th2, 3, false);
    cv.imshow('canvasOutput3', dst);
    src.delete(); dst.delete();
};
function watershed() {
    let src = cv.imread(imgElement4);
    let dst = new cv.Mat();
    let gray = new cv.Mat();

    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(gray, gray, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

    cv.imshow('canvasOutput4', gray);
    src.delete(); dst.delete(); gray.delete();

};
function cobaPy() {
    let src = cv.imread(imgElement5);
    let dst = new cv.Mat();
    let gray = new cv.Mat();

    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(gray, gray, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

    cv.imshow('canvasOutput5', gray);
    src.delete(); dst.delete(); gray.delete();

};
function dilate() {
    let src = cv.imread('imageDilate');
    // let src = cv.imread('canvasOutput3');
    let dst = new cv.Mat();
    let M = cv.Mat.ones(5, 5, cv.CV_8U);
    let anchor = new cv.Point(-1, -1);
    cv.dilate(src, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
    cv.imshow('dilateOutput', dst);
    src.delete(); dst.delete(); M.delete();
};

function erode() {
    let src = cv.imread('imageErode');
    // let src = cv.imread('dilateOutput');
    let dst = new cv.Mat();
    let M = cv.Mat.ones(5, 5, cv.CV_8U);
    let anchor = new cv.Point(-1, -1);
    cv.erode(src, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
    cv.imshow('erodeOutput', dst);
    src.delete(); dst.delete(); M.delete();

};



var Module = {
    // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
    onRuntimeInitialized() {
        document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    }
};
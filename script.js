const canvas = document.querySelector("canvas");

var signaturePad = require('signature_pad');

var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
  backgroundColor: 'rgba(255, 255, 255, 0)',
  penColor: 'rgb(0, 0, 0)'
});

// const signaturePad = new SignaturePad(canvas);
// signaturePad.addEventListener("beginStroke", () => {
//   console.log("Signature started");
// }, { once: true });

var saveButton = document.getElementById('save');
var cancelButton = document.getElementById('clear');

saveButton.addEventListener('click', function (event) {
  var data = signaturePad.toDataURL('image/png');

// Send data to server instead...
  window.open(data);
});

cancelButton.addEventListener('click', function (event) {
  signaturePad.clear();
});
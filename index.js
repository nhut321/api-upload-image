const cloudinaryPreset = 'photo-gallery'; 
const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dn0ohbo3r/image/upload'; 
const uploadFolder = 'gallery';

const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file');
const titleInput = document.getElementById('title'); // Lấy ô nhập tiêu đề
const previewImg = document.getElementById('preview-img');
const responseContainer = document.getElementById('response');
const uploadedLink = document.getElementById('uploaded-link');
const uploadedTitle = document.getElementById('uploaded-title'); // Hiển thị tiêu đề ảnh đã tải lên
const uploadedDescription = document.getElementById('descriptionInput')

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const file = fileInput.files[0];
  const title = titleInput.value.trim(); // Lấy tiêu đề ảnh
  const description = descriptionInput.value.trim(); // Lấy mô tả ảnh

  if (file && title && description) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryPreset);
    formData.append('folder', uploadFolder);
    
    // Thêm tiêu đề và mô tả vào metadata của Cloudinary
    formData.append('context', `title=${title}|description=${description}`);

    // Hiển thị preview hình ảnh
    const reader = new FileReader();
    reader.onload = function () {
      previewImg.style.display = 'block';
      previewImg.src = reader.result;
    };
    reader.readAsDataURL(file);

    // Gửi ảnh lên Cloudinary
    fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Upload failed:', data.error.message);
          alert('Upload failed!');
          return;
        }
        
        // Hiển thị kết quả
        responseContainer.classList.remove('hidden');
        uploadedTitle.textContent = `Title: ${title}`;
        uploadedDescription.textContent = `Description: ${description}`;
        uploadedLink.href = data.secure_url;
        uploadedLink.textContent = 'Click here to view uploaded image';
      })
      .catch(error => {
        console.error('Error uploading image:', error);
        alert('Upload failed!');
      });
  } else {
    alert("Please select a file, enter a title, and provide a description!");
  }
});


const imgbbApiKey = 'a775ba9c69819ca2aeadc9d22b24318d'; // Nhớ thay API Key của bạn
// const nodeApiUrl = 'http://localhost:5000/upload'; // API Node.js để lưu vào MongoDB
const nodeApiUrl = 'https://server-gallery-react.onrender.com/upload'

const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('descriptionInput');
const previewImg = document.getElementById('preview-img');
const responseContainer = document.getElementById('response');
const uploadedLink = document.getElementById('uploaded-link');
const uploadedTitle = document.getElementById('uploaded-title');
const uploadedDescription = document.getElementById('uploaded-description');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const file = fileInput.files[0];
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!file || !title || !description) {
    alert('Please select a file, enter a title, and provide a description!');
    return;
  }
  

  // Chuyển đổi ảnh thành Base64
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async function () {
    const base64Image = reader.result.split(',')[1]; // Loại bỏ prefix "data:image/png;base64,"

    // Kiểm tra kích thước ảnh trước khi upload
    if (file.size > 2 * 1024 * 1024) { // 2MB = 2 * 1024 * 1024 bytes
      alert("Ảnh bạn quá nặng, đã vượt qua 2MB!");
      return 
    }
    // Gửi ảnh lên ImgBB
    try {
      const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: 'POST',
        body: new URLSearchParams({ image: base64Image }),
      });

      const imgbbData = await imgbbResponse.json();

      if (!imgbbData.success) {
        throw new Error(imgbbData.error.message);
      }

      const imageUrl = imgbbData.data.url;

      // Lưu thông tin ảnh vào MongoDB
      const saveResponse = await fetch(nodeApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name, like: 0, url: imageUrl, title, description }),
      });

      const savedData = await saveResponse.json();

      if (saveResponse.ok) {
        // Hiển thị kết quả
        previewImg.style.display = 'block';
        previewImg.src = imageUrl;
        responseContainer.classList.remove('hidden');
        uploadedTitle.textContent = `Title: ${title}`;
        uploadedDescription.textContent = `Description: ${description}`;
        uploadedLink.href = imageUrl;
        uploadedLink.textContent = 'Click here to view uploaded image';
      } else {
        throw new Error(savedData.message || 'Failed to save image info.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed!');
    }
  };
});

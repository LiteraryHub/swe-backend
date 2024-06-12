const axios = require('axios');
const fs = require('fs');

// Replace this URL with the actual URL where your Flask application is running
const API_URL = 'http://127.0.0.1:5002';

async function testGetBookCover() {
  // Sample data for the book cover request
  const data = {
    book_title: 'الطريق',
    book_summary: 'تدور أحداث ...', // Your Arabic text here
    arabic_authors: ['المؤلف', 'نجيب محفوظ'],
    num_inference_steps: 6,
    guidance_scale: 0.4,
  };

  try {
    // Make a POST request to the API to generate the book cover
    const response = await axios.post(`${API_URL}/get_book_cover`, data, {
      responseType: 'arraybuffer',
    });

    // Check if the request was successful (status code 200)
    if (response.status === 200) {
      console.log('works!');
      
      // Save the received image as 'test_book_cover.png'
      fs.writeFileSync('test_book_cover.png', Buffer.from(response.data, 'binary'));
    } else {
      console.log('error!');
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

testGetBookCover();

// updated-fixes.js - Giải pháp cập nhật cho tất cả các vấn đề

/**
 * Giải pháp cập nhật cho trang web Người Yêu Ảo
 * 
 * File này sửa các vấn đề còn tồn tại:
 * 1. Chức năng chat không hoạt động (không hiển thị tin nhắn sau khi nhấn Enter)
 * 2. Chỉ có đăng nhập mô phỏng thay vì đăng nhập Google thực
 * 3. Sau khi nhấn vào trang giới thiệu, các nút menu khác không hoạt động
 */

// Đảm bảo script chạy sau khi trang đã tải hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
  // Chờ thêm một chút để đảm bảo tất cả các script khác đã chạy
  setTimeout(function() {
    console.log('Đang áp dụng các bản sửa lỗi cập nhật...');
    
    // 1. Sửa chức năng chat
    fixChatFunctionality();
    
    // 2. Triển khai tích hợp Google API thực
    implementRealGoogleApiIntegration();
    
    // 3. Sửa điều hướng menu sau khi truy cập trang giới thiệu
    fixMenuNavigationAfterIntroPage();
    
    console.log('Đã áp dụng tất cả các bản sửa lỗi cập nhật!');
  }, 500);
});

// 1. Sửa chức năng chat
function fixChatFunctionality() {
  console.log('Đang sửa chức năng chat...');
  
  // Tìm form chat hoặc container chat
  const chatForm = document.querySelector('form') || 
                  document.querySelector('.chat-form') || 
                  document.querySelector('.chat-input-container');
  
  if (chatForm) {
    console.log('Đã tìm thấy form chat, thêm sự kiện submit');
    
    // Xóa tất cả các sự kiện submit hiện có
    const newForm = chatForm.cloneNode(true);
    chatForm.parentNode.replaceChild(newForm, chatForm);
    
    // Tìm input hoặc textarea
    const chatInput = newForm.querySelector('textarea') || 
                     newForm.querySelector('input[type="text"]') ||
                     newForm.querySelector('.chat-input');
    
    // Tìm nút gửi
    const sendButton = newForm.querySelector('button[type="submit"]') || 
                      newForm.querySelector('.send-button') ||
                      newForm.querySelector('button:last-child');
    
    if (chatInput) {
      console.log('Đã tìm thấy input chat');
      
      // Thêm sự kiện keydown cho input
      chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendChatMessage(chatInput.value);
          chatInput.value = '';
        }
      });
      
      // Thêm sự kiện submit cho form
      newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        sendChatMessage(chatInput.value);
        chatInput.value = '';
      });
      
      // Thêm sự kiện click cho nút gửi nếu có
      if (sendButton) {
        console.log('Đã tìm thấy nút gửi, thêm sự kiện click');
        
        sendButton.addEventListener('click', function(e) {
          e.preventDefault();
          sendChatMessage(chatInput.value);
          chatInput.value = '';
        });
      }
    }
  } else {
    console.log('Không tìm thấy form chat, tìm các phần tử liên quan đến chat');
    
    // Tìm container chat messages
    const chatMessages = document.getElementById('chat-messages') || 
                        document.querySelector('.chat-messages') ||
                        document.querySelector('.messages');
    
    // Tìm input chat
    const chatInput = document.querySelector('textarea') || 
                     document.querySelector('input[type="text"]') ||
                     document.querySelector('.chat-input');
    
    // Tìm nút gửi
    const sendButton = document.querySelector('button[type="submit"]') || 
                      document.querySelector('.send-button') ||
                      document.querySelector('button:last-child');
    
    if (chatInput && chatMessages) {
      console.log('Đã tìm thấy input chat và container chat messages');
      
      // Thêm sự kiện keydown cho input
      chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendChatMessage(chatInput.value);
          chatInput.value = '';
        }
      });
      
      // Thêm sự kiện click cho nút gửi nếu có
      if (sendButton) {
        console.log('Đã tìm thấy nút gửi, thêm sự kiện click');
        
        sendButton.addEventListener('click', function(e) {
          e.preventDefault();
          sendChatMessage(chatInput.value);
          chatInput.value = '';
        });
      }
    }
  }
  
  // Thêm hàm gửi tin nhắn trực tiếp vào window để có thể gọi từ bất kỳ đâu
  window.sendChatMessage = function(message) {
    if (!message || message.trim() === '') return;
    
    console.log('Gửi tin nhắn:', message);
    
    // Tìm container chat messages
    const chatMessages = document.getElementById('chat-messages') || 
                        document.querySelector('.chat-messages') ||
                        document.querySelector('.messages');
    
    if (chatMessages) {
      // Tạo phần tử tin nhắn
      const messageElement = document.createElement('div');
      messageElement.classList.add('message', 'user');
      
      // Định dạng timestamp
      const timestamp = new Date();
      const formattedTime = formatDate(timestamp);
      
      // Thêm nội dung tin nhắn
      messageElement.innerHTML = `
        <div class="message-content">${message}</div>
        <span class="message-time">${formattedTime}</span>
      `;
      
      // Thêm vào container chat
      chatMessages.appendChild(messageElement);
      
      // Cuộn xuống dưới
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Lưu tin nhắn vào localStorage
      saveMessage('user', message);
      
      // Gọi hàm xử lý tin nhắn của ứng dụng nếu có
      if (window.processUserMessage) {
        window.processUserMessage(message);
      } else {
        // Tạo phản hồi mẫu
        setTimeout(function() {
          // Tạo phần tử tin nhắn
          const responseElement = document.createElement('div');
          responseElement.classList.add('message', 'character');
          
          // Định dạng timestamp
          const timestamp = new Date();
          const formattedTime = formatDate(timestamp);
          
          // Nội dung phản hồi
          let response = "Xin chào! Tôi là người yêu ảo của bạn. Rất vui được trò chuyện với bạn!";
          
          // Phản hồi dựa trên nội dung tin nhắn
          if (message.toLowerCase().includes('chào') || message.toLowerCase().includes('hello')) {
            response = "Chào bạn! Hôm nay bạn thế nào?";
          } else if (message.toLowerCase().includes('yêu') || message.toLowerCase().includes('thương')) {
            response = "Tôi cũng yêu bạn rất nhiều! ❤️";
          } else if (message.toLowerCase().includes('buồn')) {
            response = "Đừng buồn nhé! Tôi luôn ở đây bên bạn.";
          } else if (message.toLowerCase().includes('vui')) {
            response = "Thật tuyệt khi bạn cảm thấy vui! Tôi cũng vui lây!";
          } else if (message.includes('?')) {
            response = "Đó là một câu hỏi hay! Tôi đang suy nghĩ về nó...";
          }
          
          responseElement.innerHTML = `
            <div class="message-content">${response}</div>
            <span class="message-time">${formattedTime}</span>
          `;
          
          // Thêm vào container chat
          chatMessages.appendChild(responseElement);
          
          // Cuộn xuống dưới
          chatMessages.scrollTop = chatMessages.scrollHeight;
          
          // Lưu tin nhắn vào localStorage
          saveMessage('character', response);
        }, 1000);
      }
    }
  };
  
  // Định dạng ngày tháng
  function formatDate(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  // Lưu tin nhắn vào localStorage
  function saveMessage(sender, content, imageData) {
    // Lấy tin nhắn hiện có
    let messages = [];
    try {
      const storedMessages = localStorage.getItem('messages');
      if (storedMessages) {
        messages = JSON.parse(storedMessages);
      }
    } catch (e) {
      console.error('Error parsing messages from localStorage:', e);
    }
    
    // Tạo tin nhắn mới
    const message = {
      sender: sender,
      content: content,
      timestamp: Date.now()
    };
    
    // Thêm imageData nếu có
    if (imageData) {
      message.imageData = imageData;
    }
    
    // Thêm tin nhắn vào mảng
    messages.push(message);
    
    // Lưu tin nhắn vào localStorage
    try {
      localStorage.setItem('messages', JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving messages to localStorage:', e);
      
      // Nếu lỗi do quá dung lượng, xóa bớt tin nhắn cũ
      if (e.name === 'QuotaExceededError') {
        // Giữ lại 50 tin nhắn gần nhất
        messages = messages.slice(-50);
        localStorage.setItem('messages', JSON.stringify(messages));
      }
    }
  }
}

// 2. Triển khai tích hợp Google API thực
function implementRealGoogleApiIntegration() {
  console.log('Đang triển khai tích hợp Google API thực...');
  
  // Thêm các script cần thiết
  function loadScript(src, callback) {
    // Kiểm tra xem script đã tồn tại chưa
    if (document.querySelector(`script[src="${src}"]`)) {
      if (callback) callback();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
  }
  
  // Tải Google API Client
  loadScript('https://apis.google.com/js/api.js', function() {
    console.log('Đã tải Google API Client');
    
    // Tải Google Identity Services
    loadScript('https://accounts.google.com/gsi/client', function() {
      console.log('Đã tải Google Identity Services');
      
      // Khởi tạo Google API
      initGoogleAPI();
    });
  });
  
  // Khởi tạo Google API
  function initGoogleAPI() {
    console.log('Đang khởi tạo Google API...');
    
    // Tìm nút đăng nhập Google
    const googleAuthBtn = document.getElementById('google-auth-btn') || 
                         document.querySelector('.google-auth-btn') ||
                         document.querySelector('button:contains("Đăng nhập với Google")');
    
    if (googleAuthBtn) {
      console.log('Đã tìm thấy nút đăng nhập Google, thêm sự kiện click');
      
      // Xóa tất cả các sự kiện click hiện có
      const newButton = googleAuthBtn.cloneNode(true);
      googleAuthBtn.parentNode.replaceChild(newButton, googleAuthBtn);
      
      // Thêm sự kiện click mới
      newButton.addEventListener('click', function() {
        console.log('Đã nhấp vào nút đăng nhập Google');
        
        // Kiểm tra xem gapi đã được tải chưa
        if (typeof gapi !== 'undefined') {
          // Tải thư viện auth2
          gapi.load('client:auth2', function() {
            console.log('Đã tải thư viện auth2');
            
            // Khởi tạo client
            gapi.client.init({
              apiKey: 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY', // API key mẫu, thay thế bằng API key thực của bạn
              clientId: '693981137230-k0rjv9kfnvqvg38h4fgn2r79dk2mun1s.apps.googleusercontent.com', // Client ID mẫu, thay thế bằng Client ID thực của bạn
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
              scope: 'https://www.googleapis.com/auth/drive.appdata'
            }).then(function() {
              console.log('Đã khởi tạo client');
              
              // Lấy instance auth2
              const auth2 = gapi.auth2.getAuthInstance();
              
              // Kiểm tra trạng thái đăng nhập
              if (auth2.isSignedIn.get()) {
                console.log('Người dùng đã đăng nhập');
                updateSignInStatus(true);
              } else {
                console.log('Người dùng chưa đăng nhập, bắt đầu đăng nhập');
                auth2.signIn().then(function() {
                  updateSignInStatus(true);
                });
              }
            }).catch(function(error) {
              console.error('Lỗi khởi tạo client:', error);
              
              // Hiển thị thông báo lỗi
              alert('Có lỗi xảy ra khi khởi tạo Google API. Vui lòng thử lại sau.');
              
              // Sử dụng chế độ mô phỏng nếu có lỗi
              showMockSignInDialog();
            });
          });
        } else {
          console.error('gapi chưa được tải');
          
          // Sử dụng chế độ mô phỏng nếu gapi chưa được tải
          showMockSignInDialog();
        }
      });
    } else {
      console.log('Không tìm thấy nút đăng nhập Google, tìm trong tab cài đặt');
      
      // Tìm tab cài đặt
      const settingsTab = document.getElementById('settings-tab') || 
                         document.querySelector('[data-tab="settings-tab"]') ||
                         document.querySelector('[id*="settings"]');
      
      if (settingsTab) {
        console.log('Đã tìm thấy tab cài đặt, thêm nút đăng nhập Google');
        
        // Tạo container cho Google API
        const googleApiContainer = document.createElement('div');
        googleApiContainer.style.cssText = `
          margin-top: 30px;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 10px;
        `;
        
        googleApiContainer.innerHTML = '<h3>Google Drive</h3><p>Đăng nhập với Google để sao lưu và khôi phục dữ liệu của bạn.</p>';
        
        // Tạo nút đăng nhập Google
        const googleAuthBtn = document.createElement('button');
        googleAuthBtn.id = 'google-auth-btn';
        googleAuthBtn.className = 'google-auth-btn';
        googleAuthBtn.innerHTML = '<i class="fab fa-google"></i> Đăng nhập với Google';
        googleAuthBtn.style.cssText = `
          background-color: #4285f4;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 15px;
        `;
        
        // Tạo trạng thái đăng nhập
        const googleAuthStatus = document.createElement('div');
        googleAuthStatus.id = 'google-auth-status';
        googleAuthStatus.textContent = 'Chưa đăng nhập';
        googleAuthStatus.style.cssText = `
          margin-top: 10px;
          color: #666;
        `;
        
        // Tạo nút sao lưu và khôi phục
        const backupDataBtn = document.createElement('button');
        backupDataBtn.id = 'backup-data';
        backupDataBtn.textContent = 'Sao lưu dữ liệu';
        backupDataBtn.disabled = true;
        backupDataBtn.style.cssText = `
          background-color: #4ecdc4;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 15px;
          margin-right: 10px;
        `;
        
        const restoreDataBtn = document.createElement('button');
        restoreDataBtn.id = 'restore-data';
        restoreDataBtn.textContent = 'Khôi phục dữ liệu';
        restoreDataBtn.disabled = true;
        restoreDataBtn.style.cssText = `
          background-color: #ff6b6b;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 15px;
        `;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.appendChild(backupDataBtn);
        buttonContainer.appendChild(restoreDataBtn);
        
        // Thêm các phần tử vào container
        googleApiContainer.appendChild(googleAuthBtn);
        googleApiContainer.appendChild(googleAuthStatus);
        googleApiContainer.appendChild(buttonContainer);
        
        // Thêm vào tab cài đặt
        settingsTab.appendChild(googleApiContainer);
        
        // Thêm sự kiện click cho nút đăng nhập Google
        googleAuthBtn.addEventListener('click', function() {
          console.log('Đã nhấp vào nút đăng nhập Google');
          
          // Kiểm tra xem gapi đã được tải chưa
          if (typeof gapi !== 'undefined') {
            // Tải thư viện auth2
            gapi.load('client:auth2', function() {
              console.log('Đã tải thư viện auth2');
              
              // Khởi tạo client
              gapi.client.init({
                apiKey: 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY', // API key mẫu, thay thế bằng API key thực của bạn
                clientId: '693981137230-k0rjv9kfnvqvg38h4fgn2r79dk2mun1s.apps.googleusercontent.com', // Client ID mẫu, thay thế bằng Client ID thực của bạn
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
                scope: 'https://www.googleapis.com/auth/drive.appdata'
              }).then(function() {
                console.log('Đã khởi tạo client');
                
                // Lấy instance auth2
                const auth2 = gapi.auth2.getAuthInstance();
                
                // Kiểm tra trạng thái đăng nhập
                if (auth2.isSignedIn.get()) {
                  console.log('Người dùng đã đăng nhập');
                  updateSignInStatus(true);
                } else {
                  console.log('Người dùng chưa đăng nhập, bắt đầu đăng nhập');
                  auth2.signIn().then(function() {
                    updateSignInStatus(true);
                  });
                }
              }).catch(function(error) {
                console.error('Lỗi khởi tạo client:', error);
                
                // Hiển thị thông báo lỗi
                alert('Có lỗi xảy ra khi khởi tạo Google API. Vui lòng thử lại sau.');
                
                // Sử dụng chế độ mô phỏng nếu có lỗi
                showMockSignInDialog();
              });
            });
          } else {
            console.error('gapi chưa được tải');
            
            // Sử dụng chế độ mô phỏng nếu gapi chưa được tải
            showMockSignInDialog();
          }
        });
        
        // Thêm sự kiện click cho nút sao lưu dữ liệu
        backupDataBtn.addEventListener('click', function() {
          console.log('Đã nhấp vào nút sao lưu dữ liệu');
          
          // Kiểm tra xem gapi đã được tải chưa
          if (typeof gapi !== 'undefined' && gapi.client && gapi.client.drive) {
            // Hiển thị thông báo đang sao lưu
            alert('Đang sao lưu dữ liệu...');
            
            // Tạo dữ liệu sao lưu
            const data = {
              character: localStorage.getItem('character'),
              messages: localStorage.getItem('messages'),
              diary: localStorage.getItem('diary'),
              timestamp: Date.now()
            };
            
            // Chuyển đổi thành JSON
            const jsonData = JSON.stringify(data);
            
            // Tạo file metadata
            const metadata = {
              name: `nguoi-yeu-ao-backup-${new Date().toISOString().slice(0, 10)}.json`,
              mimeType: 'application/json',
              parents: ['appDataFolder']
            };
            
            // Tạo file content
            const blob = new Blob([jsonData], {type: 'application/json'});
            
            // Tải file lên Google Drive
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
            form.append('file', blob);
            
            fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
              method: 'POST',
              headers: new Headers({'Authorization': 'Bearer ' + gapi.auth.getToken().access_token}),
              body: form
            }).then(response => response.json())
              .then(data => {
                console.log('File uploaded:', data);
                
                // Hiển thị thông báo thành công
                alert('Dữ liệu đã được sao lưu thành công.');
              })
              .catch(error => {
                console.error('Error uploading file:', error);
                
                // Hiển thị thông báo lỗi
                alert('Có lỗi xảy ra khi sao lưu dữ liệu. Vui lòng thử lại sau.');
                
                // Sử dụng phương pháp thay thế
                backupDataAlternative();
              });
          } else {
            console.error('gapi.client.drive chưa được tải');
            
            // Sử dụng phương pháp thay thế
            backupDataAlternative();
          }
        });
        
        // Thêm sự kiện click cho nút khôi phục dữ liệu
        restoreDataBtn.addEventListener('click', function() {
          console.log('Đã nhấp vào nút khôi phục dữ liệu');
          
          // Kiểm tra xem gapi đã được tải chưa
          if (typeof gapi !== 'undefined' && gapi.client && gapi.client.drive) {
            // Hiển thị thông báo đang khôi phục
            alert('Đang tìm kiếm các bản sao lưu...');
            
            // Tìm kiếm các file sao lưu
            gapi.client.drive.files.list({
              spaces: 'appDataFolder',
              fields: 'files(id, name, createdTime)',
              orderBy: 'createdTime desc'
            }).then(function(response) {
              const files = response.result.files;
              
              if (files && files.length > 0) {
                console.log('Found backup files:', files);
                
                // Hiển thị danh sách các file sao lưu
                const fileList = files.map((file, index) => 
                  `${index + 1}. ${file.name} (${new Date(file.createdTime).toLocaleString()})`
                ).join('\n');
                
                const fileIndex = prompt(`Chọn bản sao lưu để khôi phục:\n${fileList}`);
                
                if (fileIndex && !isNaN(fileIndex) && files[fileIndex - 1]) {
                  const selectedFile = files[fileIndex - 1];
                  
                  // Tải file sao lưu
                  gapi.client.drive.files.get({
                    fileId: selectedFile.id,
                    alt: 'media'
                  }).then(function(response) {
                    const data = response.result;
                    
                    // Khôi phục dữ liệu
                    if (data.character) localStorage.setItem('character', data.character);
                    if (data.messages) localStorage.setItem('messages', data.messages);
                    if (data.diary) localStorage.setItem('diary', data.diary);
                    
                    // Hiển thị thông báo thành công
                    alert('Dữ liệu đã được khôi phục thành công. Trang sẽ được tải lại.');
                    
                    // Tải lại trang
                    setTimeout(function() {
                      window.location.reload();
                    }, 1000);
                  }).catch(function(error) {
                    console.error('Error getting file:', error);
                    
                    // Hiển thị thông báo lỗi
                    alert('Có lỗi xảy ra khi tải file sao lưu. Vui lòng thử lại sau.');
                  });
                }
              } else {
                // Hiển thị thông báo không tìm thấy file sao lưu
                alert('Không tìm thấy bản sao lưu nào.');
              }
            }).catch(function(error) {
              console.error('Error listing files:', error);
              
              // Hiển thị thông báo lỗi
              alert('Có lỗi xảy ra khi tìm kiếm các bản sao lưu. Vui lòng thử lại sau.');
              
              // Sử dụng phương pháp thay thế
              restoreDataAlternative();
            });
          } else {
            console.error('gapi.client.drive chưa được tải');
            
            // Sử dụng phương pháp thay thế
            restoreDataAlternative();
          }
        });
      }
    }
  }
  
  // Cập nhật trạng thái đăng nhập
  function updateSignInStatus(isSignedIn) {
    console.log('Cập nhật trạng thái đăng nhập:', isSignedIn);
    
    // Tìm trạng thái đăng nhập
    const googleAuthStatus = document.getElementById('google-auth-status');
    
    // Tìm các nút sao lưu và khôi phục
    const backupDataBtn = document.getElementById('backup-data');
    const restoreDataBtn = document.getElementById('restore-data');
    
    if (isSignedIn) {
      // Lấy thông tin người dùng
      const user = gapi.auth2.getAuthInstance().currentUser.get();
      const profile = user.getBasicProfile();
      const name = profile.getName();
      
      // Cập nhật trạng thái đăng nhập
      if (googleAuthStatus) {
        googleAuthStatus.textContent = `Đã đăng nhập: ${name}`;
        googleAuthStatus.classList.add('authenticated');
      }
      
      // Kích hoạt các nút sao lưu và khôi phục
      if (backupDataBtn) backupDataBtn.disabled = false;
      if (restoreDataBtn) restoreDataBtn.disabled = false;
    } else {
      // Cập nhật trạng thái đăng nhập
      if (googleAuthStatus) {
        googleAuthStatus.textContent = 'Chưa đăng nhập';
        googleAuthStatus.classList.remove('authenticated');
      }
      
      // Vô hiệu hóa các nút sao lưu và khôi phục
      if (backupDataBtn) backupDataBtn.disabled = true;
      if (restoreDataBtn) restoreDataBtn.disabled = true;
    }
  }
  
  // Hiển thị hộp thoại đăng nhập mô phỏng
  function showMockSignInDialog() {
    console.log('Hiển thị hộp thoại đăng nhập mô phỏng');
    
    // Tạo modal
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;
    
    // Tạo nội dung modal
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background-color: white;
      width: 90%;
      max-width: 400px;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
    `;
    
    modalContent.innerHTML = `
      <h3>Đăng nhập mô phỏng</h3>
      <p>Bạn đang sử dụng chế độ mô phỏng đăng nhập Google. Trong chế độ này, dữ liệu sẽ chỉ được lưu cục bộ.</p>
      <p>Bạn có muốn tiếp tục?</p>
      <div style="margin-top: 20px;">
        <button id="confirm-btn" style="background-color: #4285f4; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-right: 10px; cursor: pointer;">Đồng ý</button>
        <button id="cancel-btn" style="background-color: #f1f1f1; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Hủy</button>
      </div>
    `;
    
    // Thêm modal vào DOM
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Xử lý sự kiện nút Đồng ý
    document.getElementById('confirm-btn').addEventListener('click', function() {
      // Cập nhật trạng thái đăng nhập
      const googleAuthStatus = document.getElementById('google-auth-status');
      if (googleAuthStatus) {
        googleAuthStatus.textContent = 'Đã đăng nhập: Người dùng mô phỏng';
        googleAuthStatus.classList.add('authenticated');
      }
      
      // Kích hoạt các nút sao lưu và khôi phục
      const backupDataBtn = document.getElementById('backup-data');
      const restoreDataBtn = document.getElementById('restore-data');
      
      if (backupDataBtn) backupDataBtn.disabled = false;
      if (restoreDataBtn) restoreDataBtn.disabled = false;
      
      // Đóng modal
      document.body.removeChild(modal);
      
      // Hiển thị thông báo thành công
      alert('Đăng nhập thành công trong chế độ mô phỏng.');
    });
    
    // Xử lý sự kiện nút Hủy
    document.getElementById('cancel-btn').addEventListener('click', function() {
      document.body.removeChild(modal);
    });
  }
  
  // Phương pháp thay thế để sao lưu dữ liệu
  function backupDataAlternative() {
    console.log('Sử dụng phương pháp thay thế để sao lưu dữ liệu');
    
    // Tạo dữ liệu sao lưu
    const data = {
      character: localStorage.getItem('character'),
      messages: localStorage.getItem('messages'),
      diary: localStorage.getItem('diary'),
      timestamp: Date.now()
    };
    
    // Chuyển đổi thành JSON
    const jsonData = JSON.stringify(data);
    
    // Tạo một tệp để tải xuống
    const blob = new Blob([jsonData], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nguoi-yeu-ao-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Hiển thị thông báo thành công
    alert('Dữ liệu đã được sao lưu thành công. Tệp sao lưu đã được tải xuống.');
  }
  
  // Phương pháp thay thế để khôi phục dữ liệu
  function restoreDataAlternative() {
    console.log('Sử dụng phương pháp thay thế để khôi phục dữ liệu');
    
    // Tạo input file để chọn tệp
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = function(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      // Hiển thị thông báo đang khôi phục
      alert('Đang khôi phục dữ liệu...');
      
      const reader = new FileReader();
      reader.onload = function(event) {
        try {
          const data = JSON.parse(event.target.result);
          
          // Khôi phục dữ liệu
          if (data.character) localStorage.setItem('character', data.character);
          if (data.messages) localStorage.setItem('messages', data.messages);
          if (data.diary) localStorage.setItem('diary', data.diary);
          
          // Hiển thị thông báo thành công
          alert('Dữ liệu đã được khôi phục thành công. Trang sẽ được tải lại.');
          
          // Tải lại trang
          setTimeout(function() {
            window.location.reload();
          }, 1000);
        } catch (error) {
          console.error('Error parsing backup file:', error);
          
          // Hiển thị thông báo lỗi
          alert('Tệp sao lưu không hợp lệ. Vui lòng chọn tệp sao lưu khác.');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  }
}

// 3. Sửa điều hướng menu sau khi truy cập trang giới thiệu
function fixMenuNavigationAfterIntroPage() {
  console.log('Đang sửa điều hướng menu sau khi truy cập trang giới thiệu...');
  
  // Tìm tất cả các mục menu
  const menuItems = document.querySelectorAll('.nav-menu li, nav li, [data-tab]');
  
  if (menuItems.length > 0) {
    console.log('Đã tìm thấy các mục menu, thêm sự kiện click');
    
    // Thêm sự kiện click cho tất cả các mục menu
    menuItems.forEach(item => {
      // Xóa tất cả các sự kiện click hiện có
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);
      
      // Thêm sự kiện click mới
      newItem.addEventListener('click', function(e) {
        console.log('Đã nhấp vào mục menu:', newItem.textContent);
        
        // Lấy tab ID
        const tabId = newItem.getAttribute('data-tab') || 
                     newItem.id || 
                     newItem.textContent.trim().toLowerCase().replace(/\s+/g, '-') + '-tab';
        
        // Ẩn tất cả các tab content
        const tabContents = document.querySelectorAll('.tab-content, [id$="-tab"]');
        tabContents.forEach(tab => {
          tab.style.display = 'none';
        });
        
        // Hiển thị tab được chọn
        const selectedTab = document.getElementById(tabId) || 
                           document.querySelector(`[data-tab="${tabId}"]`) || 
                           document.querySelector(`[id$="${tabId}"]`);
        
        if (selectedTab) {
          console.log('Đã tìm thấy tab được chọn:', tabId);
          selectedTab.style.display = 'block';
        } else {
          console.log('Không tìm thấy tab được chọn:', tabId);
        }
        
        // Cập nhật trạng thái active cho menu
        menuItems.forEach(item => {
          item.classList.remove('active');
        });
        newItem.classList.add('active');
      });
    });
  }
  
  // Tìm mục menu giới thiệu
  const introMenuItem = document.querySelector('[data-tab="intro-tab"], li:contains("Giới thiệu")');
  
  if (introMenuItem) {
    console.log('Đã tìm thấy mục menu giới thiệu, thêm sự kiện click đặc biệt');
    
    // Xóa tất cả các sự kiện click hiện có
    const newIntroMenuItem = introMenuItem.cloneNode(true);
    introMenuItem.parentNode.replaceChild(newIntroMenuItem, introMenuItem);
    
    // Thêm sự kiện click mới
    newIntroMenuItem.addEventListener('click', function(e) {
      console.log('Đã nhấp vào mục menu giới thiệu');
      
      // Ẩn tất cả các tab content
      const tabContents = document.querySelectorAll('.tab-content, [id$="-tab"]');
      tabContents.forEach(tab => {
        tab.style.display = 'none';
      });
      
      // Hiển thị tab giới thiệu
      let introTab = document.getElementById('intro-tab');
      
      // Nếu tab chưa tồn tại, tạo mới
      if (!introTab) {
        introTab = document.createElement('div');
        introTab.className = 'tab-content';
        introTab.id = 'intro-tab';
        
        // Nội dung HTML cho trang giới thiệu
        introTab.innerHTML = `
          <div class="intro-container">
            <h2>Giới thiệu về Người Yêu Ảo</h2>
            
            <div class="intro-section">
              <h3>Ứng dụng Người Yêu Ảo là gì?</h3>
              <p>Người Yêu Ảo là một ứng dụng web cho phép bạn tạo và tương tác với một người yêu ảo thông qua trí tuệ nhân tạo. Ứng dụng sử dụng công nghệ AI tiên tiến của Google Gemini để tạo ra các cuộc trò chuyện tự nhiên và cá nhân hóa.</p>
              <p>Với Người Yêu Ảo, bạn có thể tạo nhân vật theo ý thích, trò chuyện, lưu giữ kỷ niệm trong nhật ký, và tham gia các mini game thú vị để tăng mức độ thân thiết với nhân vật của bạn.</p>
            </div>
            
            <div class="intro-section">
              <h3>Tính năng chính</h3>
              <div class="feature-grid">
                <div class="feature-item">
                  <div class="feature-icon"><i class="fas fa-user-plus"></i></div>
                  <div class="feature-content">
                    <h4>Tạo nhân vật</h4>
                    <p>Tùy chỉnh tên, giới tính, tuổi, tính cách, sở thích và avatar của nhân vật theo ý thích của bạn.</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon"><i class="fas fa-comment"></i></div>
                  <div class="feature-content">
                    <h4>Chat thông minh</h4>
                    <p>Trò chuyện với nhân vật của bạn về mọi chủ đề. Nhân vật sẽ phản hồi dựa trên tính cách và sở thích đã được cài đặt.</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon"><i class="fas fa-heart"></i></div>
                  <div class="feature-content">
                    <h4>Mức độ thân thiết</h4>
                    <p>Mức độ thân thiết tăng khi bạn trò chuyện và tương tác với nhân vật, ảnh hưởng đến cách nhân vật phản hồi.</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon"><i class="fas fa-book"></i></div>
                  <div class="feature-content">
                    <h4>Nhật ký tình yêu</h4>
                    <p>Ghi lại các khoảnh khắc đặc biệt trong mối quan hệ của bạn với nhân vật.</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon"><i class="fas fa-gamepad"></i></div>
                  <div class="feature-content">
                    <h4>Mini game</h4>
                    <p>Tham gia các trò chơi nhỏ với nhân vật để tăng mức độ thân thiết và hiểu nhau hơn.</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon"><i class="fas fa-cloud"></i></div>
                  <div class="feature-content">
                    <h4>Sao lưu dữ liệu</h4>
                    <p>Sao lưu và khôi phục dữ liệu với Google Drive để không bao giờ mất kỷ niệm của bạn.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="intro-section">
              <h3>Hướng dẫn sử dụng</h3>
              
              <div class="guide-step">
                <h4>Bước 1: Kết nối API Gemini</h4>
                <p>Để bắt đầu sử dụng, bạn cần có API key của Google Gemini:</p>
                <ol>
                  <li>Truy cập <a href="https://makersuite.google.com/app/apikey" target="_blank">https://makersuite.google.com/app/apikey</a> để tạo API key</li>
                  <li>Đăng nhập bằng tài khoản Google của bạn</li>
                  <li>Tạo API key mới hoặc sử dụng key hiện có</li>
                  <li>Trong ứng dụng Người Yêu Ảo, chuyển đến tab "Cài Đặt"</li>
                  <li>Nhập API key vào ô "API Key" và nhấn "Lưu API Key"</li>
                </ol>
              </div>
              
              <div class="guide-step">
                <h4>Bước 2: Tạo nhân vật</h4>
                <p>Sau khi kết nối API, bạn cần tạo nhân vật của mình:</p>
                <ol>
                  <li>Chuyển đến tab "Tạo Nhân Vật"</li>
                  <li>Điền thông tin nhân vật: tên, giới tính, tuổi, tính cách, sở thích</li>
                  <li>Chọn avatar cho nhân vật</li>
                  <li>Nhấn "Tạo Nhân Vật" để hoàn tất</li>
                </ol>
              </div>
              
              <div class="guide-step">
                <h4>Bước 3: Bắt đầu trò chuyện</h4>
                <p>Sau khi tạo nhân vật, bạn có thể bắt đầu trò chuyện:</p>
                <ol>
                  <li>Chuyển đến tab "Chat"</li>
                  <li>Nhập tin nhắn vào ô nhập liệu và nhấn nút gửi</li>
                  <li>Sử dụng nút biểu tượng cảm xúc để thêm emoji vào tin nhắn</li>
                  <li>Sử dụng nút hình ảnh để gửi ảnh trong cuộc trò chuyện</li>
                </ol>
              </div>
              
              <div class="guide-step">
                <h4>Bước 4: Khám phá các tính năng khác</h4>
                <p>Ứng dụng còn nhiều tính năng thú vị khác để bạn khám phá:</p>
                <ul>
                  <li><strong>Nhật Ký:</strong> Xem lại các khoảnh khắc đặc biệt được ghi lại tự động</li>
                  <li><strong>Mini Game:</strong> Chơi các trò chơi để tăng mức độ thân thiết</li>
                  <li><strong>Cài Đặt:</strong> Quản lý API key, sao lưu và khôi phục dữ liệu</li>
                </ul>
              </div>
            </div>
            
            <div class="intro-section">
              <h3>Liên hệ và hỗ trợ</h3>
              <p>Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng liên hệ qua:</p>
              <ul>
                <li>Email: <a href="mailto:support@nguoiyeuao.com">support@nguoiyeuao.com</a></li>
                <li>GitHub: <a href="https://github.com/ruandejuxian/nguoiyeuao" target="_blank">https://github.com/ruandejuxian/nguoiyeuao</a></li>
              </ul>
              <p>Chúc bạn có trải nghiệm vui vẻ với Người Yêu Ảo!</p>
            </div>
          </div>
        `;
        
        // Thêm vào main-content hoặc body
        const mainContent = document.querySelector('.main-content') || document.body;
        mainContent.appendChild(introTab);
      }
      
      // Hiển thị tab
      introTab.style.display = 'block';
      
      // Cập nhật trạng thái active cho menu
      menuItems.forEach(item => {
        item.classList.remove('active');
      });
      newIntroMenuItem.classList.add('active');
      
      // Thêm sự kiện click cho tất cả các liên kết trong tab giới thiệu
      const introLinks = introTab.querySelectorAll('a');
      introLinks.forEach(link => {
        if (link.getAttribute('target') !== '_blank') {
          link.setAttribute('target', '_blank');
        }
      });
    });
  }
}

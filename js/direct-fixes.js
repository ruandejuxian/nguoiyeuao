// direct-fixes.js - Giải pháp trực tiếp cho tất cả các vấn đề

/**
 * Giải pháp trực tiếp cho trang web Người Yêu Ảo
 * 
 * File này sử dụng phương pháp thao tác DOM trực tiếp để sửa các lỗi và thêm tính năng mới
 * mà không phụ thuộc vào cấu trúc code hiện tại của trang web.
 */

// Đảm bảo script chạy sau khi trang đã tải hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
  // Chờ thêm một chút để đảm bảo tất cả các script khác đã chạy
  setTimeout(function() {
    console.log('Đang áp dụng các bản sửa lỗi trực tiếp...');
    
    // 1. Sửa nút "Tạo Nhân Vật Ngay"
    fixCreateCharacterButton();
    
    // 2. Thêm trang giới thiệu
    addIntroductionPage();
    
    // 3. Sửa lỗi biểu tượng trong chat
    fixChatIcons();
    
    // 4. Sửa lỗi tích hợp Google API
    fixGoogleApiIntegration();
    
    // 5. Thêm tính năng biểu tượng cảm xúc và gửi ảnh trong chat
    enhanceChatWithEmojisAndImages();
    
    console.log('Đã áp dụng tất cả các bản sửa lỗi trực tiếp!');
  }, 500);
});

// 1. Sửa nút "Tạo Nhân Vật Ngay"
function fixCreateCharacterButton() {
  console.log('Đang sửa nút Tạo Nhân Vật Ngay...');
  
  // Tìm tất cả các nút có thể là nút tạo nhân vật
  const possibleButtons = [
    document.querySelector('.create-character-btn'),
    document.querySelector('button:contains("Tạo Nhân Vật Ngay")'),
    document.querySelector('a:contains("Tạo Nhân Vật Ngay")'),
    ...Array.from(document.querySelectorAll('button')).filter(btn => 
      btn.textContent.includes('Tạo Nhân Vật') || 
      btn.innerText.includes('Tạo Nhân Vật')
    ),
    ...Array.from(document.querySelectorAll('a')).filter(a => 
      a.textContent.includes('Tạo Nhân Vật') || 
      a.innerText.includes('Tạo Nhân Vật')
    )
  ].filter(Boolean); // Lọc bỏ các phần tử null/undefined
  
  console.log('Tìm thấy các nút có thể:', possibleButtons);
  
  // Thêm sự kiện click cho tất cả các nút có thể
  possibleButtons.forEach(button => {
    // Xóa tất cả các sự kiện click hiện có
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // Thêm sự kiện click mới
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Đã nhấp vào nút Tạo Nhân Vật Ngay');
      
      // Tìm tab tạo nhân vật
      const createCharacterTab = document.querySelector('[data-tab="create-character-tab"]');
      if (createCharacterTab) {
        console.log('Đã tìm thấy tab tạo nhân vật, kích hoạt click');
        createCharacterTab.click();
      } else {
        // Tìm tất cả các tab và chọn tab có vẻ là tab tạo nhân vật
        const allTabs = document.querySelectorAll('.nav-menu li, [data-tab]');
        console.log('Tất cả các tab:', allTabs);
        
        const createTab = Array.from(allTabs).find(tab => 
          tab.textContent.includes('Tạo') || 
          tab.innerText.includes('Tạo') ||
          (tab.getAttribute('data-tab') && tab.getAttribute('data-tab').includes('create'))
        );
        
        if (createTab) {
          console.log('Đã tìm thấy tab tạo nhân vật thay thế, kích hoạt click');
          createTab.click();
        } else {
          console.log('Không tìm thấy tab tạo nhân vật, thử phương pháp khác');
          
          // Phương pháp thay thế: Hiển thị trực tiếp tab tạo nhân vật
          const tabContents = document.querySelectorAll('.tab-content');
          tabContents.forEach(tab => {
            tab.style.display = 'none';
          });
          
          const createCharacterContent = document.querySelector('#create-character-tab, [id*="create"]');
          if (createCharacterContent) {
            createCharacterContent.style.display = 'block';
          }
        }
      }
    });
    
    console.log('Đã thêm sự kiện click cho nút:', newButton);
  });
  
  // Nếu không tìm thấy nút nào, tạo nút mới
  if (possibleButtons.length === 0) {
    console.log('Không tìm thấy nút tạo nhân vật, tạo nút mới');
    
    // Tìm container chào mừng
    const welcomeContainer = document.querySelector('.welcome-message') || 
                            document.querySelector('h1, h2, h3, h4, h5').closest('div');
    
    if (welcomeContainer) {
      const newButton = document.createElement('button');
      newButton.textContent = 'Tạo Nhân Vật Ngay';
      newButton.className = 'create-character-btn';
      newButton.style.cssText = `
        background-color: #ff6b6b;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 15px;
        transition: background-color 0.3s;
      `;
      
      newButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#ff5252';
      });
      
      newButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#ff6b6b';
      });
      
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Tìm tab tạo nhân vật
        const createCharacterTab = document.querySelector('[data-tab="create-character-tab"]');
        if (createCharacterTab) {
          createCharacterTab.click();
        } else {
          // Tìm tất cả các tab và chọn tab có vẻ là tab tạo nhân vật
          const allTabs = document.querySelectorAll('.nav-menu li, [data-tab]');
          const createTab = Array.from(allTabs).find(tab => 
            tab.textContent.includes('Tạo') || 
            tab.innerText.includes('Tạo') ||
            (tab.getAttribute('data-tab') && tab.getAttribute('data-tab').includes('create'))
          );
          
          if (createTab) {
            createTab.click();
          }
        }
      });
      
      welcomeContainer.appendChild(newButton);
      console.log('Đã tạo và thêm nút mới vào container chào mừng');
    }
  }
}

// 2. Thêm trang giới thiệu
function addIntroductionPage() {
  console.log('Đang thêm trang giới thiệu...');
  
  // Thêm CSS cho trang giới thiệu
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .intro-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .intro-section {
      margin-bottom: 40px;
      background-color: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .intro-section h3 {
      color: #ff6b6b;
      margin-top: 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .feature-item {
      display: flex;
      align-items: flex-start;
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 8px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .feature-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .feature-icon {
      width: 50px;
      height: 50px;
      background-color: #ff6b6b;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      flex-shrink: 0;
    }
    
    .feature-icon i {
      font-size: 24px;
    }
    
    .feature-content h4 {
      margin-top: 0;
      margin-bottom: 5px;
      color: #333;
    }
    
    .feature-content p {
      margin: 0;
      color: #666;
    }
    
    .guide-step {
      margin-bottom: 25px;
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 8px;
      border-left: 4px solid #4ecdc4;
    }
    
    .guide-step h4 {
      margin-top: 0;
      color: #4ecdc4;
    }
    
    .guide-step ol, .guide-step ul {
      padding-left: 20px;
    }
    
    .guide-step li {
      margin-bottom: 8px;
    }
    
    @media (max-width: 768px) {
      .feature-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
  
  // Tìm menu
  const navMenu = document.querySelector('.nav-menu ul') || document.querySelector('nav ul');
  
  if (navMenu) {
    console.log('Đã tìm thấy menu, thêm mục Giới thiệu');
    
    // Tạo mục menu mới
    const introMenuItem = document.createElement('li');
    introMenuItem.setAttribute('data-tab', 'intro-tab');
    introMenuItem.innerHTML = '<i class="fas fa-info-circle"></i> Giới thiệu';
    
    // Nếu không có Font Awesome, thêm biểu tượng Unicode
    if (!document.querySelector('link[href*="fontawesome"]')) {
      introMenuItem.innerHTML = 'ℹ️ Giới thiệu';
    }
    
    // Thêm vào menu (trước mục Cài đặt nếu có)
    const settingsMenuItem = navMenu.querySelector('li[data-tab="settings-tab"]');
    if (settingsMenuItem) {
      navMenu.insertBefore(introMenuItem, settingsMenuItem);
    } else {
      navMenu.appendChild(introMenuItem);
    }
    
    // Thêm sự kiện click
    introMenuItem.addEventListener('click', function() {
      // Ẩn tất cả các tab content
      const tabContents = document.querySelectorAll('.tab-content');
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
      const menuItems = document.querySelectorAll('.nav-menu li, nav li');
      menuItems.forEach(item => {
        item.classList.remove('active');
      });
      introMenuItem.classList.add('active');
    });
    
    console.log('Đã thêm mục Giới thiệu vào menu');
  } else {
    console.log('Không tìm thấy menu, thử phương pháp khác');
    
    // Phương pháp thay thế: Thêm nút Giới thiệu vào header
    const header = document.querySelector('header') || document.querySelector('.header');
    
    if (header) {
      const introButton = document.createElement('button');
      introButton.textContent = 'Giới thiệu';
      introButton.style.cssText = `
        background-color: #4ecdc4;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 5px;
        cursor: pointer;
        margin-left: 10px;
      `;
      
      introButton.addEventListener('click', function() {
        // Tạo modal giới thiệu
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
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
          background-color: white;
          width: 90%;
          max-width: 800px;
          max-height: 90%;
          overflow-y: auto;
          border-radius: 10px;
          padding: 20px;
          position: relative;
        `;
        
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        `;
        
        closeButton.addEventListener('click', function() {
          document.body.removeChild(modal);
        });
        
        modalContent.innerHTML = `
          <h2>Giới thiệu về Người Yêu Ảo</h2>
          
          <div class="intro-section">
            <h3>Ứng dụng Người Yêu Ảo là gì?</h3>
            <p>Người Yêu Ảo là một ứng dụng web cho phép bạn tạo và tương tác với một người yêu ảo thông qua trí tuệ nhân tạo. Ứng dụng sử dụng công nghệ AI tiên tiến của Google Gemini để tạo ra các cuộc trò chuyện tự nhiên và cá nhân hóa.</p>
          </div>
          
          <div class="intro-section">
            <h3>Hướng dẫn sử dụng</h3>
            <ol>
              <li>Truy cập <a href="https://makersuite.google.com/app/apikey" target="_blank">https://makersuite.google.com/app/apikey</a> để tạo API key</li>
              <li>Trong ứng dụng Người Yêu Ảo, chuyển đến tab "Cài Đặt" và nhập API key</li>
              <li>Chuyển đến tab "Tạo Nhân Vật" để tạo nhân vật của bạn</li>
              <li>Bắt đầu trò chuyện với nhân vật trong tab "Chat"</li>
            </ol>
          </div>
        `;
        
        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
      });
      
      header.appendChild(introButton);
      console.log('Đã thêm nút Giới thiệu vào header');
    }
  }
}

// 3. Sửa lỗi biểu tượng trong chat
function fixChatIcons() {
  console.log('Đang sửa lỗi biểu tượng trong chat...');
  
  // Thêm Font Awesome nếu chưa có
  if (!document.querySelector('link[href*="fontawesome"]')) {
    console.log('Thêm Font Awesome');
    
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);
  }
  
  // Tìm các nút trong chat
  setTimeout(function() {
    const chatButtons = document.querySelectorAll('.chat-button, .emoji-button, .image-button');
    
    if (chatButtons.length > 0) {
      console.log('Đã tìm thấy các nút chat, cập nhật biểu tượng');
      
      chatButtons.forEach(button => {
        // Kiểm tra nếu nút không có biểu tượng hoặc biểu tượng không hiển thị
        if (!button.querySelector('i') || button.querySelector('i').offsetWidth === 0) {
          if (button.classList.contains('emoji-button')) {
            button.innerHTML = '<i class="far fa-smile"></i>';
          } else if (button.classList.contains('image-button')) {
            button.innerHTML = '<i class="far fa-image"></i>';
          }
        }
      });
    } else {
      console.log('Không tìm thấy các nút chat, thêm nút mới');
      
      // Tìm khung chat input
      const chatInput = document.querySelector('.chat-input') || document.querySelector('form');
      
      if (chatInput) {
        // Tạo container cho các nút
        const chatButtons = document.createElement('div');
        chatButtons.className = 'chat-buttons';
        chatButtons.style.cssText = `
          display: flex;
          align-items: center;
          margin-right: 10px;
        `;
        
        // Tạo nút biểu tượng cảm xúc
        const emojiButton = document.createElement('button');
        emojiButton.className = 'chat-button emoji-button';
        emojiButton.innerHTML = '<i class="far fa-smile"></i>';
        emojiButton.title = 'Chọn biểu tượng cảm xúc';
        emojiButton.style.cssText = `
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #f0f0f0;
          color: #666;
          border: none;
          margin-left: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        
        // Tạo nút tải lên ảnh
        const imageButton = document.createElement('button');
        imageButton.className = 'chat-button image-button';
        imageButton.innerHTML = '<i class="far fa-image"></i>';
        imageButton.title = 'Tải lên ảnh';
        imageButton.style.cssText = `
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #f0f0f0;
          color: #666;
          border: none;
          margin-left: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        
        // Thêm các nút vào container
        chatButtons.appendChild(emojiButton);
        chatButtons.appendChild(imageButton);
        
        // Thêm vào khung chat
        const messageInput = chatInput.querySelector('textarea, input[type="text"]');
        if (messageInput) {
          chatInput.insertBefore(chatButtons, messageInput);
        } else {
          chatInput.appendChild(chatButtons);
        }
        
        console.log('Đã thêm các nút mới vào khung chat');
      }
    }
  }, 1000); // Đợi 1 giây để đảm bảo Font Awesome đã tải
}

// 4. Sửa lỗi tích hợp Google API
function fixGoogleApiIntegration() {
  console.log('Đang sửa lỗi tích hợp Google API...');
  
  // Thêm các script cần thiết
  function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
  }
  
  // Tạo phiên bản giả của gapi
  window.gapi = window.gapi || {
    load: function(library, callback) {
      console.log('Mock loading Google API library:', library);
      if (callback) setTimeout(callback, 100);
    },
    client: {
      init: function(params) {
        console.log('Mock initializing Google API client with params:', params);
        return Promise.resolve();
      },
      drive: {
        files: {
          create: function(params) {
            console.log('Mock creating file with params:', params);
            return Promise.resolve({result: {id: 'mock-file-id-' + Date.now()}});
          },
          get: function(params) {
            console.log('Mock getting file with params:', params);
            return Promise.resolve({result: {id: params.fileId, name: 'Mock File'}});
          }
        }
      }
    },
    auth2: {
      getAuthInstance: function() {
        return {
          isSignedIn: {
            get: function() { return false; },
            listen: function(callback) { callback(false); }
          },
          signIn: function() {
            console.log('Mock sign in');
            return Promise.resolve({
              getBasicProfile: function() {
                return {
                  getName: function() { return 'Mock User'; },
                  getEmail: function() { return 'mock.user@example.com'; }
                };
              }
            });
          },
          signOut: function() {
            console.log('Mock sign out');
            return Promise.resolve();
          }
        };
      }
    }
  };
  
  // Tạo phiên bản giả của google.accounts.id
  window.google = window.google || {};
  window.google.accounts = window.google.accounts || {};
  window.google.accounts.id = window.google.accounts.id || {
    initialize: function(params) {
      console.log('Mock initializing Google Identity Services with params:', params);
    },
    renderButton: function(element, options) {
      console.log('Mock rendering Google Sign-In button with options:', options);
      
      // Tạo nút đăng nhập giả
      if (element) {
        element.innerHTML = '<button class="mock-google-button">Đăng nhập với Google (Mô phỏng)</button>';
        
        // Thêm sự kiện click
        const button = element.querySelector('.mock-google-button');
        if (button) {
          button.addEventListener('click', function() {
            console.log('Mock Google Sign-In button clicked');
            
            // Mô phỏng callback
            if (params && params.callback) {
              params.callback({
                credential: 'mock-credential-' + Date.now(),
                select_by: 'user'
              });
            }
          });
        }
      }
    },
    prompt: function() {
      console.log('Mock prompting for Google Sign-In');
    }
  };
  
  // Tìm nút đăng nhập Google
  setTimeout(function() {
    const googleAuthBtn = document.getElementById('google-auth-btn');
    
    if (googleAuthBtn) {
      console.log('Đã tìm thấy nút đăng nhập Google, thêm sự kiện click');
      
      // Xóa tất cả các sự kiện click hiện có
      const newButton = googleAuthBtn.cloneNode(true);
      googleAuthBtn.parentNode.replaceChild(newButton, googleAuthBtn);
      
      // Thêm sự kiện click mới
      newButton.addEventListener('click', function() {
        console.log('Đã nhấp vào nút đăng nhập Google');
        
        // Hiển thị modal xác nhận
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
      });
    } else {
      console.log('Không tìm thấy nút đăng nhập Google, tìm trong tab cài đặt');
      
      // Tìm tab cài đặt
      const settingsTab = document.getElementById('settings-tab') || 
                          document.querySelector('[data-tab="settings-tab"]') ||
                          document.querySelector('[id*="settings"]');
      
      if (settingsTab) {
        console.log('Đã tìm thấy tab cài đặt, thêm nút đăng nhập Google');
        
        // Tạo nút đăng nhập Google
        const googleAuthBtn = document.createElement('button');
        googleAuthBtn.id = 'google-auth-btn';
        googleAuthBtn.textContent = 'Đăng nhập với Google';
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
        
        // Tạo container cho Google API
        const googleApiContainer = document.createElement('div');
        googleApiContainer.style.cssText = `
          margin-top: 30px;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 10px;
        `;
        
        googleApiContainer.innerHTML = '<h3>Google Drive</h3><p>Đăng nhập với Google để sao lưu và khôi phục dữ liệu của bạn.</p>';
        googleApiContainer.appendChild(googleAuthBtn);
        googleApiContainer.appendChild(googleAuthStatus);
        
        const buttonContainer = document.createElement('div');
        buttonContainer.appendChild(backupDataBtn);
        buttonContainer.appendChild(restoreDataBtn);
        googleApiContainer.appendChild(buttonContainer);
        
        // Thêm vào tab cài đặt
        settingsTab.appendChild(googleApiContainer);
        
        // Thêm sự kiện click cho nút đăng nhập Google
        googleAuthBtn.addEventListener('click', function() {
          console.log('Đã nhấp vào nút đăng nhập Google');
          
          // Hiển thị modal xác nhận
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
          
          modal.appendChild(modalContent);
          document.body.appendChild(modal);
          
          // Xử lý sự kiện nút Đồng ý
          document.getElementById('confirm-btn').addEventListener('click', function() {
            // Cập nhật trạng thái đăng nhập
            googleAuthStatus.textContent = 'Đã đăng nhập: Người dùng mô phỏng';
            googleAuthStatus.classList.add('authenticated');
            
            // Kích hoạt các nút sao lưu và khôi phục
            backupDataBtn.disabled = false;
            restoreDataBtn.disabled = false;
            
            // Đóng modal
            document.body.removeChild(modal);
            
            // Hiển thị thông báo thành công
            alert('Đăng nhập thành công trong chế độ mô phỏng.');
          });
          
          // Xử lý sự kiện nút Hủy
          document.getElementById('cancel-btn').addEventListener('click', function() {
            document.body.removeChild(modal);
          });
        });
        
        // Thêm sự kiện click cho nút sao lưu dữ liệu
        backupDataBtn.addEventListener('click', function() {
          console.log('Đã nhấp vào nút sao lưu dữ liệu');
          
          // Hiển thị thông báo đang sao lưu
          alert('Đang sao lưu dữ liệu...');
          
          // Mô phỏng sao lưu dữ liệu
          setTimeout(function() {
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
          }, 1000);
        });
        
        // Thêm sự kiện click cho nút khôi phục dữ liệu
        restoreDataBtn.addEventListener('click', function() {
          console.log('Đã nhấp vào nút khôi phục dữ liệu');
          
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
        });
      }
    }
  }, 1000);
}

// 5. Thêm tính năng biểu tượng cảm xúc và gửi ảnh trong chat
function enhanceChatWithEmojisAndImages() {
  console.log('Đang thêm tính năng biểu tượng cảm xúc và gửi ảnh trong chat...');
  
  // Thêm CSS cho tính năng mới
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Styles for emoji picker */
    .emoji-picker {
      position: absolute;
      bottom: 60px;
      left: 10px;
      width: 250px;
      height: 200px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      padding: 10px;
      display: none;
      z-index: 100;
      overflow-y: auto;
    }
    
    .emoji-picker.active {
      display: block;
    }
    
    .emoji-category {
      margin-bottom: 10px;
    }
    
    .emoji-category-title {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }
    
    .emoji-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 5px;
    }
    
    .emoji-item {
      font-size: 20px;
      cursor: pointer;
      text-align: center;
      padding: 5px;
      border-radius: 5px;
      transition: background-color 0.2s;
    }
    
    .emoji-item:hover {
      background-color: #f0f0f0;
    }
    
    /* Styles for chat buttons */
    .chat-input {
      position: relative;
    }
    
    .chat-buttons {
      display: flex;
      align-items: center;
      margin-right: 10px;
    }
    
    .chat-button {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #f0f0f0;
      color: #666;
      border: none;
      margin-left: 5px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .chat-button:hover {
      background-color: #e0e0e0;
    }
    
    .chat-button.active {
      background-color: #ff6b6b;
      color: white;
    }
    
    /* Styles for image upload */
    .image-upload {
      display: none;
    }
    
    /* Styles for message with image */
    .message-image {
      max-width: 200px;
      max-height: 200px;
      border-radius: 10px;
      margin-top: 5px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .message-image:hover {
      transform: scale(1.05);
    }
    
    /* Image preview modal */
    .image-preview-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s;
    }
    
    .image-preview-modal.active {
      opacity: 1;
      visibility: visible;
    }
    
    .image-preview-content {
      max-width: 90%;
      max-height: 90%;
      position: relative;
    }
    
    .image-preview-content img {
      max-width: 100%;
      max-height: 90vh;
      border-radius: 5px;
    }
    
    .image-preview-close {
      position: absolute;
      top: -40px;
      right: 0;
      color: white;
      font-size: 30px;
      cursor: pointer;
    }
  `;
  
  document.head.appendChild(styleElement);
  
  // Tìm khung chat input
  setTimeout(function() {
    const chatInput = document.querySelector('.chat-input') || 
                     document.querySelector('form') ||
                     document.querySelector('textarea, input[type="text"]').closest('div');
    
    if (chatInput) {
      console.log('Đã tìm thấy khung chat input, thêm nút biểu tượng cảm xúc và tải lên ảnh');
      
      // Kiểm tra xem đã có các nút chưa
      if (!chatInput.querySelector('.chat-buttons')) {
        // Tạo container cho các nút
        const chatButtons = document.createElement('div');
        chatButtons.className = 'chat-buttons';
        
        // Tạo nút biểu tượng cảm xúc
        const emojiButton = document.createElement('button');
        emojiButton.className = 'chat-button emoji-button';
        emojiButton.innerHTML = '<i class="far fa-smile"></i>';
        emojiButton.title = 'Chọn biểu tượng cảm xúc';
        
        // Tạo nút tải lên ảnh
        const imageButton = document.createElement('button');
        imageButton.className = 'chat-button image-button';
        imageButton.innerHTML = '<i class="far fa-image"></i>';
        imageButton.title = 'Tải lên ảnh';
        
        // Tạo input file ẩn
        const imageUpload = document.createElement('input');
        imageUpload.type = 'file';
        imageUpload.className = 'image-upload';
        imageUpload.accept = 'image/*';
        
        // Thêm các phần tử vào DOM
        chatButtons.appendChild(emojiButton);
        chatButtons.appendChild(imageButton);
        chatButtons.appendChild(imageUpload);
        
        // Thêm vào trước textarea hoặc input
        const messageInput = chatInput.querySelector('textarea, input[type="text"]');
        if (messageInput) {
          chatInput.insertBefore(chatButtons, messageInput);
        } else {
          chatInput.appendChild(chatButtons);
        }
        
        // Tạo emoji picker
        createEmojiPicker(chatInput, messageInput);
        
        // Thêm sự kiện cho nút tải lên ảnh
        imageButton.addEventListener('click', function() {
          imageUpload.click();
        });
        
        // Xử lý khi chọn ảnh
        imageUpload.addEventListener('change', function(e) {
          if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Kiểm tra kích thước file (tối đa 5MB)
            if (file.size > 5 * 1024 * 1024) {
              alert('Kích thước ảnh không được vượt quá 5MB.');
              return;
            }
            
            // Kiểm tra loại file
            if (!file.type.startsWith('image/')) {
              alert('Vui lòng chọn file ảnh.');
              return;
            }
            
            // Đọc file dưới dạng Data URL
            const reader = new FileReader();
            reader.onload = function(event) {
              // Gửi ảnh
              sendImage(event.target.result);
              
              // Reset input file
              imageUpload.value = '';
            };
            reader.readAsDataURL(file);
          }
        });
        
        // Tạo modal xem trước ảnh
        createImagePreviewModal();
      }
    }
  }, 1000);
  
  // Tạo emoji picker
  function createEmojiPicker(chatInput, messageInput) {
    // Tạo emoji picker
    const emojiPicker = document.createElement('div');
    emojiPicker.className = 'emoji-picker';
    
    // Danh sách emoji theo danh mục
    const emojiCategories = [
      {
        name: 'Biểu cảm',
        emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕']
      },
      {
        name: 'Trái tim & Tình yêu',
        emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️', '💌', '💋', '👩‍❤️‍👨', '👨‍❤️‍👨', '👩‍❤️‍👩', '👩‍❤️‍💋‍👨', '👨‍❤️‍💋‍👨', '👩‍❤️‍💋‍👩']
      },
      {
        name: 'Cử chỉ & Con người',
        emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸']
      }
    ];
    
    // Tạo nội dung cho emoji picker
    emojiCategories.forEach(category => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'emoji-category';
      
      const categoryTitle = document.createElement('div');
      categoryTitle.className = 'emoji-category-title';
      categoryTitle.textContent = category.name;
      
      const emojiGrid = document.createElement('div');
      emojiGrid.className = 'emoji-grid';
      
      category.emojis.forEach(emoji => {
        const emojiItem = document.createElement('div');
        emojiItem.className = 'emoji-item';
        emojiItem.textContent = emoji;
        
        // Thêm sự kiện click cho emoji
        emojiItem.addEventListener('click', function() {
          // Thêm emoji vào input
          if (messageInput) {
            const cursorPos = messageInput.selectionStart;
            const textBefore = messageInput.value.substring(0, cursorPos);
            const textAfter = messageInput.value.substring(cursorPos);
            
            messageInput.value = textBefore + emoji + textAfter;
            
            // Đặt lại vị trí con trỏ
            messageInput.selectionStart = cursorPos + emoji.length;
            messageInput.selectionEnd = cursorPos + emoji.length;
            messageInput.focus();
          }
          
          // Đóng emoji picker
          emojiPicker.classList.remove('active');
        });
        
        emojiGrid.appendChild(emojiItem);
      });
      
      categoryDiv.appendChild(categoryTitle);
      categoryDiv.appendChild(emojiGrid);
      emojiPicker.appendChild(categoryDiv);
    });
    
    // Thêm emoji picker vào DOM
    chatInput.appendChild(emojiPicker);
    
    // Thêm sự kiện cho nút emoji
    const emojiButton = chatInput.querySelector('.emoji-button');
    if (emojiButton) {
      emojiButton.addEventListener('click', function() {
        emojiPicker.classList.toggle('active');
      });
    }
    
    // Đóng emoji picker khi click bên ngoài
    document.addEventListener('click', function(e) {
      if (emojiButton && !emojiButton.contains(e.target) && !emojiPicker.contains(e.target)) {
        emojiPicker.classList.remove('active');
      }
    });
  }
  
  // Tạo modal xem trước ảnh
  function createImagePreviewModal() {
    // Kiểm tra xem modal đã tồn tại chưa
    if (document.querySelector('.image-preview-modal')) {
      return;
    }
    
    // Tạo modal
    const modal = document.createElement('div');
    modal.className = 'image-preview-modal';
    
    // Tạo nội dung modal
    const modalContent = document.createElement('div');
    modalContent.className = 'image-preview-content';
    
    // Tạo ảnh
    const image = document.createElement('img');
    
    // Tạo nút đóng
    const closeButton = document.createElement('div');
    closeButton.className = 'image-preview-close';
    closeButton.innerHTML = '&times;';
    
    // Thêm sự kiện cho nút đóng
    closeButton.addEventListener('click', function() {
      modal.classList.remove('active');
    });
    
    // Thêm sự kiện click bên ngoài để đóng
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
    
    // Thêm các phần tử vào DOM
    modalContent.appendChild(image);
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Thêm phương thức mở modal vào window
    window.openImagePreview = function(src) {
      image.src = src;
      modal.classList.add('active');
    };
  }
  
  // Gửi ảnh
  function sendImage(imageData) {
    console.log('Gửi ảnh:', imageData.substring(0, 50) + '...');
    
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
      
      // Thêm ảnh
      messageElement.innerHTML = `
        <img src="${imageData}" alt="Ảnh" class="message-image">
        <span class="message-time">${formattedTime}</span>
      `;
      
      // Thêm vào container chat
      chatMessages.appendChild(messageElement);
      
      // Thêm sự kiện click cho ảnh
      const imageElement = messageElement.querySelector('.message-image');
      if (imageElement) {
        imageElement.addEventListener('click', function() {
          window.openImagePreview(imageData);
        });
      }
      
      // Cuộn xuống dưới
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Lưu tin nhắn vào localStorage
      saveMessage('user', '', imageData);
      
      // Tạo phản hồi từ nhân vật
      setTimeout(function() {
        // Tạo phần tử tin nhắn
        const responseElement = document.createElement('div');
        responseElement.classList.add('message', 'character');
        
        // Định dạng timestamp
        const timestamp = new Date();
        const formattedTime = formatDate(timestamp);
        
        // Nội dung phản hồi
        responseElement.innerHTML = `
          <div class="message-content">Ồ, cảm ơn bạn đã gửi ảnh cho mình! Trông thật tuyệt.</div>
          <span class="message-time">${formattedTime}</span>
        `;
        
        // Thêm vào container chat
        chatMessages.appendChild(responseElement);
        
        // Cuộn xuống dưới
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Lưu tin nhắn vào localStorage
        saveMessage('character', 'Ồ, cảm ơn bạn đã gửi ảnh cho mình! Trông thật tuyệt.');
      }, 1000);
    }
  }
  
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

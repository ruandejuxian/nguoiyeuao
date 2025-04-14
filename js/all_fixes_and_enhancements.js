/**
 * Tích hợp tất cả các bản sửa lỗi và tính năng mới
 * 
 * File này kết hợp tất cả các bản sửa lỗi và tính năng mới vào một file duy nhất
 * để dễ dàng triển khai.
 */

// Hàm chính để tích hợp tất cả các bản sửa lỗi và tính năng mới
function applyAllFixesAndEnhancements() {
    console.log('Applying all fixes and enhancements');
    
    // 1. Sửa lỗi nút "Tạo Nhân Vật Ngay" không hoạt động
    fixNavigationButton();
    
    // 2. Sửa lỗi avatar nhân vật không hiển thị
    fixAvatarFunctionality();
    
    // 3. Sửa lỗi tích hợp Google API
    fixGoogleApiIntegration();
    
    // 4. Thêm tính năng biểu tượng cảm xúc và gửi ảnh trong chat
    addChatEnhancements();
    
    // 5. Thêm trang giới thiệu
    addIntroductionPage();
    
    console.log('All fixes and enhancements applied successfully');
}

// 1. Sửa lỗi nút "Tạo Nhân Vật Ngay" không hoạt động
function fixNavigationButton() {
    console.log('Fixing navigation button functionality');
    
    // Thêm hàm mới vào UI object để xử lý nút tạo nhân vật trong welcome message
    UI.initWelcomeButton = function() {
        // Tìm nút tạo nhân vật trong welcome message
        const createCharacterBtn = document.querySelector('.welcome-message .create-character-btn');
        
        // Thêm event listener nếu nút tồn tại
        if (createCharacterBtn) {
            createCharacterBtn.addEventListener('click', () => {
                // Lấy tab ID từ thuộc tính data-tab
                const tabId = createCharacterBtn.getAttribute('data-tab');
                
                // Chuyển đến tab tạo nhân vật
                this.switchTab(tabId);
            });
        }
    };
    
    // Cập nhật hàm init của UI để gọi hàm mới
    const originalUIInit = UI.init;
    UI.init = function() {
        // Gọi hàm init gốc
        originalUIInit.call(this);
        
        // Thêm khởi tạo cho nút welcome
        this.initWelcomeButton();
        
        console.log('UI initialized with welcome button support');
    };
}

// 2. Sửa lỗi avatar nhân vật không hiển thị
function fixAvatarFunctionality() {
    console.log('Fixing avatar functionality');
    
    // Lưu hàm gốc
    const originalCreateDefaultAvatars = window.createDefaultAvatars;
    
    // Ghi đè hàm createDefaultAvatars
    window.createDefaultAvatars = function() {
        // Tạo default avatar bất kể môi trường nào
        console.log('Enhancing avatar functionality');
        
        // Kiểm tra avatar mặc định
        const defaultAvatar = new Image();
        defaultAvatar.src = CONFIG.CHARACTER.DEFAULT_AVATAR;
        
        // Xử lý khi avatar không tải được
        defaultAvatar.onerror = function() {
            console.log('Creating default avatars for all environments');
            
            // Tạo canvas cho avatar mặc định
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            
            // Vẽ avatar mặc định
            ctx.fillStyle = '#FF6B6B';
            ctx.beginPath();
            ctx.arc(100, 100, 100, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = '80px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', 100, 100);
            
            // Lưu dưới dạng data URL
            const dataUrl = canvas.toDataURL('image/png');
            
            // Tạo các phần tử avatar
            const avatarOptions = document.querySelectorAll('.avatar-option');
            avatarOptions.forEach((option, index) => {
                const img = option.querySelector('img');
                if (!img) return;
                
                // Tạo avatar có màu sắc khác nhau cho mỗi tùy chọn
                const avatarCanvas = document.createElement('canvas');
                avatarCanvas.width = 200;
                avatarCanvas.height = 200;
                const avatarCtx = avatarCanvas.getContext('2d');
                
                // Sử dụng màu sắc khác nhau cho mỗi avatar
                const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#6B5B95'];
                avatarCtx.fillStyle = colors[index % colors.length];
                avatarCtx.beginPath();
                avatarCtx.arc(100, 100, 100, 0, Math.PI * 2);
                avatarCtx.fill();
                
                // Thêm khuôn mặt đơn giản
                avatarCtx.fillStyle = 'white';
                
                // Mắt
                avatarCtx.beginPath();
                avatarCtx.arc(70, 80, 10, 0, Math.PI * 2);
                avatarCtx.arc(130, 80, 10, 0, Math.PI * 2);
                avatarCtx.fill();
                
                // Miệng (khác nhau cho mỗi avatar)
                avatarCtx.beginPath();
                if (index === 0) {
                    // Cười
                    avatarCtx.arc(100, 110, 30, 0, Math.PI);
                } else if (index === 1) {
                    // Thẳng
                    avatarCtx.rect(70, 120, 60, 5);
                } else if (index === 2) {
                    // Ngạc nhiên
                    avatarCtx.arc(100, 120, 15, 0, Math.PI * 2);
                } else {
                    // Mỉm cười
                    avatarCtx.arc(100, 110, 30, 0, Math.PI / 2);
                }
                avatarCtx.fill();
                
                // Đặt nguồn hình ảnh
                img.src = avatarCanvas.toDataURL('image/png');
                
                // Đảm bảo data-avatar thuộc tính được cập nhật
                const avatarName = `avatar-${index + 1}.png`;
                option.setAttribute('data-avatar', avatarName);
                
                // Lưu avatar vào localStorage để sử dụng sau này
                try {
                    localStorage.setItem(`avatar-${index + 1}`, avatarCanvas.toDataURL('image/png'));
                } catch (e) {
                    console.error('Failed to save avatar to localStorage:', e);
                }
            });
            
            // Đặt avatar mặc định
            const defaultAvatarImg = document.getElementById('companion-avatar-img');
            if (defaultAvatarImg) {
                defaultAvatarImg.src = dataUrl;
                
                // Lưu avatar mặc định vào localStorage
                try {
                    localStorage.setItem('default-avatar', dataUrl);
                } catch (e) {
                    console.error('Failed to save default avatar to localStorage:', e);
                }
            }
        };
        
        // Xử lý khi avatar tải thành công
        defaultAvatar.onload = function() {
            console.log('Default avatar loaded successfully');
            
            // Kiểm tra các avatar tùy chọn
            const avatarOptions = document.querySelectorAll('.avatar-option');
            let allAvatarsLoaded = true;
            
            avatarOptions.forEach((option) => {
                const img = option.querySelector('img');
                if (!img || !img.complete) {
                    allAvatarsLoaded = false;
                }
            });
            
            // Nếu có bất kỳ avatar nào không tải được, tạo tất cả
            if (!allAvatarsLoaded) {
                defaultAvatar.onerror();
            }
        };
    };
    
    // Cải thiện Character.create để xử lý avatar từ localStorage
    const originalCharacterCreate = Character.create;
    Character.create = function(characterData) {
        // Kiểm tra xem avatar có phải là đường dẫn đến assets/images không
        if (characterData.avatar && characterData.avatar.startsWith('assets/images/')) {
            // Lấy tên file avatar
            const avatarName = characterData.avatar.split('/').pop();
            
            // Kiểm tra xem có avatar trong localStorage không
            const storedAvatar = localStorage.getItem(avatarName.replace('.png', ''));
            if (storedAvatar) {
                // Sử dụng avatar từ localStorage
                characterData.avatar = storedAvatar;
            }
        }
        
        // Gọi hàm gốc
        return originalCharacterCreate.call(this, characterData);
    };
    
    // Cải thiện Character.init để xử lý avatar từ localStorage
    const originalCharacterInit = Character.init;
    Character.init = function() {
        // Gọi hàm gốc
        const result = originalCharacterInit.call(this);
        
        // Nếu có nhân vật, kiểm tra và cập nhật avatar
        if (result) {
            const character = Storage.load(CONFIG.CHARACTER.STORAGE_KEY);
            if (character && character.avatar) {
                // Nếu avatar là đường dẫn đến assets/images
                if (typeof character.avatar === 'string' && character.avatar.startsWith('assets/images/')) {
                    // Lấy tên file avatar
                    const avatarName = character.avatar.split('/').pop();
                    
                    // Kiểm tra xem có avatar trong localStorage không
                    const storedAvatar = localStorage.getItem(avatarName.replace('.png', ''));
                    if (storedAvatar) {
                        // Cập nhật avatar trong DOM
                        const avatarImg = document.getElementById('companion-avatar-img');
                        if (avatarImg) {
                            avatarImg.src = storedAvatar;
                        }
                    }
                }
            }
        }
        
        return result;
    };
}

// 3. Sửa lỗi tích hợp Google API
function fixGoogleApiIntegration() {
    console.log('Fixing Google API integration');
    
    // Tạo một phiên bản mới của GoogleAPI object
    const GoogleAPIEnhanced = {
        // Lưu trữ các cài đặt
        settings: {
            initialized: false,
            clientId: CONFIG.GOOGLE_API.CLIENT_ID,
            apiKey: CONFIG.GOOGLE_API.API_KEY,
            scopes: CONFIG.GOOGLE_API.SCOPES,
            discoveryDocs: CONFIG.GOOGLE_API.DISCOVERY_DOCS
        },
        
        // Khởi tạo API
        init: function() {
            console.log('Initializing enhanced Google API');
            
            // Kiểm tra xem các script cần thiết đã được tải chưa
            if (typeof gapi === 'undefined' || typeof google === 'undefined') {
                console.log('Google API scripts not loaded yet, using local versions');
                
                // Sử dụng các phiên bản local của Google API scripts
                this.initWithLocalScripts();
                return;
            }
            
            // Khởi tạo với các script đã tải
            this.initWithLoadedScripts();
        },
        
        // Khởi tạo với các script local
        initWithLocalScripts: function() {
            console.log('Initializing with local Google API scripts');
            
            // Tạo một phiên bản giả của gapi nếu cần
            if (typeof gapi === 'undefined') {
                window.gapi = {
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
            }
            
            // Tạo một phiên bản giả của google.accounts.id nếu cần
            if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
                window.google = window.google || {};
                window.google.accounts = window.google.accounts || {};
                window.google.accounts.id = {
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
            }
            
            // Cập nhật UI để hiển thị trạng thái
            this.updateAuthStatus(false);
            
            // Khởi tạo nút đăng nhập
            this.initSignInButton();
            
            // Đánh dấu là đã khởi tạo
            this.settings.initialized = true;
        },
        
        // Khởi tạo với các script đã tải
        initWithLoadedScripts: function() {
            console.log('Initializing with loaded Google API scripts');
            
            // Khởi tạo gapi client
            gapi.load('client:auth2', () => {
                gapi.client.init({
                    apiKey: this.settings.apiKey,
                    clientId: this.settings.clientId,
                    discoveryDocs: this.settings.discoveryDocs,
                    scope: this.settings.scopes.join(' ')
                }).then(() => {
                    // Lắng nghe sự thay đổi trạng thái đăng nhập
                    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateAuthStatus.bind(this));
                    
                    // Xử lý trạng thái đăng nhập ban đầu
                    this.updateAuthStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                    
                    // Khởi tạo nút đăng nhập
                    this.initSignInButton();
                    
                    // Đánh dấu là đã khởi tạo
                    this.settings.initialized = true;
                }).catch(error => {
                    console.error('Error initializing Google API client:', error);
                    
                    // Sử dụng phiên bản local nếu khởi tạo thất bại
                    this.initWithLocalScripts();
                });
            });
        },
        
        // Khởi tạo nút đăng nhập
        initSignInButton: function() {
            console.log('Initializing Google Sign-In button');
            
            const googleAuthBtn = document.getElementById('google-auth-btn');
            if (googleAuthBtn) {
                googleAuthBtn.addEventListener('click', () => {
                    if (typeof gapi !== 'undefined' && gapi.auth2) {
                        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                            this.signOut();
                        } else {
                            this.signIn();
                        }
                    } else {
                        console.log('Using mock Google Sign-In');
                        this.mockSignIn();
                    }
                });
            }
            
            // Kích hoạt các nút sao lưu và khôi phục
            this.enableBackupButtons();
        },
        
        // Cập nhật trạng thái xác thực
        updateAuthStatus: function(isSignedIn) {
            console.log('Updating auth status, isSignedIn:', isSignedIn);
            
            const googleAuthStatus = document.getElementById('google-auth-status');
            const backupDataBtn = document.getElementById('backup-data');
            const restoreDataBtn = document.getElementById('restore-data');
            
            if (googleAuthStatus) {
                if (isSignedIn) {
                    let userName = 'Người dùng';
                    
                    // Lấy tên người dùng nếu có thể
                    if (typeof gapi !== 'undefined' && gapi.auth2) {
                        try {
                            const profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
                            userName = profile.getName();
                        } catch (e) {
                            console.error('Error getting user profile:', e);
                        }
                    }
                    
                    googleAuthStatus.textContent = `Đã đăng nhập: ${userName}`;
                    googleAuthStatus.classList.add('authenticated');
                    
                    // Kích hoạt các nút sao lưu và khôi phục
                    if (backupDataBtn) backupDataBtn.disabled = false;
                    if (restoreDataBtn) restoreDataBtn.disabled = false;
                } else {
                    googleAuthStatus.textContent = 'Chưa đăng nhập';
                    googleAuthStatus.classList.remove('authenticated');
                    
                    // Vô hiệu hóa các nút sao lưu và khôi phục
                    if (backupDataBtn) backupDataBtn.disabled = true;
                    if (restoreDataBtn) restoreDataBtn.disabled = true;
                }
            }
        },
        
        // Đăng nhập
        signIn: function() {
            console.log('Signing in with Google');
            
            if (typeof gapi !== 'undefined' && gapi.auth2) {
                gapi.auth2.getAuthInstance().signIn().then(
                    user => {
                        console.log('Sign-in successful');
                        this.updateAuthStatus(true);
                    },
                    error => {
                        console.error('Error signing in:', error);
                        Utils.showModal('alert-modal', {
                            title: 'Lỗi đăng nhập',
                            message: 'Không thể đăng nhập với Google. Vui lòng thử lại sau.'
                        });
                    }
                );
            } else {
                this.mockSignIn();
            }
        },
        
        // Đăng xuất
        signOut: function() {
            console.log('Signing out from Google');
            
            if (typeof gapi !== 'undefined' && gapi.auth2) {
                gapi.auth2.getAuthInstance().signOut().then(
                    () => {
                        console.log('Sign-out successful');
                        this.updateAuthStatus(false);
                    },
                    error => {
                        console.error('Error signing out:', error);
                    }
                );
            } else {
                this.updateAuthStatus(false);
            }
        },
        
        // Mô phỏng đăng nhập
        mockSignIn: function() {
            console.log('Mock signing in with Google');
            
            // Hiển thị modal xác nhận
            Utils.showModal('confirm-modal', {
                title: 'Đăng nhập mô phỏng',
                message: 'Bạn đang sử dụng chế độ mô phỏng đăng nhập Google. Trong chế độ này, dữ liệu sẽ chỉ được lưu cục bộ. Bạn có muốn tiếp tục?',
                onConfirm: () => {
                    // Cập nhật trạng thái xác thực
                    this.updateAuthStatus(true);
                    
                    // Hiển thị thông báo thành công
                    Utils.showModal('alert-modal', {
                        title: 'Đăng nhập thành công',
                        message: 'Bạn đã đăng nhập thành công trong chế độ mô phỏng.'
                    });
                }
            });
        },
        
        // Kích hoạt các nút sao lưu và khôi phục
        enableBackupButtons: function() {
            console.log('Enabling backup and restore buttons');
            
            const backupDataBtn = document.getElementById('backup-data');
            const restoreDataBtn = document.getElementById('restore-data');
            
            // Nút sao lưu dữ liệu
            if (backupDataBtn) {
                backupDataBtn.addEventListener('click', () => {
                    this.backupData();
                });
            }
            
            // Nút khôi phục dữ liệu
            if (restoreDataBtn) {
                restoreDataBtn.addEventListener('click', () => {
                    this.restoreData();
                });
            }
        },
        
        // Sao lưu dữ liệu
        backupData: function() {
            console.log('Backing up data');
            
            // Hiển thị modal loading
            Utils.showModal('loading-modal', {
                message: 'Đang sao lưu dữ liệu...'
            });
            
            // Thu thập dữ liệu
            const data = {
                character: Storage.load(CONFIG.CHARACTER.STORAGE_KEY),
                messages: Storage.load(CONFIG.CHAT.STORAGE_KEY),
                diary: Storage.load(CONFIG.DIARY.STORAGE_KEY),
                timestamp: Date.now()
            };
            
            // Chuyển đổi thành JSON
            const jsonData = JSON.stringify(data);
            
            // Trong chế độ mô phỏng hoặc khi gapi không khả dụng
            if (typeof gapi === 'undefined' || !gapi.client || !gapi.client.drive) {
                console.log('Using mock backup');
                
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
                
                // Đóng modal loading
                Utils.hideModal('loading-modal');
                
                // Hiển thị thông báo thành công
                Utils.showModal('alert-modal', {
                    title: 'Sao lưu thành công',
                    message: 'Dữ liệu đã được sao lưu thành công. Tệp sao lưu đã được tải xuống.'
                });
                
                return;
            }
            
            // Sử dụng Google Drive API để sao lưu
            gapi.client.drive.files.create({
                resource: {
                    name: `nguoi-yeu-ao-backup-${new Date().toISOString().slice(0, 10)}.json`,
                    mimeType: 'application/json'
                },
                media: {
                    mimeType: 'application/json',
                    body: jsonData
                }
            }).then(response => {
                console.log('Backup successful:', response);
                
                // Đóng modal loading
                Utils.hideModal('loading-modal');
                
                // Hiển thị thông báo thành công
                Utils.showModal('alert-modal', {
                    title: 'Sao lưu thành công',
                    message: 'Dữ liệu đã được sao lưu thành công lên Google Drive.'
                });
            }).catch(error => {
                console.error('Error backing up data:', error);
                
                // Đóng modal loading
                Utils.hideModal('loading-modal');
                
                // Hiển thị thông báo lỗi
                Utils.showModal('alert-modal', {
                    title: 'Lỗi sao lưu',
                    message: 'Không thể sao lưu dữ liệu. Vui lòng thử lại sau.'
                });
            });
        },
        
        // Khôi phục dữ liệu
        restoreData: function() {
            console.log('Restoring data');
            
            // Trong chế độ mô phỏng hoặc khi gapi không khả dụng
            if (typeof gapi === 'undefined' || !gapi.client || !gapi.client.drive) {
                console.log('Using mock restore');
                
                // Tạo input file để chọn tệp
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'application/json';
                
                input.onchange = e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    // Hiển thị modal loading
                    Utils.showModal('loading-modal', {
                        message: 'Đang khôi phục dữ liệu...'
                    });
                    
                    const reader = new FileReader();
                    reader.onload = event => {
                        try {
                            const data = JSON.parse(event.target.result);
                            
                            // Khôi phục dữ liệu
                            if (data.character) Storage.save(CONFIG.CHARACTER.STORAGE_KEY, data.character);
                            if (data.messages) Storage.save(CONFIG.CHAT.STORAGE_KEY, data.messages);
                            if (data.diary) Storage.save(CONFIG.DIARY.STORAGE_KEY, data.diary);
                            
                            // Đóng modal loading
                            Utils.hideModal('loading-modal');
                            
                            // Hiển thị thông báo thành công
                            Utils.showModal('alert-modal', {
                                title: 'Khôi phục thành công',
                                message: 'Dữ liệu đã được khôi phục thành công. Trang sẽ được tải lại.',
                                onClose: () => {
                                    window.location.reload();
                                }
                            });
                        } catch (error) {
                            console.error('Error parsing backup file:', error);
                            
                            // Đóng modal loading
                            Utils.hideModal('loading-modal');
                            
                            // Hiển thị thông báo lỗi
                            Utils.showModal('alert-modal', {
                                title: 'Lỗi khôi phục',
                                message: 'Tệp sao lưu không hợp lệ. Vui lòng chọn tệp sao lưu khác.'
                            });
                        }
                    };
                    
                    reader.readAsText(file);
                };
                
                input.click();
                return;
            }
            
            // Hiển thị modal loading
            Utils.showModal('loading-modal', {
                message: 'Đang tìm kiếm tệp sao lưu...'
            });
            
            // Tìm kiếm tệp sao lưu trên Google Drive
            gapi.client.drive.files.list({
                q: "name contains 'nguoi-yeu-ao-backup' and mimeType = 'application/json'",
                spaces: 'drive',
                fields: 'files(id, name, createdTime)'
            }).then(response => {
                // Đóng modal loading
                Utils.hideModal('loading-modal');
                
                const files = response.result.files;
                if (files && files.length > 0) {
                    // Sắp xếp tệp theo thời gian tạo, mới nhất đầu tiên
                    files.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
                    
                    // Hiển thị danh sách tệp sao lưu
                    let fileListHTML = '<ul class="backup-file-list">';
                    files.forEach(file => {
                        const date = new Date(file.createdTime).toLocaleString();
                        fileListHTML += `<li data-file-id="${file.id}">${file.name} (${date})</li>`;
                    });
                    fileListHTML += '</ul>';
                    
                    // Hiển thị modal xác nhận
                    Utils.showModal('confirm-modal', {
                        title: 'Chọn tệp sao lưu',
                        message: `Vui lòng chọn tệp sao lưu để khôi phục:${fileListHTML}`,
                        customButtons: true,
                        onCustomAction: () => {
                            // Lấy file ID đã chọn
                            const selectedLi = document.querySelector('.backup-file-list li.selected');
                            if (!selectedLi) {
                                Utils.showModal('alert-modal', {
                                    title: 'Lỗi',
                                    message: 'Vui lòng chọn một tệp sao lưu.'
                                });
                                return;
                            }
                            
                            const fileId = selectedLi.getAttribute('data-file-id');
                            this.downloadAndRestoreBackup(fileId);
                        }
                    });
                    
                    // Thêm sự kiện click cho các mục trong danh sách
                    const fileItems = document.querySelectorAll('.backup-file-list li');
                    fileItems.forEach(item => {
                        item.addEventListener('click', () => {
                            // Xóa lớp selected từ tất cả các mục
                            fileItems.forEach(i => i.classList.remove('selected'));
                            // Thêm lớp selected cho mục đã chọn
                            item.classList.add('selected');
                        });
                    });
                } else {
                    Utils.showModal('alert-modal', {
                        title: 'Không tìm thấy sao lưu',
                        message: 'Không tìm thấy tệp sao lưu nào trên Google Drive.'
                    });
                }
            }).catch(error => {
                console.error('Error listing backup files:', error);
                
                // Đóng modal loading
                Utils.hideModal('loading-modal');
                
                // Hiển thị thông báo lỗi
                Utils.showModal('alert-modal', {
                    title: 'Lỗi tìm kiếm',
                    message: 'Không thể tìm kiếm tệp sao lưu. Vui lòng thử lại sau.'
                });
            });
        },
        
        // Tải xuống và khôi phục sao lưu
        downloadAndRestoreBackup: function(fileId) {
            console.log('Downloading and restoring backup:', fileId);
            
            // Hiển thị modal loading
            Utils.showModal('loading-modal', {
                message: 'Đang khôi phục dữ liệu...'
            });
            
            // Tải xuống tệp sao lưu
            gapi.client.drive.files.get({
                fileId: fileId,
                alt: 'media'
            }).then(response => {
                try {
                    const data = response.result;
                    
                    // Khôi phục dữ liệu
                    if (data.character) Storage.save(CONFIG.CHARACTER.STORAGE_KEY, data.character);
                    if (data.messages) Storage.save(CONFIG.CHAT.STORAGE_KEY, data.messages);
                    if (data.diary) Storage.save(CONFIG.DIARY.STORAGE_KEY, data.diary);
                    
                    // Đóng modal loading
                    Utils.hideModal('loading-modal');
                    
                    // Hiển thị thông báo thành công
                    Utils.showModal('alert-modal', {
                        title: 'Khôi phục thành công',
                        message: 'Dữ liệu đã được khôi phục thành công. Trang sẽ được tải lại.',
                        onClose: () => {
                            window.location.reload();
                        }
                    });
                } catch (error) {
                    console.error('Error parsing backup file:', error);
                    
                    // Đóng modal loading
                    Utils.hideModal('loading-modal');
                    
                    // Hiển thị thông báo lỗi
                    Utils.showModal('alert-modal', {
                        title: 'Lỗi khôi phục',
                        message: 'Tệp sao lưu không hợp lệ. Vui lòng chọn tệp sao lưu khác.'
                    });
                }
            }).catch(error => {
                console.error('Error downloading backup file:', error);
                
                // Đóng modal loading
                Utils.hideModal('loading-modal');
                
                // Hiển thị thông báo lỗi
                Utils.showModal('alert-modal', {
                    title: 'Lỗi tải xuống',
                    message: 'Không thể tải xuống tệp sao lưu. Vui lòng thử lại sau.'
                });
            });
        }
    };
    
    // Ghi đè GoogleAPI object
    window.GoogleAPI = GoogleAPIEnhanced;
}

// 4. Thêm tính năng biểu tượng cảm xúc và gửi ảnh trong chat
function addChatEnhancements() {
    console.log('Adding chat enhancements with emojis and images');
    
    // Thêm CSS cho tính năng mới
    addEnhancedChatStyles();
    
    // Thêm nút biểu tượng cảm xúc và tải lên ảnh vào khung chat
    addChatButtons();
    
    // Cải thiện chức năng chat để hỗ trợ biểu tượng cảm xúc và ảnh
    enhanceChatFunctionality();
}

// Thêm CSS cho tính năng mới
function addEnhancedChatStyles() {
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
            background-color: var(--primary-color);
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
}

// Thêm nút biểu tượng cảm xúc và tải lên ảnh vào khung chat
function addChatButtons() {
    // Tìm khung chat input
    const chatInput = document.querySelector('.chat-input');
    if (!chatInput) return;
    
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
    
    // Thêm vào trước textarea
    const messageInput = chatInput.querySelector('#message-input');
    if (messageInput) {
        chatInput.insertBefore(chatButtons, messageInput);
    }
    
    // Tạo emoji picker
    createEmojiPicker(chatInput, messageInput);
    
    // Thêm sự kiện cho nút tải lên ảnh
    imageButton.addEventListener('click', () => {
        imageUpload.click();
    });
    
    // Xử lý khi chọn ảnh
    imageUpload.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Kiểm tra kích thước file (tối đa 5MB)
            if (file.size > 5 * 1024 * 1024) {
                Utils.showModal('alert-modal', {
                    title: 'Lỗi',
                    message: 'Kích thước ảnh không được vượt quá 5MB.'
                });
                return;
            }
            
            // Kiểm tra loại file
            if (!file.type.startsWith('image/')) {
                Utils.showModal('alert-modal', {
                    title: 'Lỗi',
                    message: 'Vui lòng chọn file ảnh.'
                });
                return;
            }
            
            // Đọc file dưới dạng Data URL
            const reader = new FileReader();
            reader.onload = (event) => {
                // Gửi ảnh
                Chat.sendImage(event.target.result);
                
                // Reset input file
                imageUpload.value = '';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Tạo modal xem trước ảnh
    createImagePreviewModal();
}

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
        },
        {
            name: 'Động vật & Thiên nhiên',
            emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔', '🐾', '🐉', '🐲', '🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🎍', '🎋', '🍃', '🍂', '🍁', '🍄', '🌾', '💐', '🌷', '🌹', '🥀', '🌺', '🌸', '🌼', '🌻', '🌞', '🌝', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌎', '🌍', '🌏', '🪐', '💫', '⭐', '🌟', '✨', '⚡', '☄️', '💥', '🔥', '🌪️', '🌈', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '💧', '💦', '☔', '☂️', '🌊', '🌫️']
        },
        {
            name: 'Thức ăn & Đồ uống',
            emojis: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🍵', '🧃', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄', '🍴', '🍽️', '🥣', '🥡', '🥢', '🧂']
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
            emojiItem.addEventListener('click', () => {
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
        emojiButton.addEventListener('click', () => {
            emojiPicker.classList.toggle('active');
        });
    }
    
    // Đóng emoji picker khi click bên ngoài
    document.addEventListener('click', (e) => {
        if (!emojiButton.contains(e.target) && !emojiPicker.contains(e.target)) {
            emojiPicker.classList.remove('active');
        }
    });
}

// Tạo modal xem trước ảnh
function createImagePreviewModal() {
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
    closeButton.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Thêm sự kiện click bên ngoài để đóng
    modal.addEventListener('click', (e) => {
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

// Cải thiện chức năng chat để hỗ trợ biểu tượng cảm xúc và ảnh
function enhanceChatFunctionality() {
    // Thêm phương thức gửi ảnh vào Chat object
    Chat.sendImage = function(imageData) {
        // Kiểm tra xem đã có nhân vật chưa
        if (!Character.isCreated()) {
            Utils.showModal('alert-modal', {
                title: 'Chưa có nhân vật',
                message: 'Vui lòng tạo nhân vật trước khi gửi tin nhắn.'
            });
            return;
        }
        
        // Tạo tin nhắn mới
        const message = {
            sender: 'user',
            content: '',
            imageData: imageData,
            timestamp: Date.now()
        };
        
        // Thêm tin nhắn vào lịch sử
        this.addMessage('user', '', imageData);
        
        // Lưu tin nhắn vào storage
        this.saveMessages();
        
        // Tăng mức độ thân thiết
        Character.increaseIntimacy(1);
        
        // Tạo phản hồi từ nhân vật
        this.generateResponse('Người dùng đã gửi một hình ảnh.');
    };
    
    // Ghi đè phương thức renderMessage để hỗ trợ hiển thị ảnh
    const originalRenderMessage = Chat.renderMessage;
    Chat.renderMessage = function(message) {
        // Nếu tin nhắn có ảnh
        if (message.imageData) {
            const chatMessages = document.getElementById('chat-messages');
            
            // Tạo phần tử tin nhắn
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', message.sender);
            
            // Định dạng timestamp
            const timestamp = new Date(message.timestamp);
            const formattedTime = Utils.formatDate(timestamp);
            
            // Nội dung HTML
            let contentHTML = '';
            
            // Thêm nội dung tin nhắn nếu có
            if (message.content) {
                contentHTML += `<div class="message-content">${Utils.linkify(Utils.escapeHtml(message.content))}</div>`;
            }
            
            // Thêm ảnh
            contentHTML += `<img src="${message.imageData}" alt="Ảnh" class="message-image">`;
            
            // Đặt HTML
            messageElement.innerHTML = `
                ${contentHTML}
                <span class="message-time">${formattedTime}</span>
            `;
            
            // Thêm vào container chat
            chatMessages.appendChild(messageElement);
            
            // Thêm sự kiện click cho ảnh
            const imageElement = messageElement.querySelector('.message-image');
            if (imageElement) {
                imageElement.addEventListener('click', () => {
                    window.openImagePreview(message.imageData);
                });
            }
            
            // Cuộn xuống dưới
            this.scrollToBottom();
        } else {
            // Sử dụng phương thức gốc cho tin nhắn không có ảnh
            originalRenderMessage.call(this, message);
        }
    };
    
    // Ghi đè phương thức addMessage để hỗ trợ tin nhắn có ảnh
    const originalAddMessage = Chat.addMessage;
    Chat.addMessage = function(sender, content, imageData) {
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
        this.messages.push(message);
        
        // Hiển thị tin nhắn
        this.renderMessage(message);
        
        // Lưu tin nhắn vào storage
        this.saveMessages();
    };
}

// 5. Thêm trang giới thiệu
function addIntroductionPage() {
    console.log('Adding introduction page');
    
    // Thêm mục menu "Giới thiệu"
    addIntroductionMenuItem();
    
    // Tạo nội dung trang giới thiệu
    createIntroductionContent();
}

// Thêm mục menu "Giới thiệu"
function addIntroductionMenuItem() {
    // Tìm menu
    const navMenu = document.querySelector('.nav-menu ul');
    if (!navMenu) return;
    
    // Tạo mục menu mới
    const introMenuItem = document.createElement('li');
    introMenuItem.setAttribute('data-tab', 'intro-tab');
    introMenuItem.innerHTML = '<i class="fas fa-info-circle"></i> Giới thiệu';
    
    // Thêm vào menu (trước mục Cài đặt)
    const settingsMenuItem = navMenu.querySelector('li[data-tab="settings-tab"]');
    if (settingsMenuItem) {
        navMenu.insertBefore(introMenuItem, settingsMenuItem);
    } else {
        navMenu.appendChild(introMenuItem);
    }
}

// Tạo nội dung trang giới thiệu
function createIntroductionContent() {
    // Tìm main-content
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    // Tạo tab content mới
    const introTab = document.createElement('div');
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
    
    // Thêm vào main-content
    mainContent.appendChild(introTab);
    
    // Thêm CSS cho trang giới thiệu
    addIntroductionStyles();
}

// Thêm CSS cho trang giới thiệu
function addIntroductionStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Styles for introduction page */
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
            color: var(--primary-color);
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
            background-color: var(--primary-color);
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
            color: var(--primary-dark);
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
            border-left: 4px solid var(--secondary-color);
        }
        
        .guide-step h4 {
            margin-top: 0;
            color: var(--secondary-color);
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
}

// Thêm hàm để khởi tạo tất cả các bản sửa lỗi và tính năng mới khi trang tải
document.addEventListener('DOMContentLoaded', function() {
    // Đảm bảo hàm được gọi sau khi các module khác đã được khởi tạo
    setTimeout(applyAllFixesAndEnhancements, 500);
});

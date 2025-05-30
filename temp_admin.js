// 鑾峰彇褰撳墠椤甸潰URL鐨勫弬鏁?
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

document.addEventListener('DOMContentLoaded', function() {
    // 渚ц竟鏍忓垏鎹?
    document.getElementById('toggle-sidebar').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('collapsed');
        document.querySelector('.main-content').classList.toggle('expanded');
    });
    
    // Tab婵€娲诲鐞?
    var activeTab = getUrlParameter('tab');
    if (activeTab) {
        var tabEl = document.querySelector('a[href="#' + activeTab + '"]');
        if (tabEl) {
            var tab = new bootstrap.Tab(tabEl);
            tab.show();
        }
    }
    
    // 鍒犻櫎纭澶勭悊
    document.querySelectorAll('.delete-vote-btn, .delete-product-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('鎮ㄧ‘瀹氳鍒犻櫎杩欎釜椤圭洰鍚楋紵姝ゆ搷浣滄棤娉曟挙閿€銆?)) {
                // 杩欓噷娣诲姞鍒犻櫎鎿嶄綔鐨勪唬鐮?
                alert('鍒犻櫎鎴愬姛锛?);
            }
        });
    });
    
    // 琛ㄥ崟鎻愪氦澶勭悊
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('鎿嶄綔鎴愬姛锛?);
        });
    });
    
    // 鍥剧墖棰勮鍔熻兘
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                var previewContainer = e.target.parentNode.querySelector('.image-preview-container') || 
                                      e.target.parentNode.querySelector('.edit-image-preview');
                
                if (previewContainer) {
                    previewContainer.innerHTML = '';
                    var img = document.createElement('img');
                    img.classList.add('img-preview');
                    img.file = e.target.files[0];
                    previewContainer.appendChild(img);
                    
                    var reader = new FileReader();
                    reader.onload = (function(aImg) { 
                        return function(e) { 
                            aImg.src = e.target.result; 
                        }; 
                    })(img);
                    reader.readAsDataURL(e.target.files[0]);
                }
            }
        });
    });
    
    // 鎵归噺鎿嶄綔checkboxes
    var selectAllCheckbox = document.getElementById('select-all-exchanges');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            var isChecked = this.checked;
            document.querySelectorAll('#exchange-table tbody input[type="checkbox"]').forEach(cb => {
                cb.checked = isChecked;
            });
            
            document.getElementById('bulk-action-btn').disabled = !isChecked;
            if (isChecked) {
                document.getElementById('bulk-action-options').classList.remove('d-none');
            } else {
                document.getElementById('bulk-action-options').classList.add('d-none');
            }
        });
        
        document.querySelectorAll('#exchange-table tbody input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', function() {
                var anyChecked = false;
                document.querySelectorAll('#exchange-table tbody input[type="checkbox"]').forEach(c => {
                    if (c.checked) anyChecked = true;
                });
                
                document.getElementById('bulk-action-btn').disabled = !anyChecked;
                if (anyChecked) {
                    document.getElementById('bulk-action-options').classList.remove('d-none');
                } else {
                    document.getElementById('bulk-action-options').classList.add('d-none');
                }
            });
        });
    }
    
    // 鎶曠エ鏌ョ湅鎸夐挳
    document.querySelectorAll('.view-vote-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            var voteId = this.getAttribute('data-vote-id');
            var modal = new bootstrap.Modal(document.getElementById('vote-details-modal'));
            modal.show();
        });
    });
    
    // 鐢ㄦ埛绠＄悊缂栬緫鍔熻兘
    document.querySelectorAll('#user-management .btn-outline-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            // 鑾峰彇褰撳墠琛屾暟鎹?
            const row = this.closest('tr');
            const cells = row.querySelectorAll('td');
            
            // 鑾峰彇鐢ㄦ埛鏁版嵁
            const userId = cells[0].textContent;
            const userName = cells[1].textContent;
            const userDepartment = cells[2].textContent;
            const userWorkId = cells[3].textContent;
            const userBalance = cells[4].textContent;
            const userRole = cells[5].querySelector('.badge') ? cells[5].querySelector('.badge').textContent : '鏅€氱敤鎴?;
            const userStatus = cells[6].querySelector('.badge') ? cells[6].querySelector('.badge').textContent : '姝ｅ父';
            
            // 濉厖妯℃€佹琛ㄥ崟
            document.getElementById('edit-user-id').value = userId;
            document.getElementById('edit-user-name').value = userName;
            document.getElementById('edit-user-department').value = userDepartment;
            document.getElementById('edit-user-workid').value = userWorkId;
            document.getElementById('edit-user-balance').value = userBalance;
            document.getElementById('edit-user-role').value = userRole;
            document.getElementById('edit-user-status').value = userStatus;
            
            // 鏄剧ず妯℃€佹
            const modal = new bootstrap.Modal(document.getElementById('edit-user-modal'));
            modal.show();
        });
    });
    
    // 鐢ㄦ埛妯℃€佹淇濆瓨鎸夐挳
    document.getElementById('save-user-btn').addEventListener('click', function() {
        // 鑾峰彇琛ㄥ崟鏁版嵁
        const userId = document.getElementById('edit-user-id').value;
        const userName = document.getElementById('edit-user-name').value;
        const userDepartment = document.getElementById('edit-user-department').value;
        const userWorkId = document.getElementById('edit-user-workid').value;
        const userBalance = document.getElementById('edit-user-balance').value;
        const userRole = document.getElementById('edit-user-role').value;
        const userStatus = document.getElementById('edit-user-status').value;
        
        // 鎵惧埌瀵瑰簲鐨勭敤鎴疯
        const userRows = document.querySelectorAll('#user-management tbody tr');
        let targetRow = null;
        
        userRows.forEach(row => {
            if (row.querySelector('td').textContent === userId) {
                targetRow = row;
            }
        });
        
        if (targetRow) {
            // 鏇存柊琛屽唴瀹?
            const cells = targetRow.querySelectorAll('td');
            cells[1].textContent = userName;
            cells[2].textContent = userDepartment;
            cells[3].textContent = userWorkId;
            cells[4].textContent = userBalance;
            
            // 鏇存柊瑙掕壊鏍囩
            const roleClass = userRole === '绠＄悊鍛? ? 'bg-danger' : 'bg-secondary';
            cells[5].innerHTML = `<span class="badge ${roleClass}">${userRole}</span>`;
            
            // 鏇存柊鐘舵€佹爣绛?
            const statusClass = userStatus === '姝ｅ父' ? 'bg-success' : (userStatus === '璇峰亣涓? ? 'bg-warning' : 'bg-danger');
            cells[6].innerHTML = `<span class="badge ${statusClass}">${userStatus}</span>`;
            
            // 鍏抽棴妯℃€佹
            bootstrap.Modal.getInstance(document.getElementById('edit-user-modal')).hide();
        }
    });
    
    // 鐗硅壊灏忓悆鑿滃搧鍜岄鍒稿晢鍝佺殑缂栬緫鍔熻兘
    setupItemEditing();
});

// 璁剧疆鑿滃搧鍜屽晢鍝佺殑缂栬緫鍔熻兘
function setupItemEditing() {
    // 鑿滃搧缂栬緫鎸夐挳
    document.querySelectorAll('#dish-table-body .btn-outline-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const cells = row.querySelectorAll('td');
            
            // 鑾峰彇鑿滃搧鏁版嵁
            const imgSrc = cells[0].querySelector('img').src;
            const dishName = cells[1].textContent;
            const dishType = cells[2].querySelector('.badge').textContent;
            const dishPrice = cells[3].textContent.replace('楼', '');
            const isVotable = cells[4].querySelector('.badge').textContent === '鍙姇绁?;
            
            // 濉厖妯℃€佹琛ㄥ崟
            document.querySelector('#edit-dish-modal .edit-image-preview img').src = imgSrc;
            document.getElementById('edit-dish-name').value = dishName;
            document.getElementById('edit-dish-type').value = dishType;
            document.getElementById('edit-dish-price').value = dishPrice;
            document.getElementById('edit-dish-votable').checked = isVotable;
            
            // 鏄剧ず妯℃€佹
            const modal = new bootstrap.Modal(document.getElementById('edit-dish-modal'));
            modal.show();
            
            // 淇濆瓨鎸夐挳浜嬩欢
            const saveBtn = document.getElementById('save-dish-btn');
            // 绉婚櫎涔嬪墠鐨勪簨浠剁洃鍚櫒锛堝鏋滃瓨鍦級
            const oldSaveHandler = saveBtn.getAttribute('data-save-handler');
            if (oldSaveHandler && window[oldSaveHandler]) {
                saveBtn.removeEventListener('click', window[oldSaveHandler]);
            }
            
            // 淇濆瓨鎸夐挳浜嬩欢澶勭悊鍑芥暟
            function saveHandler() {
                // 鑾峰彇琛ㄥ崟鏁版嵁
                const newImgSrc = document.querySelector('#edit-dish-modal .edit-image-preview img').src;
                const newName = document.getElementById('edit-dish-name').value;
                const newType = document.getElementById('edit-dish-type').value;
                const newPrice = document.getElementById('edit-dish-price').value;
                const newVotable = document.getElementById('edit-dish-votable').checked;
                
                // 鏇存柊琛屽唴瀹?
                cells[0].querySelector('img').src = newImgSrc;
                cells[1].textContent = newName;
                
                // 鏇存柊绫诲瀷鏍囩
                const typeClass = newType === '鐗硅壊灏忓悆' ? 'bg-info' : 'bg-primary';
                cells[2].innerHTML = `<span class="badge ${typeClass}">${newType}</span>`;
                
                // 鏇存柊浠锋牸
                cells[3].textContent = `楼${newPrice}`;
                
                // 鏇存柊鎶曠エ鐘舵€?
                const votableClass = newVotable ? 'bg-success' : 'bg-secondary';
                const votableText = newVotable ? '鍙姇绁? : '涓嶅彲鎶曠エ';
                cells[4].innerHTML = `<span class="badge ${votableClass}">${votableText}</span>`;
                
                // 鍏抽棴妯℃€佹
                bootstrap.Modal.getInstance(document.getElementById('edit-dish-modal')).hide();
                
                // 绉婚櫎浜嬩欢鐩戝惉鍣紝闃叉閲嶅缁戝畾
                saveBtn.removeEventListener('click', saveHandler);
            }
            
            // 淇濆瓨鍑芥暟寮曠敤鍒板叏灞€浣滅敤鍩燂紝渚夸簬鍚庣画绉婚櫎
            const handlerName = 'dishSaveHandler_' + Date.now();
            window[handlerName] = saveHandler;
            saveBtn.setAttribute('data-save-handler', handlerName);
            
            // 娣诲姞鏂扮殑浜嬩欢鐩戝惉鍣?
            saveBtn.addEventListener('click', saveHandler);
        });
    });
    
    // 鍟嗗搧缂栬緫鎸夐挳
    document.querySelectorAll('#product-table-body .btn-outline-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            
            // 鏄剧ず缂栬緫妯℃€佹
            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('edit-product-modal'));
            modal.show();
        });
    });
}

// 鍒涘缓鑿滃搧缂栬緫妯℃€佹
function createEditDishModal(imgSrc, name, type, category, price, isVotable, row) {
    // 妫€鏌ユ槸鍚﹀凡瀛樺湪妯℃€佹锛屽鏋滃瓨鍦ㄥ垯绉婚櫎
    let editModal = document.getElementById('edit-dish-modal');
    if (editModal) {
        editModal.remove();
    }
    
    // 鍒涘缓妯℃€佹HTML
    const modalHTML = `
    <div class="modal fade" id="edit-dish-modal" tabindex="-1" aria-labelledby="edit-dish-modal-label" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="edit-dish-modal-label">缂栬緫鑿滃搧</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="edit-dish-form">
                        <div class="mb-3 text-center">
                            <div class="edit-image-preview mb-2">
                                <img src="${imgSrc}" alt="${name}" class="img-thumbnail" style="width: 100px; height: 100px;">
                            </div>
                            <small class="text-muted">鐐瑰嚮鍥剧墖涓婁紶鏂板浘鐗?/small>
                        </div>
                        <div class="mb-3">
                            <label for="edit-dish-name" class="form-label">鑿滃搧鍚嶇О</label>
                            <input type="text" class="form-control" id="edit-dish-name" value="${name}" required>
                        </div>
                        <div class="mb-3">
                            <label for="edit-dish-type" class="form-label">鑿滃搧绫诲瀷</label>
                            <select class="form-select" id="edit-dish-type" required>
                                <option value="鐗硅壊灏忓悆" ${type === '鐗硅壊灏忓悆' ? 'selected' : ''}>鐗硅壊灏忓悆</option>
                                <option value="涓婚" ${type === '涓婚' ? 'selected' : ''}>涓婚</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="edit-dish-category" class="form-label">鑿滃搧鍒嗙被</label>
                            <select class="form-select" id="edit-dish-category" required>
                                <option value="鑲夌被" ${category === '鑲夌被' ? 'selected' : ''}>鑲夌被</option>
                                <option value="钄彍" ${category === '钄彍' ? 'selected' : ''}>钄彍</option>
                                <option value="娴烽矞" ${category === '娴烽矞' ? 'selected' : ''}>娴烽矞</option>
                                <option value="鐢滅偣" ${category === '鐢滅偣' ? 'selected' : ''}>鐢滅偣</option>
                                <option value="绫抽キ绫? ${category === '绫抽キ绫? ? 'selected' : ''}>绫抽キ绫?/option>
                                <option value="闈㈤绫? ${category === '闈㈤绫? ? 'selected' : ''}>闈㈤绫?/option>
                                <option value="鍏朵粬" ${category === '鍏朵粬' ? 'selected' : ''}>鍏朵粬</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="edit-dish-price" class="form-label">浠锋牸</label>
                            <input type="number" step="0.5" class="form-control" id="edit-dish-price" value="${price}" required>
                        </div>
                        <div class="mb-3">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="edit-dish-votable" ${isVotable ? 'checked' : ''}>
                                <label class="form-check-label" for="edit-dish-votable">鍙姇绁?/label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">鍙栨秷</button>
                    <button type="button" class="btn btn-primary" id="save-dish-btn">淇濆瓨</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // 灏嗘ā鎬佹娣诲姞鍒伴〉闈?
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 鏄剧ず妯℃€佹
    const modal = new bootstrap.Modal(document.getElementById('edit-dish-modal'));
    modal.show();
    
    // 淇濆瓨鎸夐挳浜嬩欢
    document.getElementById('save-dish-btn').addEventListener('click', function() {
        // 鑾峰彇琛ㄥ崟鏁版嵁
        const newName = document.getElementById('edit-dish-name').value;
        const newType = document.getElementById('edit-dish-type').value;
        const newCategory = document.getElementById('edit-dish-category').value;
        const newPrice = document.getElementById('edit-dish-price').value;
        const newVotable = document.getElementById('edit-dish-votable').checked;
        
        // 鑾峰彇鍥剧墖
        const newImgSrc = document.querySelector('.edit-image-preview img').src;
        
        // 鏇存柊琛屾暟鎹?
        const cells = row.querySelectorAll('td');
        cells[0].querySelector('img').src = newImgSrc;
        cells[1].textContent = newName;
        
        const typeClass = newType === '鐗硅壊灏忓悆' ? 'bg-info' : 'bg-primary';
        cells[2].innerHTML = `<span class="badge ${typeClass}">${newType}</span>`;
        
        cells[3].textContent = newCategory;
        cells[4].textContent = `楼${newPrice}`;
        
        const votableClass = newVotable ? 'bg-success' : 'bg-secondary';
        const votableText = newVotable ? '鍙姇绁? : '涓嶅彲鎶曠エ';
        cells[5].innerHTML = `<span class="badge ${votableClass}">${votableText}</span>`;
        
        // 鍏抽棴妯℃€佹
        modal.hide();
    });
}

// 鍒涘缓鍟嗗搧缂栬緫妯℃€佹
function createEditProductModal(imgSrc, name, type, category, price, stock, row) {
    // 妫€鏌ユ槸鍚﹀凡瀛樺湪妯℃€佹锛屽鏋滃瓨鍦ㄥ垯绉婚櫎
    let editModal = document.getElementById('edit-product-modal');
    if (editModal) {
        editModal.remove();
    }
    
    // 鍒涘缓妯℃€佹HTML
    const modalHTML = `
    <div class="modal fade" id="edit-product-modal" tabindex="-1" aria-labelledby="edit-product-modal-label" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="edit-product-modal-label">缂栬緫鍟嗗搧</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="edit-product-form">
                        <div class="mb-3 text-center">
                            <div class="edit-image-preview mb-2">
                                <img src="${imgSrc}" alt="${name}" class="img-thumbnail" style="width: 100px; height: 100px;">
                            </div>
                            <small class="text-muted">鐐瑰嚮鍥剧墖涓婁紶鏂板浘鐗?/small>
                        </div>
                        <div class="mb-3">
                            <label for="edit-product-name" class="form-label">鍟嗗搧鍚嶇О</label>
                            <input type="text" class="form-control" id="edit-product-name" value="${name}" required>
                        </div>
                        <div class="mb-3">
                            <label for="edit-product-type" class="form-label">鍟嗗搧绫诲瀷</label>
                            <select class="form-select" id="edit-product-type" required>
                                <option value="瀹炵墿鍟嗗搧" ${type === '瀹炵墿鍟嗗搧' ? 'selected' : ''}>瀹炵墿鍟嗗搧</option>
                                <option value="椁愬巺鑿滃搧" ${type === '椁愬巺鑿滃搧' ? 'selected' : ''}>椁愬巺鑿滃搧</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="edit-product-category" class="form-label">鍟嗗搧鍒嗙被</label>
                            <select class="form-select" id="edit-product-category" required>
                                <option value="涓婚" ${category === '涓婚' ? 'selected' : ''}>涓婚</option>
                                <option value="鑲夌被" ${category === '鑲夌被' ? 'selected' : ''}>鑲夌被</option>
                                <option value="钄彍" ${category === '钄彍' ? 'selected' : ''}>钄彍</option>
                                <option value="鐗硅壊灏忓悆" ${category === '鐗硅壊灏忓悆' ? 'selected' : ''}>鐗硅壊灏忓悆</option>
                                <option value="鏃ョ敤鍝? ${category === '鏃ョ敤鍝? ? 'selected' : ''}>鏃ョ敤鍝?/option>
                                <option value="椋熺敤娌? ${category === '椋熺敤娌? ? 'selected' : ''}>椋熺敤娌?/option>
                                <option value="澶х背" ${category === '澶х背' ? 'selected' : ''}>澶х背</option>
                                <option value="鍏朵粬" ${category === '鍏朵粬' ? 'selected' : ''}>鍏朵粬</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="edit-product-price" class="form-label">浠锋牸</label>
                            <input type="number" step="0.5" class="form-control" id="edit-product-price" value="${price}" required>
                        </div>
                        <div class="mb-3">
                            <label for="edit-product-stock" class="form-label">搴撳瓨</label>
                            <input type="number" class="form-control" id="edit-product-stock" value="${stock}" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">鍙栨秷</button>
                    <button type="button" class="btn btn-primary" id="save-product-btn">淇濆瓨</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // 灏嗘ā鎬佹娣诲姞鍒伴〉闈?
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 鏄剧ず妯℃€佹
    const modal = new bootstrap.Modal(document.getElementById('edit-product-modal'));
    modal.show();
    
    // 淇濆瓨鎸夐挳浜嬩欢
    document.getElementById('save-product-btn').addEventListener('click', function() {
        // 鑾峰彇琛ㄥ崟鏁版嵁
        const newName = document.getElementById('edit-product-name').value;
        const newType = document.getElementById('edit-product-type').value;
        const newCategory = document.getElementById('edit-product-category').value;
        const newPrice = document.getElementById('edit-product-price').value;
        const newStock = document.getElementById('edit-product-stock').value;
        
        // 鑾峰彇鍥剧墖
        const newImgSrc = document.querySelector('.edit-image-preview img').src;
        
        // 鏇存柊琛屾暟鎹?
        const cells = row.querySelectorAll('td');
        cells[0].querySelector('img').src = newImgSrc;
        cells[1].textContent = newName;
        
        const typeClass = newType === '瀹炵墿鍟嗗搧' ? 'bg-info' : 'bg-primary';
        cells[2].innerHTML = `<span class="badge ${typeClass}">${newType}</span>`;
        
        cells[3].textContent = newCategory;
        cells[4].textContent = `楼${newPrice}`;
        cells[5].textContent = newStock;
        
        // 鍏抽棴妯℃€佹
        modal.hide();
    });
}

// 鍥剧墖涓婁紶鍔熻兘
document.addEventListener('DOMContentLoaded', function() {
    // 澶勭悊鍥剧墖涓婁紶鐩稿叧鍔熻兘
    setupImageUploads();
    
    // 鍒濆鍖栫紪杈戝姛鑳?
    setupEditFunctions();
});

// 璁剧疆鍥剧墖涓婁紶鍔熻兘
function setupImageUploads() {
    // 缁熶竴澶勭悊涓婁紶鍗犱綅绗︾偣鍑讳簨浠?
    document.querySelectorAll('.upload-placeholder').forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            // 鍒涘缓涓€涓殣钘忕殑鏂囦欢杈撳叆妗?
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            
            // 瑙﹀彂鏂囦欢閫夋嫨瀵硅瘽妗?
            fileInput.click();
            
            // 澶勭悊鏂囦欢閫夋嫨
            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    const placeholderElement = placeholder;
                    
                    reader.onload = function(e) {
                        // 鏇挎崲鍗犱綅绗︿负鍥剧墖
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.alt = '涓婁紶鐨勫浘鐗?;
                        img.className = 'img-thumbnail';
                        img.style.width = '40px';
                        img.style.height = '40px';
                        
                        // 鏇挎崲鍗犱綅绗?
                        placeholderElement.parentNode.replaceChild(img, placeholderElement);
                    };
                    
                    // 璇诲彇鏂囦欢涓篋ataURL
                    reader.readAsDataURL(this.files[0]);
                }
                
                // 绉婚櫎涓存椂鍒涘缓鐨勬枃浠惰緭鍏ユ
                document.body.removeChild(fileInput);
            });
        });
    });
    
    // 澶勭悊缂栬緫妯″紡涓嬬殑鍥剧墖涓婁紶
    document.querySelectorAll('.edit-image-preview img').forEach(img => {
        img.style.cursor = 'pointer';
        img.title = '鐐瑰嚮鏇存崲鍥剧墖';
        
        img.addEventListener('click', function() {
            // 鍒涘缓涓€涓殣钘忕殑鏂囦欢杈撳叆妗?
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            
            // 瑙﹀彂鏂囦欢閫夋嫨瀵硅瘽妗?
            fileInput.click();
            
            // 澶勭悊鏂囦欢閫夋嫨
            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    const imgElement = img;
                    
                    reader.onload = function(e) {
                        // 鏇存柊鍥剧墖婧?
                        imgElement.src = e.target.result;
                    };
                    
                    // 璇诲彇鏂囦欢涓篋ataURL
                    reader.readAsDataURL(this.files[0]);
                }
                
                // 绉婚櫎涓存椂鍒涘缓鐨勬枃浠惰緭鍏ユ
                document.body.removeChild(fileInput);
            });
        });
    });
    
    // 澶勭悊宸叉湁鑿滃搧鍜屽晢鍝佽鐨勫浘鐗囩偣鍑?
    document.querySelectorAll('#dish-table-body img.img-thumbnail, #product-table-body img.img-thumbnail').forEach(img => {
        img.style.cursor = 'pointer';
        img.title = '鐐瑰嚮鏇存崲鍥剧墖';
        
        img.addEventListener('click', function() {
            // 鍒涘缓涓€涓殣钘忕殑鏂囦欢杈撳叆妗?
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            
            // 瑙﹀彂鏂囦欢閫夋嫨瀵硅瘽妗?
            fileInput.click();
            
            // 澶勭悊鏂囦欢閫夋嫨
            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    const imgElement = img;
                    
                    reader.onload = function(e) {
                        // 鏇存柊鍥剧墖婧?
                        imgElement.src = e.target.result;
                    };
                    
                    // 璇诲彇鏂囦欢涓篋ataURL
                    reader.readAsDataURL(this.files[0]);
                }
                
                // 绉婚櫎涓存椂鍒涘缓鐨勬枃浠惰緭鍏ユ
                document.body.removeChild(fileInput);
            });
        });
    });
}

// 璁剧疆缂栬緫鍔熻兘
function setupEditFunctions() {
    // 鐢ㄦ埛绠＄悊缂栬緫鎸夐挳
    document.querySelectorAll('#user-management .btn-outline-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            // 鑾峰彇褰撳墠琛屾暟鎹?
            const row = this.closest('tr');
            const cells = row.querySelectorAll('td');
            
            // 鑾峰彇鐢ㄦ埛鏁版嵁
            const userId = cells[0].textContent;
            const userName = cells[1].textContent;
            const userDepartment = cells[2].textContent;
            const userWorkId = cells[3].textContent;
            const userBalance = cells[4].textContent;
            const userRole = cells[5].querySelector('.badge') ? cells[5].querySelector('.badge').textContent : '鏅€氱敤鎴?;
            const userStatus = cells[6].querySelector('.badge') ? cells[6].querySelector('.badge').textContent : '姝ｅ父';
            
            // 濉厖妯℃€佹琛ㄥ崟
            document.getElementById('edit-user-id').value = userId;
            document.getElementById('edit-user-name').value = userName;
            document.getElementById('edit-user-department').value = userDepartment;
            document.getElementById('edit-user-workid').value = userWorkId;
            document.getElementById('edit-user-balance').value = userBalance;
            document.getElementById('edit-user-role').value = userRole;
            document.getElementById('edit-user-status').value = userStatus;
            
            // 鏄剧ず妯℃€佹
            const modal = new bootstrap.Modal(document.getElementById('edit-user-modal'));
            modal.show();
        });
    });
    
    // 鐢ㄦ埛妯℃€佹淇濆瓨鎸夐挳
    document.getElementById('save-user-btn').addEventListener('click', function() {
        // 鑾峰彇琛ㄥ崟鏁版嵁
        const userId = document.getElementById('edit-user-id').value;
        const userName = document.getElementById('edit-user-name').value;
        const userDepartment = document.getElementById('edit-user-department').value;
        const userWorkId = document.getElementById('edit-user-workid').value;
        const userBalance = document.getElementById('edit-user-balance').value;
        const userRole = document.getElementById('edit-user-role').value;
        const userStatus = document.getElementById('edit-user-status').value;
        
        // 鎵惧埌瀵瑰簲鐨勭敤鎴疯
        const userRows = document.querySelectorAll('#user-management tbody tr');
        let targetRow = null;
        
        userRows.forEach(row => {
            if (row.querySelector('td').textContent === userId) {
                targetRow = row;
            }
        });
        
        if (targetRow) {
            // 鏇存柊琛屽唴瀹?
            const cells = targetRow.querySelectorAll('td');
            cells[1].textContent = userName;
            cells[2].textContent = userDepartment;
            cells[3].textContent = userWorkId;
            cells[4].textContent = userBalance;
            
            // 鏇存柊瑙掕壊鏍囩
            const roleClass = userRole === '绠＄悊鍛? ? 'bg-danger' : 'bg-secondary';
            cells[5].innerHTML = `<span class="badge ${roleClass}">${userRole}</span>`;
            
            // 鏇存柊鐘舵€佹爣绛?
            const statusClass = userStatus === '姝ｅ父' ? 'bg-success' : (userStatus === '璇峰亣涓? ? 'bg-warning' : 'bg-danger');
            cells[6].innerHTML = `<span class="badge ${statusClass}">${userStatus}</span>`;
            
            // 鍏抽棴妯℃€佹
            bootstrap.Modal.getInstance(document.getElementById('edit-user-modal')).hide();
        }
    });
    
    // 鍟嗗搧缂栬緫鎸夐挳
    document.querySelectorAll('#product-table-body .btn-outline-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            
            // 鏄剧ず缂栬緫妯℃€佹
            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('edit-product-modal'));
            modal.show();
        });
    });
}

 

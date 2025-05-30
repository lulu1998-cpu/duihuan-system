// 获取URL参数的通用函数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 页面加载完成后初始化各种功能
document.addEventListener('DOMContentLoaded', function() {
    // 侧边栏切换
    document.getElementById('toggle-sidebar').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('collapsed');
        document.querySelector('.main-content').classList.toggle('expanded');
    });

    // Tab页面初始化
    var activeTab = getUrlParameter('tab');
    if (activeTab) {
        var tabEl = document.querySelector('a[href="#' + activeTab + '"]');
        if (tabEl) {
            var tab = new bootstrap.Tab(tabEl);
            tab.show();
        }
    }

    // 删除按钮确认
    document.querySelectorAll('.delete-vote-btn, .delete-product-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('确定要删除此项吗？此操作无法撤销。')) {
                // 这里应该是实际删除操作的代码
                alert('删除成功！');
            }
        });
    });

    // 表单提交处理
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('提交成功！');
        });
    });

    // 图片预览功能
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

    // 批量选择处理
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

    // 初始化菜品编辑功能
    setupDishEditing();
    
    // 初始化图片上传功能
    setupImageUploads();
    
    // 初始化用户编辑功能
    setupUserEditing();
    
    // 初始化商品管理功能
    setupProductEditing();
});

// 设置菜品编辑功能
function setupDishEditing() {
    // 为菜品编辑按钮添加点击事件
    document.querySelectorAll('#dish-table-body .btn-outline-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const cells = row.querySelectorAll('td');
            
            // 获取菜品数据
            const imgSrc = cells[0].querySelector('img').src;
            const dishName = cells[1].textContent;
            const dishType = cells[2].querySelector('.badge').textContent;
            const dishPrice = cells[3].textContent.replace('¥', '');
            const isVotable = cells[4].querySelector('.badge').textContent === '可投票';
            
            // 填充编辑模态框
            document.querySelector('#edit-dish-modal .edit-image-preview img').src = imgSrc;
            document.getElementById('edit-dish-name').value = dishName;
            document.getElementById('edit-dish-type').value = dishType;
            document.getElementById('edit-dish-price').value = dishPrice;
            document.getElementById('edit-dish-votable').checked = isVotable;
            
            // 显示模态框
            const modal = new bootstrap.Modal(document.getElementById('edit-dish-modal'));
            modal.show();
            
            // 绑定保存按钮事件
            const saveBtn = document.getElementById('save-dish-btn');
            
            // 移除之前的事件监听器（如果存在）
            const oldHandler = saveBtn.getAttribute('data-save-handler');
            if (oldHandler && window[oldHandler]) {
                saveBtn.removeEventListener('click', window[oldHandler]);
            }
            
            // 保存事件处理函数
            function saveHandler() {
                // 获取表单数据
                const newImgSrc = document.querySelector('#edit-dish-modal .edit-image-preview img').src;
                const newName = document.getElementById('edit-dish-name').value;
                const newType = document.getElementById('edit-dish-type').value;
                const newPrice = document.getElementById('edit-dish-price').value;
                const newVotable = document.getElementById('edit-dish-votable').checked;
                
                // 更新行数据
                cells[0].querySelector('img').src = newImgSrc;
                cells[1].textContent = newName;
                
                // 更新类型标签
                const typeClass = newType === '特色小吃' ? 'bg-info' : 'bg-primary';
                cells[2].innerHTML = `<span class="badge ${typeClass}">${newType}</span>`;
                
                // 更新价格
                cells[3].textContent = `¥${newPrice}`;
                
                // 更新投票状态
                const votableClass = newVotable ? 'bg-success' : 'bg-secondary';
                const votableText = newVotable ? '可投票' : '不可投票';
                cells[4].innerHTML = `<span class="badge ${votableClass}">${votableText}</span>`;
                
                // 关闭模态框
                bootstrap.Modal.getInstance(document.getElementById('edit-dish-modal')).hide();
                
                // 移除事件监听器
                saveBtn.removeEventListener('click', saveHandler);
            }
            
            // 保存函数引用到全局作用域，便于后续移除
            const handlerName = 'dishSaveHandler_' + Date.now();
            window[handlerName] = saveHandler;
            saveBtn.setAttribute('data-save-handler', handlerName);
            
            // 添加事件监听器
            saveBtn.addEventListener('click', saveHandler);
        });
    });
}

// 设置图片上传功能
function setupImageUploads() {
    // 为编辑模态框中的图片添加点击上传功能
    document.querySelectorAll('.edit-image-preview img').forEach(img => {
        img.style.cursor = 'pointer';
        img.title = '点击更换图片';
        
        img.addEventListener('click', function() {
            // 创建文件输入框
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            
            // 触发文件选择对话框
            fileInput.click();
            
            // 处理文件选择
            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    const imgElement = img;
                    
                    reader.onload = function(e) {
                        // 更新图片源
                        imgElement.src = e.target.result;
                    };
                    
                    // 读取文件为DataURL
                    reader.readAsDataURL(this.files[0]);
                }
                
                // 移除临时创建的文件输入框
                document.body.removeChild(fileInput);
            });
        });
    });
    
    // 为表格中的图片添加点击上传功能
    document.querySelectorAll('#dish-table-body img.img-thumbnail, #product-table-body img.img-thumbnail').forEach(img => {
        img.style.cursor = 'pointer';
        img.title = '点击更换图片';
        
        img.addEventListener('click', function() {
            // 创建文件输入框
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            
            // 触发文件选择对话框
            fileInput.click();
            
            // 处理文件选择
            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    const imgElement = img;
                    
                    reader.onload = function(e) {
                        // 更新图片源
                        imgElement.src = e.target.result;
                    };
                    
                    // 读取文件为DataURL
                    reader.readAsDataURL(this.files[0]);
                }
                
                // 移除临时创建的文件输入框
                document.body.removeChild(fileInput);
            });
        });
    });
}

// 设置用户编辑功能
function setupUserEditing() {
    // 用户编辑按钮事件
    document.querySelectorAll('#user-management .btn-outline-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const cells = row.querySelectorAll('td');
            
            // 获取用户数据
            const userId = cells[0].textContent;
            const userName = cells[1].textContent;
            const userDepartment = cells[2].textContent;
            const userWorkId = cells[3].textContent;
            const userBalance = cells[4].textContent;
            const userRole = cells[5].querySelector('.badge') ? cells[5].querySelector('.badge').textContent : '普通用户';
            const userStatus = cells[6].querySelector('.badge') ? cells[6].querySelector('.badge').textContent : '正常';
            
            // 填充模态框表单
            document.getElementById('edit-user-id').value = userId;
            document.getElementById('edit-user-name').value = userName;
            document.getElementById('edit-user-department').value = userDepartment;
            document.getElementById('edit-user-workid').value = userWorkId;
            document.getElementById('edit-user-balance').value = userBalance;
            document.getElementById('edit-user-role').value = userRole;
            document.getElementById('edit-user-status').value = userStatus;
            
            // 显示模态框
            const modal = new bootstrap.Modal(document.getElementById('edit-user-modal'));
            modal.show();
        });
    });
    
    // 用户编辑保存按钮事件
    document.getElementById('save-user-btn').addEventListener('click', function() {
        // 获取表单数据
        const userId = document.getElementById('edit-user-id').value;
        const userName = document.getElementById('edit-user-name').value;
        const userDepartment = document.getElementById('edit-user-department').value;
        const userWorkId = document.getElementById('edit-user-workid').value;
        const userBalance = document.getElementById('edit-user-balance').value;
        const userRole = document.getElementById('edit-user-role').value;
        const userStatus = document.getElementById('edit-user-status').value;
        
        // 找到对应的用户行
        const userRows = document.querySelectorAll('#user-management tbody tr');
        let targetRow = null;
        
        userRows.forEach(row => {
            if (row.querySelector('td').textContent === userId) {
                targetRow = row;
            }
        });
        
        if (targetRow) {
            // 更新行内容
            const cells = targetRow.querySelectorAll('td');
            cells[1].textContent = userName;
            cells[2].textContent = userDepartment;
            cells[3].textContent = userWorkId;
            cells[4].textContent = userBalance;
            
            // 更新角色标签
            const roleClass = userRole === '管理员' ? 'bg-danger' : 'bg-secondary';
            cells[5].innerHTML = `<span class="badge ${roleClass}">${userRole}</span>`;
            
            // 更新状态标签
            const statusClass = userStatus === '正常' ? 'bg-success' : (userStatus === '请假中' ? 'bg-warning' : 'bg-danger');
            cells[6].innerHTML = `<span class="badge ${statusClass}">${userStatus}</span>`;
            
            // 关闭模态框
            bootstrap.Modal.getInstance(document.getElementById('edit-user-modal')).hide();
        }
    });
}

// 设置商品编辑功能
function setupProductEditing() {
    // 商品编辑按钮事件
    document.querySelectorAll('#product-table-body .btn-outline-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const cells = row.querySelectorAll('td');
            
            // 获取商品数据
            const imgSrc = cells[0].querySelector('img').src;
            const productName = cells[1].textContent;
            const productType = cells[2].querySelector('.badge').textContent;
            const productCategory = cells[3].textContent;
            const productPrice = cells[4].textContent;
            const productStock = cells[5].textContent;
            const isActive = cells[6].querySelector('.badge').textContent === '已上架';
            
            // 填充商品编辑模态框
            document.querySelector('#edit-product-modal .edit-image-preview img').src = imgSrc;
            document.getElementById('edit-product-name').value = productName;
            document.getElementById('edit-product-type').value = productType === '实物商品' ? 'physical' : 'food';
            
            // 设置分类
            const categoryMapping = {
                '主食': 'staple',
                '肉类': 'meat',
                '蔬菜': 'vegetable',
                '特色小吃': 'snack',
                '日用品': 'grocery',
                '食用油': 'oil',
                '大米': 'rice'
            };
            document.getElementById('edit-product-category').value = categoryMapping[productCategory] || 'other';
            
            // 设置价格和库存
            document.getElementById('edit-product-price').value = productPrice;
            document.getElementById('edit-product-stock').value = productStock === '--' ? 0 : productStock;
            document.getElementById('edit-product-active').checked = isActive;
            
            // 显示模态框
            const modal = new bootstrap.Modal(document.getElementById('edit-product-modal'));
            modal.show();
            
            // 保存按钮事件
            const saveBtn = document.getElementById('save-edit-product');
            
            // 移除之前的事件监听器（如果存在）
            const oldHandler = saveBtn.getAttribute('data-save-handler');
            if (oldHandler && window[oldHandler]) {
                saveBtn.removeEventListener('click', window[oldHandler]);
            }
            
            // 保存事件处理函数
            function saveHandler() {
                // 获取表单数据
                const newImgSrc = document.querySelector('#edit-product-modal .edit-image-preview img').src;
                const newName = document.getElementById('edit-product-name').value;
                const newType = document.getElementById('edit-product-type').value;
                const newCategory = document.getElementById('edit-product-category').value;
                const newPrice = document.getElementById('edit-product-price').value;
                const newStock = document.getElementById('edit-product-stock').value;
                const newActive = document.getElementById('edit-product-active').checked;
                
                // 类型和分类的显示文本
                const typeText = newType === 'physical' ? '实物商品' : '餐厅菜品';
                const typeClass = newType === 'physical' ? 'bg-primary' : 'bg-info';
                
                const categoryOptions = {
                    'staple': '主食',
                    'meat': '肉类',
                    'vegetable': '蔬菜',
                    'snack': '特色小吃',
                    'grocery': '日用品',
                    'oil': '食用油',
                    'rice': '大米',
                    'other': '其他'
                };
                
                // 餐厅菜品没有库存
                const stockDisplay = newType === 'food' ? '--' : newStock;
                
                // 更新行数据
                cells[0].querySelector('img').src = newImgSrc;
                cells[1].textContent = newName;
                cells[2].innerHTML = `<span class="badge ${typeClass}">${typeText}</span>`;
                cells[3].textContent = categoryOptions[newCategory];
                cells[4].textContent = newPrice;
                cells[5].textContent = stockDisplay;
                
                // 更新状态标签
                const statusClass = newActive ? 'bg-success' : 'bg-warning';
                const statusText = newActive ? '已上架' : '待上架';
                cells[6].innerHTML = `<span class="badge ${statusClass}">${statusText}</span>`;
                
                // 关闭模态框
                bootstrap.Modal.getInstance(document.getElementById('edit-product-modal')).hide();
                
                // 移除事件监听器
                saveBtn.removeEventListener('click', saveHandler);
            }
            
            // 保存函数引用到全局作用域，便于后续移除
            const handlerName = 'productSaveHandler_' + Date.now();
            window[handlerName] = saveHandler;
            saveBtn.setAttribute('data-save-handler', handlerName);
            
            // 添加事件监听器
            saveBtn.addEventListener('click', saveHandler);
        });
    });
    
    // 商品删除按钮事件
    document.querySelectorAll('#product-table-body .btn-outline-danger').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const productName = row.querySelectorAll('td')[1].textContent;
            
            // 设置确认删除模态框的内容
            document.querySelector('#confirm-delete-modal .modal-body p').textContent = 
                `您确定要删除商品 "${productName}" 吗？此操作无法撤销。`;
            
            // 显示确认删除模态框
            const modal = new bootstrap.Modal(document.getElementById('confirm-delete-modal'));
            modal.show();
            
            // 确认删除按钮事件
            const confirmBtn = document.getElementById('confirm-delete-btn');
            
            // 移除之前的事件监听器（如果存在）
            const oldHandler = confirmBtn.getAttribute('data-delete-handler');
            if (oldHandler && window[oldHandler]) {
                confirmBtn.removeEventListener('click', window[oldHandler]);
            }
            
            // 删除处理函数
            function deleteHandler() {
                // 删除行
                row.remove();
                
                // 关闭模态框
                bootstrap.Modal.getInstance(document.getElementById('confirm-delete-modal')).hide();
                
                // 显示提示
                alert(`商品 "${productName}" 已成功删除！`);
                
                // 移除事件监听器
                confirmBtn.removeEventListener('click', deleteHandler);
            }
            
            // 保存函数引用到全局作用域，便于后续移除
            const handlerName = 'productDeleteHandler_' + Date.now();
            window[handlerName] = deleteHandler;
            confirmBtn.setAttribute('data-delete-handler', handlerName);
            
            // 添加事件监听器
            confirmBtn.addEventListener('click', deleteHandler);
        });
    });
}

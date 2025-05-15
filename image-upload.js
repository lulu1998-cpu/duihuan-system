// 图片上传功能
document.addEventListener('DOMContentLoaded', function() {
    // 统一处理上传占位符点击事件
    document.querySelectorAll('.upload-placeholder').forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            // 创建一个隐藏的文件输入框
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
                    const placeholderElement = placeholder;
                    
                    reader.onload = function(e) {
                        // 替换占位符为图片
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.alt = '上传的图片';
                        img.className = 'img-thumbnail';
                        img.style.width = '40px';
                        img.style.height = '40px';
                        
                        // 替换占位符
                        placeholderElement.parentNode.replaceChild(img, placeholderElement);
                    };
                    
                    // 读取文件为DataURL
                    reader.readAsDataURL(this.files[0]);
                }
                
                // 移除临时创建的文件输入框
                document.body.removeChild(fileInput);
            });
        });
    });
    
    // 为菜品和商品编辑行中的图片上传添加功能
    function setupImageUpload() {
        // 处理菜品新增行的图片上传
        document.querySelectorAll('.new-dish-row .upload-placeholder, .new-product-row .upload-placeholder').forEach(placeholder => {
            placeholder.style.cursor = 'pointer';
            placeholder.title = '点击上传图片';
        });
        
        // 处理已有菜品和商品行的图片点击
        document.querySelectorAll('#dish-table-body img.img-thumbnail, #product-table-body img.img-thumbnail').forEach(img => {
            img.style.cursor = 'pointer';
            img.title = '点击更换图片';
            
            img.addEventListener('click', function() {
                // 创建一个隐藏的文件输入框
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
    
    // 初始设置
    setupImageUpload();
    
    // 监听DOM变化，为新添加的元素也添加上传功能
    const observer = new MutationObserver(function(mutations) {
        setupImageUpload();
    });
    
    // 观察菜品表格和商品表格的变化
    const dishTable = document.getElementById('dish-table-body');
    const productTable = document.getElementById('product-table-body');
    
    if (dishTable) {
        observer.observe(dishTable, { childList: true, subtree: true });
    }
    
    if (productTable) {
        observer.observe(productTable, { childList: true, subtree: true });
    }
    
    // 处理编辑模式下的图片上传
    document.querySelectorAll('.edit-image-preview img').forEach(img => {
        img.style.cursor = 'pointer';
        img.title = '点击更换图片';
        
        img.addEventListener('click', function() {
            // 创建一个隐藏的文件输入框
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
}); 
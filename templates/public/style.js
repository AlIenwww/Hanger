document.addEventListener('DOMContentLoaded', function() {
    // ====== style 页面多件匹配部分 ======
    const frame13 = document.querySelector('.style-frame13');
    const descriptionInput = document.querySelector('.style-description-input');
    const container = document.querySelector(".style-container");

    if (!frame13 || !descriptionInput || !container) {
        console.error('必要 DOM 元素未找到');
        return;
    }

    // 创建显示衣服图片的容器
    const closetContainer = document.createElement("div");
    closetContainer.id = "closet-container";
    closetContainer.style.display = "flex";
    closetContainer.style.flexWrap = "wrap";
    closetContainer.style.gap = "20px";
    closetContainer.style.marginTop = "20px";
    container.appendChild(closetContainer);

    // 如果 localStorage 里有 matchResult（从 closet_choose 跳转过来的）
    const savedMatch = JSON.parse(localStorage.getItem("matchResult") || "{}");
    if (savedMatch.images && savedMatch.images.length > 0) {
        displayImages(savedMatch.images);
        // 显示后清除，避免刷新后重复显示
        localStorage.removeItem("matchResult");
    }

    // frame13 点击匹配多件衣服
    frame13.addEventListener('click', async function() {
        let description = descriptionInput.value.trim();
        if (!description) description = "none";

        closetContainer.innerHTML = "";

        try {
            const res = await fetch("/multipulmatching", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inputrequirements: description })
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            const images = data?.images || [];

            if (images.length === 0) {
                closetContainer.innerHTML = "<p>No results found.</p>";
                return;
            }

            displayImages(images);

        } catch(err) {
            console.error("请求匹配失败:", err);
            closetContainer.innerHTML = "<p>Error fetching results.</p>";
        }
    });

    // ====== frame14 跳转到 closet_choose ======
    const frame14 = document.querySelector('.style-frame14');
    if (frame14) {
        frame14.addEventListener('click', function() {
            window.location.href = '/closet_choose';
        });
    } else {
        console.error("没有找到 class 为 'style-frame14' 的 div");
    }

    // ====== 图片展示函数 ======
    function displayImages(images) {
        closetContainer.innerHTML = "";
        for (let i = 0; i < images.length; i += 2) {
            const pairDiv = document.createElement("div");
            pairDiv.style.display = "flex";
            pairDiv.style.justifyContent = "center";
            pairDiv.style.alignItems = "center";
            pairDiv.style.border = "2px solid #ccc";
            pairDiv.style.borderRadius = "10px";
            pairDiv.style.padding = "10px";
            pairDiv.style.gap = "10px";
            pairDiv.style.width = "340px";
            pairDiv.style.height = "200px";

            for (let j = i; j < i + 2 && j < images.length; j++) {
                const imgEl = document.createElement("img");
                imgEl.src = images[j];
                imgEl.alt = "cloth image";
                imgEl.style.maxWidth = "150px";
                imgEl.style.maxHeight = "180px";
                imgEl.style.objectFit = "contain";
                pairDiv.appendChild(imgEl);
            }

            closetContainer.appendChild(pairDiv);
        }
    }
});

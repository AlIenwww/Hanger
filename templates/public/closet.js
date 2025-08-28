const closetContainer = document.getElementById("closet-container");
closetContainer.innerHTML = "";

// 请求衣服数据
fetch("/showuserclothes")
  .then(response => response.json())
  .then(data => {
    if (!Array.isArray(data)) {
      console.error("返回的数据不是数组:", data);
      return;
    }

    data.forEach(item => {
      const imgSrc = item.img; // 图片路径
      const tagsArr = item.tags || []; // tags 是数组，每个元素是字典

      // 创建卡片
      const card = document.createElement("div");
      card.className = "closet-card";
      card.dataset.clothId = item.cloth_id; // 保存 cloth_id 方便匹配
      card.addEventListener("click", () => {
        card.classList.toggle("selected");
      });

      // 图片
      const imgEl = document.createElement("img");
      imgEl.src = imgSrc;
      imgEl.alt = "cloth image";
      imgEl.className = "closet-img";

      // 标签容器
      const tagsEl = document.createElement("div");
      tagsEl.className = "closet-tags";

      // 遍历 tags 数组
      tagsArr.forEach(tagObj => {
        // colors, clothes
        ["colors", "clothes"].forEach(key => {
          if (tagObj[key]) {
            tagObj[key].forEach(v => {
              const tagSpan = document.createElement("span");
              tagSpan.className = "closet-tag";
              tagSpan.textContent = v;
              tagsEl.appendChild(tagSpan);
            });
          }
        });

        // tags 内嵌对象
        if (tagObj.tags) {
          for (const [innerKey, innerValues] of Object.entries(tagObj.tags)) {
            if (Array.isArray(innerValues)) {
              innerValues.forEach(v => {
                const tagSpan = document.createElement("span");
                tagSpan.className = "closet-tag";
                tagSpan.textContent = v;
                tagsEl.appendChild(tagSpan);
              });
            }
          }
        }
      });

      card.appendChild(imgEl);
      card.appendChild(tagsEl);
      closetContainer.appendChild(card);
    });
  })
  .catch(err => console.error("获取衣服数据失败:", err));

// 获取用户输入和选中衣服
function getUserSelection() {
  const inputEl = document.getElementById("inputrequirements");
  const inputrequirements = inputEl.value;

  const selectedCards = document.querySelectorAll(".closet-card.selected");
  const clothes = Array.from(selectedCards).map(card => {
    return { cloth_id: card.dataset.clothId };
  });

  return { clothes, inputrequirements };
}

// 发送单件匹配请求
async function singleMatching() {
  const payload = getUserSelection();

  if (!payload.clothes.length) {
    alert("请先选择至少一件衣服！");
    return;
  }

  try {
    const res = await fetch("/singlematching", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log("匹配结果:", data);

    displayMatchedImages(data.images);
  } catch (err) {
    console.error("请求失败:", err);
  }
}

// 发送多件匹配请求（只用输入框内容，不选衣服）
async function multipulMatching() {
  const inputrequirements = document.getElementById("inputrequirements").value;

  try {
    const res = await fetch("/multipulmatching", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputrequirements })
    });
    const data = await res.json();
    console.log("匹配结果:", data);

    displayMatchedImages(data.images);
  } catch (err) {
    console.error("请求失败:", err);
  }
}

// 显示匹配结果图片
function displayMatchedImages(images) {
  const container = document.getElementById("matched-container");
  container.innerHTML = "";
  images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "matched-img";
    container.appendChild(img);
  });
}

// 给按钮绑定事件
document.getElementById("single-match-btn").addEventListener("click", singleMatching);
document.getElementById("multi-match-btn").addEventListener("click", multipulMatching);

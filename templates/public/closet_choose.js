const closetContainer = document.getElementById("closet-container");
closetContainer.innerHTML = "";

// 请求衣服数据
fetch("/showuserclothes")
  .then(res => res.json())
  .then(data => {
    data.forEach(item => {
      const card = document.createElement("div");
      card.className = "closet-card";
      card.dataset.clothId = item.cloth_id;

      const imgEl = document.createElement("img");
      imgEl.src = item.img;
      imgEl.className = "closet-img";
      card.appendChild(imgEl);

      card.addEventListener("click", async () => {
        const clothId = card.dataset.clothId;
        const inputrequirements = localStorage.getItem("inputrequirements") || "";

        try {
          const res = await fetch("/singlematching", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              inputrequirements,
              clothes: [{ cloth_id: clothId }]
            })
          });
          const data = await res.json();
          console.log("匹配结果:", data);

          // 存整个对象
          localStorage.setItem("matchResult", JSON.stringify({
            cloth_id: clothId,
            images: data.images || []
          }));

          // 跳回 style 页面
          window.location.href = "/style";
        } catch (err) {
          console.error("请求失败:", err);
        }
      });

      closetContainer.appendChild(card);
    });
  });

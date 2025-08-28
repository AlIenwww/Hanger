document.addEventListener("DOMContentLoaded", function () {
  // 左边 div 点击上传
  const leftDiv = document.querySelector(".home-frame11");
  if (leftDiv) {
    leftDiv.addEventListener("click", function () {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        fetch("/upload", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            alert(JSON.stringify(data)); // 上传结果弹窗显示
          })
          .catch((err) => {
            alert("上传失败：" + err);
          });
      });

      fileInput.click();
    });
  }

  // 右上 div 点击跳转 style
  const rightDiv = document.querySelector(".home-frame10");
  if (rightDiv) {
    rightDiv.addEventListener("click", function () {
      window.location.href = "/style";
    });
  }

  // 右下 div 点击跳转 closet
  const bottomRightDiv = document.querySelector(".home-frame12");
  if (bottomRightDiv) {
    bottomRightDiv.addEventListener("click", function () {
      window.location.href = "/closet";
    });
  }
});

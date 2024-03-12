const handleSubmitForm = async (event) => {
  event.preventDefault();
  const body = new FormData(form);
  body.append("insertAt", new Date().getTime());
  try {
    const res = await fetch("/items", {
      method: "POST",
      body: body,
    });
    const data = await res.json();
    if (data == "200") window.location.pathname = "/";
    console.log("완료");
  } catch (e) {
    console.error("이미지 업로드에 실패했습니다.", e);
  }
};

const form = document.getElementById("write-form");

form.addEventListener("submit", handleSubmitForm);

(function() {

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("comment-form");
    const hint = document.getElementById("comment-login-hint");
    const commentsList = document.getElementById("comments-list");
    const page = document.body.dataset.page;

    
    const showAllBtn = document.createElement("button");
    showAllBtn.textContent = "Показать все комментарии";
    showAllBtn.style.display = "none";
    showAllBtn.style.marginTop = "10px";
    commentsList.parentNode.insertBefore(showAllBtn, commentsList.nextSibling);

    let allComments = [];
    const displayedCount = 5;

    
    fetch("../../../PHP/check_auth.php")
      .then(response => response.json())
      .then(data => {
        if (data.loggedIn) {
          form.style.display = "block";
        } else {
          hint.style.display = "block";
        }
      })
      .catch(() => {
        hint.style.display = "block";
      });

    
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = document.getElementById("comment-text").value.trim();
      if (text === "") return;

      const formData = new FormData();
      formData.append("comment", text);
      formData.append("page", page)
      fetch("../../../PHP/add_comment.php", {
         method: "POST",
         body: formData
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          allComments.unshift(result.entry);
          renderComments(displayedCount);
          document.getElementById("comment-text").value = "";
        } else {
          alert("Ошибка: " + result.message);
        }
      })
      .catch(() => alert("Ошибка при отправке комментария"));
    });

    
    function renderComments(count) {
      commentsList.innerHTML = '';
      const commentsToShow = allComments.slice(0, count);
      commentsToShow.forEach(result => {
        const item = document.createElement("div");
        item.className = "comment-item";
        item.innerHTML = `
          <strong>${result.username}</strong>
          <span style="color:484343; font-size:12px;"> ${result.date}</span><br>
          <div class="comment-text-form">${result.comment}</div>
          <hr>`;
        commentsList.appendChild(item);
      });

      
      if (allComments.length > count) {
        showAllBtn.style.display = 'block';
      } else {
        showAllBtn.style.display = 'none';
      }
    }

    
    showAllBtn.addEventListener("click", () => {
      renderComments(allComments.length);
    });

    
    fetch(`../../../PHP/get_comments.php?page=${page}`)
      .then(response => response.json())
      .then(comments => {
        allComments = comments;
        renderComments(displayedCount);
      })
      .catch(() => console.error("Ошибка загрузки комментариев"));
  });

})();

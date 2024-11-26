document.getElementById("submit-btn").addEventListener("click", function(event) {
  event.preventDefault(); 

  
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;

  
  var subject = "Nova poruka od: " + name;
  var body = "Email: " + email + "\n\n" + "Poruka: " + message;

  
  var mailtoLink = "mailto:dimitrije.jankovic@elfak.rs" +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

  
  window.location.href = mailtoLink;
});

function odjaviSe() {
  
  localStorage.removeItem('token');
  
  
  window.location.href = './index.html';
}
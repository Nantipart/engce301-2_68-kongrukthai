// เลือกลิงก์ทั้งหมดใน nav
const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault(); // ไม่ให้กระโดดหน้า
        alert("คุณคลิก: " + this.textContent);
    });
});

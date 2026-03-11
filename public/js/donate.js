

  document.querySelectorAll('.donate-card button').forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      const rect = this.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left) + "px";
      ripple.style.top = (e.clientY - rect.top) + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
document.addEventListener("scroll", () => {
  document.querySelectorAll(".animate-on-scroll").forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.classList.add("visible");
    }
  });
});

document.addEventListener("scroll", () => {
  document.querySelectorAll(".animate-on-scroll").forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      setTimeout(() => el.classList.add("visible"), i * 200); // staggered delay
    }
  });
});

document.querySelectorAll('.amount-btn').forEach(btn => {

btn.addEventListener('click', function(){

const amount = this.dataset.amount;

document.getElementById("donation-amount").value = amount;

document.querySelectorAll('.amount-btn').forEach(b=>b.classList.remove("clicked"));

this.classList.add("clicked");

});

});



let currentStep = 1;

const nextBtn = document.getElementById("next-step");

if(nextBtn){

nextBtn.addEventListener("click",()=>{

currentStep++;

if(currentStep === 2){

document.getElementById("step1").classList.remove("active");
document.getElementById("step2").classList.add("active");

}

if(currentStep === 3){

document.getElementById("step2").classList.remove("active");
document.getElementById("step3").classList.add("active");

document.getElementById("payment-options").style.display="block";

}

if(currentStep === 4){

document.getElementById("step3").classList.remove("active");
document.getElementById("step4").classList.add("active");

alert("Please complete your payment");

}

});

}

/* ================= PAYMENT OPTIONS ================= */

const donateBtn = document.getElementById("donate-btn");

if(donateBtn){

donateBtn.addEventListener("click", function(){

const paymentOptions = document.getElementById("payment-options");

if(paymentOptions){
paymentOptions.style.display = "block";
}

});

}


function showPayment(type){

const methods = document.querySelectorAll(".payment-method");

methods.forEach(el=>{
el.style.display="none";
});

const selected = document.getElementById(type);

if(selected){
selected.style.display="block";
}

}
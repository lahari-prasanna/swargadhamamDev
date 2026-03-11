/* ================= TESTIMONIAL ANIMATION ================= */

document.addEventListener("DOMContentLoaded", () => {

const testiCards = document.querySelectorAll('.testi-card');

const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('animate');
}
});
}, { threshold: 0.3 });

testiCards.forEach(card => observer.observe(card));

});


/* ================= FAQ TOGGLE ================= */

function toggleFAQ(element) {

const parent = element.parentElement;
const allFAQs = document.querySelectorAll('.faq-item');

allFAQs.forEach(item => {
if (item !== parent) {
item.classList.remove('active');
}
});

parent.classList.toggle('active');

}


/* ================= NAVIGATION ACTIVE LINK ================= */

document.querySelectorAll('nav a').forEach(link => {

link.addEventListener('click', function () {

document.querySelectorAll('nav a').forEach(l =>
l.classList.remove('active-link')
);

this.classList.add('active-link');

});

});


/* ================= SET HOME ACTIVE ================= */

document.addEventListener('DOMContentLoaded', function () {

const homeLink = document.querySelector('nav a[href="#home"]');

if (homeLink) {
homeLink.classList.add('active-link');
}

});


/* ================= CONTACT BUTTON ================= */

const contactBtn = document.getElementById("contactBtn");

if(contactBtn){

contactBtn.addEventListener("click", function () {

document.querySelector("#contact").scrollIntoView({
behavior: "smooth"
});

});

}


/* ================= ROADMAP CARD REVEAL ================= */

const roadmapCards = document.querySelectorAll(".map-card");

function revealCards() {

const trigger = window.innerHeight * 0.85;

roadmapCards.forEach(card => {

const top = card.getBoundingClientRect().top;

if (top < trigger) {
card.classList.add("show");
}

});

}

window.addEventListener("scroll", revealCards);
revealCards();


/* ================= MEMBERS SLIDER ================= */

function scrollMembers(direction){

const slider = document.getElementById("membersSlider");

if(!slider) return;

slider.scrollBy({
left: direction * 320,
behavior: "smooth"
});

}


/* ================= AUTO SLIDER ================= */

setInterval(()=>{

const slider = document.getElementById("membersSlider");

if(!slider) return;

if(slider.scrollLeft + slider.clientWidth >= slider.scrollWidth){

slider.scrollTo({
left:0,
behavior:"smooth"
});

}else{

slider.scrollBy({
left:320,
behavior:"smooth"
});

}

},5000);


/* ================= VIDEO POPUP ================= */

function openVideo(src){

const popup = document.getElementById("videoPopup");
const video = document.getElementById("popupVideo");

if(!popup || !video) return;

video.src = src;
popup.style.display = "flex";

video.play();

}


function closeVideo(){

const popup = document.getElementById("videoPopup");
const video = document.getElementById("popupVideo");

if(!popup || !video) return;

video.pause();
video.src = "";

popup.style.display = "none";

}


/* ================= MEMBER VIDEO HOVER ================= */

document.addEventListener("DOMContentLoaded", function(){

document.querySelectorAll(".member-card").forEach(card=>{

const video = card.querySelector("video");

card.addEventListener("mouseenter",()=>{
video.currentTime = 0;
video.play();
});

card.addEventListener("mouseleave",()=>{
video.pause();
});

});

});


/* ================= SPOTLIGHT EFFECT ================= */

document.querySelectorAll(".member-card").forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect = card.getBoundingClientRect();

const x = e.clientX - rect.left;
const y = e.clientY - rect.top;

card.style.setProperty("--x", x + "px");
card.style.setProperty("--y", y + "px");

});

});


/* ================= 3D FLOATING EFFECT ================= */

document.querySelectorAll(".member-card").forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect = card.getBoundingClientRect();

const x = e.clientX - rect.left;
const y = e.clientY - rect.top;

const centerX = rect.width / 2;
const centerY = rect.height / 2;

const rotateX = -(y - centerY) / 10;
const rotateY = (x - centerX) / 10;

card.style.transform =
`rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;

});

card.addEventListener("mouseleave",()=>{

card.style.transform = "rotateX(0) rotateY(0)";

});

});


/* ================= REVEAL ANIMATION ================= */

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll(){

const trigger = window.innerHeight * 0.85;

reveals.forEach((el,index)=>{

const rect = el.getBoundingClientRect().top;

if(rect < trigger){

setTimeout(()=>{
el.classList.add("active");
}, index * 150);

}

});

}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();


function openVideo(src){

const popup=document.getElementById("videoPopup");
const video=document.getElementById("popupVideo");

video.src=src;

popup.style.display="flex";

video.play();

}

function closeVideo(){

const popup=document.getElementById("videoPopup");
const video=document.getElementById("popupVideo");

video.pause();
video.src="";

popup.style.display="none";

}


/* VIDEO HOVER PREVIEW */

document.querySelectorAll(".member-card video").forEach(video=>{

video.addEventListener("mouseenter",()=>{
video.play();
});

video.addEventListener("mouseleave",()=>{
video.pause();
video.currentTime=0;
});

});


document.querySelectorAll(".future-card").forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;
const y=e.clientY-rect.top;

const centerX=rect.width/2;
const centerY=rect.height/2;

const rotateX=-(y-centerY)/15;
const rotateY=(x-centerX)/15;

card.style.transform=`rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;

});

card.addEventListener("mouseleave",()=>{

card.style.transform="rotateX(0) rotateY(0)";

});

});
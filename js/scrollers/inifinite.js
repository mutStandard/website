const scrollers = document.querySelectorAll(".scroller");

scrollers.forEach(scroller=>{
  const inner = scroller.querySelector(".scroller_inner");
  const speed = scroller.dataset.speed || "25s";
  inner.style.setProperty("--speed", speed);

  // duplicate content for seamless loop
  [...inner.children].forEach(item=>{
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden","true");
    inner.appendChild(clone);
  });
});
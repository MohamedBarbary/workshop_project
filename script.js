const dynamic = document.getElementById("dynamic");
const form = document.getElementById("calcForm");
const shapeBtn = document.getElementById("shapeBtn");
const pipeBtn = document.getElementById("pipeBtn");
const outputSection = document.getElementById("outputSection");

let mode = null;

/* dynamic HTML */
const shapeHTML = `
  <div class="input-group animate-fade-in">
    <label>نوع الخامة</label>
    <input list="materials" class="material" required placeholder="اختر نوع الخامة">
    <datalist id="materials">
      <option value="حديد مربع">
      <option value="حديد ملفوف">
      <option value="حديد سداسي">
      <option value="أصفر مربع">
      <option value="أصفر ملفوف">
      <option value="أصفر سداسي">
      <option value="أحمر مربع">
      <option value="أحمر ملفوف">
      <option value="أحمر سداسي">
    </datalist>
  </div>
`;

const pipeHTML = `
  <div class="input-group animate-fade-in">
    <label>سُمك الماسورة (مم)</label>
    <input class="thickness" type="number" step="any" required placeholder="مثال: 2">
  </div>
`;

/* buttons */
shapeBtn.onclick = () => {
  mode = "shape";
  dynamic.innerHTML = shapeHTML;
  shapeBtn.classList.add("active");
  pipeBtn.classList.remove("active");
  outputSection.classList.remove("show");
};

pipeBtn.onclick = () => {
  mode = "pipe";
  dynamic.innerHTML = pipeHTML;
  pipeBtn.classList.add("active");
  shapeBtn.classList.remove("active");
  outputSection.classList.remove("show");
};

/* math */
const PI = Math.PI;

const square = (d) => d * d * 0.001;
const round = (d) => PI * 0.001 * (d / 2) ** 2;
const hex = (d) => 12 * 0.5 * 0.001 * (d / 2) * (d / 2 / Math.sqrt(3));
const pipe = (d, t) => PI * d * t * 0.001;

/* submit */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const d = +document.querySelector(".diameter").value;
  const priceKg = +document.querySelector(".k_price").value;
  const length = +document.querySelector(".mat_length").value;
  const order = +document.querySelector(".order").value;
  const afterWeight = +document.querySelector(".afterWeight").value;
  const scrapPrice = +document.querySelector(".scrapPrice").value;

  let size = 0, density = 0;

  if (mode === "shape") {
    const mat = document.querySelector(".material").value;

    density = mat.includes("حديد")
      ? 7.87
      : mat.includes("أصفر")
      ? 8.73
      : mat.includes("أحمر")
      ? 8.96
      : 0;

    if (mat.includes("مربع")) size = square(d);
    if (mat.includes("ملفوف")) size = round(d);
    if (mat.includes("سداسي")) size = hex(d);
  }

  if (mode === "pipe") {
    const t = +document.querySelector(".thickness").value;
    density = 7.87;
    size = pipe(d, t);
  }

  const weightMeter = size * density;
  const meterPrice = weightMeter * priceKg;
  const units = 980 / length;
  const unitCost = meterPrice / units;
  const metersOrder = order / units;
  const orderWeight = metersOrder * weightMeter;
  const beforeOp = weightMeter / units;

  const scrapWeight = beforeOp - afterWeight;
  const scrapMeter = scrapWeight * units;
  const scrapUnitPrice = scrapWeight * scrapPrice;
  const scrapMeterPrice = scrapUnitPrice * units;

  // Render outputs
  document.getElementById('o1').textContent = `${weightMeter.toFixed(3)} كجم`;
  document.getElementById('o2').textContent = `${meterPrice.toFixed(2)} جنيه`;
  document.getElementById('o3').textContent = `${units.toFixed(2)}`;
  document.getElementById('o4').textContent = `${unitCost.toFixed(2)} جنيه`;
  document.getElementById('o5').textContent = `${metersOrder.toFixed(3)} م`;
  document.getElementById('o6').textContent = `${orderWeight.toFixed(3)} كجم`;
  document.getElementById('o7').textContent = `${beforeOp.toFixed(4)} كجم`;
  document.getElementById('o8').textContent = `${scrapWeight.toFixed(4)} كجم`;
  document.getElementById('o9').textContent = `${scrapMeter.toFixed(4)} كجم`;
  document.getElementById('o10').textContent = `${scrapUnitPrice.toFixed(2)} جنيه`;
  document.getElementById('o11').textContent = `${scrapMeterPrice.toFixed(2)} جنيه`;

  // Show output section and scroll
  outputSection.classList.add("show");
  setTimeout(() => {
    outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
});

/* reset */
form.addEventListener("reset", () => {
  outputSection.classList.remove("show");
  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
});

// Initialize by clicking the first button
window.addEventListener('DOMContentLoaded', () => {
  shapeBtn.click();
});

/* ==================================
   Normal Calculator Logic 
   ================================== */
const sideCalc = document.getElementById('sideCalc');
const sideCalcOverlay = document.getElementById('sideCalcOverlay');
const sideCalcToggle = document.getElementById('sideCalcToggle');
const calcDisplay = document.getElementById('calcDisplay');
const calcBtns = document.querySelectorAll('.calc-btn');

const iconCalc = sideCalcToggle.querySelector('.icon-calc');
const iconArrow = sideCalcToggle.querySelector('.icon-arrow');

let calcValue = '0';
let evaluated = false;

function toggleSidebar() {
  const isOpen = sideCalc.classList.contains('open');
  if (isOpen) {
    sideCalc.classList.remove('open');
    sideCalcOverlay.classList.remove('active');
    iconCalc.style.display = 'block';
    iconArrow.style.display = 'none';
  } else {
    sideCalc.classList.add('open');
    sideCalcOverlay.classList.add('active');
    iconCalc.style.display = 'none';
    iconArrow.style.display = 'block';
  }
}

sideCalcToggle.addEventListener('click', toggleSidebar);
sideCalcOverlay.addEventListener('click', toggleSidebar);

calcBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.getAttribute('data-val');
    
    if (val === 'C') {
      calcValue = '0';
    } else if (val === 'DEL') {
      if (evaluated) {
        calcValue = '0';
        evaluated = false;
      } else {
        calcValue = calcValue.length > 1 ? calcValue.slice(0, -1) : '0';
      }
    } else if (val === '=') {
      try {
        // Safe evaluation of mathematical expression
        // Replace visual ops with real ops
        let expression = calcValue.replace(/×/g, '*').replace(/÷/g, '/');
        // Evaluate
        let result = new Function('return ' + expression)();
        // Handle floating point precision
        result = Math.round(result * 100000000) / 100000000;
        calcValue = String(result);
        evaluated = true;
      } catch (e) {
        calcValue = 'Error';
        evaluated = true;
      }
    } else {
      if (evaluated && !isNaN(val)) {
        calcValue = val;
        evaluated = false;
      } else if (evaluated && isNaN(val)) {
        calcValue += val === '*' ? '×' : val === '/' ? '÷' : val;
        evaluated = false;
      } else {
        const char = val === '*' ? '×' : val === '/' ? '÷' : val;
        if (calcValue === '0' && val !== '.') {
          calcValue = char;
        } else {
          calcValue += char;
        }
      }
    }
    
    calcDisplay.textContent = calcValue;
    // Auto scroll display to right
    calcDisplay.scrollLeft = calcDisplay.scrollWidth;
  });
});

const typeTitle = document.querySelector(".type");
const dynamic = document.getElementById("dynamic");
const form = document.getElementById("calcForm");

let mode = null;

/* dynamic HTML */
const shapeHTML = `
  <div>
    <label>نوع الخامة</label>
    <input list="materials" class="material" required>
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
  <div>
    <label>سُمك الماسورة (مم)</label>
    <input class="thickness" type="number" required>
  </div>
`;

/* buttons */
document.getElementById("shapeBtn").onclick = () => {
  mode = "shape";
  typeTitle.textContent = "مشغولات";
  dynamic.innerHTML = shapeHTML;
};

document.getElementById("pipeBtn").onclick = () => {
  mode = "pipe";
  typeTitle.textContent = "مواسير";
  dynamic.innerHTML = pipeHTML;
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

  let size, density;

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

  o1.textContent = `وزن المتر: ${weightMeter.toFixed(3)} كجم`;
  o2.textContent = `سعر المتر: ${meterPrice.toFixed(2)} جنيه`;
  o3.textContent = `عدد الوحدات / متر: ${units.toFixed(2)}`;
  o4.textContent = `تكلفة القطعة: ${unitCost.toFixed(2)} جنيه`;
  o5.textContent = `عدد الأمتار للطلب: ${metersOrder.toFixed(3)} م`;
  o6.textContent = `وزن الطلب: ${orderWeight.toFixed(3)} كجم`;
  o7.textContent = `الوزن قبل التشغيل: ${beforeOp.toFixed(4)} كجم`;
  o8.textContent = `وزن الهالك: ${scrapWeight.toFixed(4)} كجم`;
  o9.textContent = `إجمالي هالك المتر: ${scrapMeter.toFixed(4)} كجم`;
  o10.textContent = `سعر الهالك: ${scrapUnitPrice.toFixed(2)} جنيه`;
  o11.textContent = `إجمالي سعر هالك المتر: ${scrapMeterPrice.toFixed(2)} جنيه`;
});

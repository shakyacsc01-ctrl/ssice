export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919876543210?text=Hello%20SSICE%2C%20I%20want%20to%20enquire%20about%20courses"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-2xl hover:scale-110 transition-transform"
      data-testid="whatsapp-floating-btn"
      aria-label="Chat on WhatsApp"
    >
      <i className="bi bi-whatsapp text-3xl"></i>
    </a>
  );
}

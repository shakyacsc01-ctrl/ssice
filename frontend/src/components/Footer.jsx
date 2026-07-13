import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#051C42] text-gray-200 mt-20">
      <div className="container-x py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="font-extrabold text-white font-display text-2xl">SSICE</div>
          <p className="text-sm text-gray-300 mt-2 leading-relaxed">
            S.S. Institute of Computer Education<br />
            <span className="text-[#FF9800] italic">Empowering Students Through Digital Education</span>
          </p>
          <div className="flex gap-3 mt-5">
            {[Facebook, Twitter, Instagram, Youtube].map((Ic, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#FF9800] grid place-items-center transition-colors">
                <Ic size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[["About","/about"],["Courses","/courses"],["Verify Certificate","/verify"],["Contact Us","/contact"]].map(([l,t]) => (
              <li key={t}><Link to={t} className="hover:text-[#FF9800] transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Popular Courses</h4>
          <ul className="space-y-2 text-sm">
            {["CCC","DCA","ADCA","Tally with GST","Advanced Excel"].map((c) => (
              <li key={c}><Link to="/courses" className="hover:text-[#FF9800] transition-colors">{c}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex gap-2"><MapPin size={16} className="text-[#FF9800] mt-0.5" /> Main Road, Near Bus Stand, Bihar, India</li>
            <li className="flex gap-2"><Phone size={16} className="text-[#FF9800] mt-0.5" /> +91 98765 43210</li>
            <li className="flex gap-2"><Mail size={16} className="text-[#FF9800] mt-0.5" /> info@ssice.in</li>
          </ul>
          <div className="mt-4 flex gap-2 items-center">
            <span className="px-2 py-1 text-[10px] uppercase rounded bg-white/10">MSME</span>
            <span className="px-2 py-1 text-[10px] uppercase rounded bg-white/10">ISO 9001</span>
            <span className="px-2 py-1 text-[10px] uppercase rounded bg-white/10">Skill India</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-4 text-xs text-gray-400 flex justify-between">
          <p>© {new Date().getFullYear()} SSICE — Director: Pappu Singh</p>
          <p>Made with ❤ for Digital India</p>
        </div>
      </div>
    </footer>
  );
}

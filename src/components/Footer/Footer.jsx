import { Link } from "react-router-dom";
import logo from "@/assets/logo-lGLL0Zb0.png";

export default function Footer() {
  return (
    <footer className="mt-0 py-20" style={{ backgroundColor: "oklab(0.508375 0.0304459 -0.22989 / 0.05)" }}>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-[1.9fr_1fr_1fr_1fr]">
        <div>
          <img src={logo} alt="QuickBlog" className="mb-6 h-12" />
          <p className="max-w-md text-base leading-7 text-slate-950 dark:text-slate-300">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum unde quaerat eveniet cumque accusamus atque qui error quo enim fugiat?
          </p>
        </div>
        <FooterList title="Quick Links" items={["Home", "Best Sellers", "Offers & Deals", "Contact Us", "FAQs"]} />
        <FooterList title="Need Help?" items={["Delivery Information", "Return & Refund Policy", "Payment Methods", "Track your Order", "Contact Us"]} />
        <FooterList title="Follow Us" items={["Instagram", "Twitter", "Facebook", "YouTube"]} />
      </div>
    </footer>
  );
}

function FooterList({ title, items }) {
  return (
    <div>
      <h2 className="mb-4 font-bold">{title}</h2>
      <ul className="space-y-3 text-sm">
        {items.map((item) => (
          <li key={item}>
            <Link to="/" className="text-slate-600 hover:text-indigo-600 dark:text-slate-300">
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

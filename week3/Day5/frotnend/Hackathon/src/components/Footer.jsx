import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* COLLECTIONS Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-800 uppercase tracking-wide">
              COLLECTIONS
            </h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li>
                <Link
                  href="/collections/black-teas"
                  className="hover:text-gray-800 transition-colors"
                >
                  Black teas
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/green-teas"
                  className="hover:text-gray-800 transition-colors"
                >
                  Green teas
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/white-teas"
                  className="hover:text-gray-800 transition-colors"
                >
                  White teas
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/herbal-teas"
                  className="hover:text-gray-800 transition-colors"
                >
                  Herbal teas
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/matcha"
                  className="hover:text-gray-800 transition-colors"
                >
                  Matcha
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/chai"
                  className="hover:text-gray-800 transition-colors"
                >
                  Chai
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/oolong"
                  className="hover:text-gray-800 transition-colors"
                >
                  Oolong
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/rooibos"
                  className="hover:text-gray-800 transition-colors"
                >
                  Rooibos
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/teaware"
                  className="hover:text-gray-800 transition-colors"
                >
                  Teaware
                </Link>
              </li>
            </ul>
          </div>

          {/* LEARN Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-800 uppercase tracking-wide">
              LEARN
            </h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-gray-800 transition-colors"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="/about-teas"
                  className="hover:text-gray-800 transition-colors"
                >
                  About our teas
                </Link>
              </li>
              <li>
                <Link
                  href="/tea-academy"
                  className="hover:text-gray-800 transition-colors"
                >
                  Tea academy
                </Link>
              </li>
            </ul>
          </div>

          {/* CUSTOMER SERVICE Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-800 uppercase tracking-wide">
              CUSTOMER SERVICE
            </h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li>
                <Link
                  href="/ordering-payment"
                  className="hover:text-gray-800 transition-colors"
                >
                  Ordering and payment
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery"
                  className="hover:text-gray-800 transition-colors"
                >
                  Delivery
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-gray-800 transition-colors"
                >
                  Privacy and policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-gray-800 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT US Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-800 uppercase tracking-wide">
              CONTACT US
            </h3>
            <div className="space-y-4 text-gray-600 text-sm">
              <div className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <address className="not-italic">
                  3 Falahi, Falahi St, Pasdaran Ave,
                  <br />
                  Shiraz, Fars Providence
                  <br />
                  Iran
                </address>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>Email: </span>
                <a
                  href="mailto:amoopur@gmail.com"
                  className="hover:text-gray-800 transition-colors"
                >
                  amoopur@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>Tel: </span>
                <a
                  href="tel:+989173038406"
                  className="hover:text-gray-800 transition-colors"
                >
                  +98 9173038406
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">NinjaCode</h2>
            <p>
              Your journey to becoming a coding ninja starts here. Solve
              problems, learn, and grow.
            </p>
          </div>
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">
              Quick Links
            </h2>
            <ul>
              <li>
                <a href="/" className="hover:text-blue-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=sajidhafsa23@gmail.com"
                  target="_blank"
                  className="hover:text-blue-500 transition-colors"
                >
                  Contact us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">
              Connect with Us
            </h2>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=100010268648729"
                target="_blank"
                className="hover:text-blue-500 transition-colors"
              >
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/hafsa-sajid-38bb4627b/"
                target="_blank"
                className="hover:text-blue-500 transition-colors"
              >
                <LinkedInIcon className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/hafsa_sajid23?igsh=aW53YjZhZzhhcHFo"
                target="_blank"
                className="hover:text-blue-500 transition-colors"
              >
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a
                href="https://github.com/its-hafsa04"
                target="_blank"
                className="hover:text-blue-500 transition-colors"
              >
                <GitHubIcon className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p>
            &copy; {new Date().getFullYear()} NinjaCode. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

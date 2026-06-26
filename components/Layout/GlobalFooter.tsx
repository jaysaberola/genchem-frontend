import { ReactNode, useEffect, useState } from "react";
import styles from "@/styles/footer.module.css";

import FacebookIcon from "@/components/icons/facebook";
import InstagramIcon from "@/components/icons/instagram";
import TwitterIcon from "@/components/icons/twitter";
import YoutubeIcon from "@/components/icons/youtube";
import LinkedinIcon from "@/components/icons/linkedin";

interface FooterLink {
  label: string;
  href: string;
  emblem?: ReactNode; // optional icon
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: string;
  url: string;
  label: string;
  emblem: ReactNode;
}

interface GlobalFooterProps {
  logo?: string;
  companyDescription?: string;
  companyAddress?: string;
  columns?: FooterColumn[];
  copyrightText?: string;
  companyName?: string;
  socialLinks?: SocialLink[];
}

export default function GlobalFooter({
  logo = "/images/ip.png",
  companyDescription = "Premium PVC piping and solutions for industrial and residential applications.",
  companyAddress = "645 Paso de Blas Street, Valenzuela City, Metro Manila, Philippines",
  columns = [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Products", href: "#" },
        { label: "Projects", href: "#" },
        { label: "News", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#" },
        { label: "Contact Us", href: "#" },
        { label: "FAQ", href: "#" },
      ],
    },
    {
      title: "Social Media",
      links: [
        { label: "Facebook", href: "#", emblem: <FacebookIcon /> },
        { label: "Twitter", href: "#", emblem: <TwitterIcon /> },
        { label: "Youtube", href: "#", emblem: <YoutubeIcon /> },
        { label: "Instagram", href: "#", emblem: <InstagramIcon /> },
        { label: "LinkedIn", href: "#", emblem: <LinkedinIcon /> },
      ],
    },
  ],
  copyrightText = "All rights reserved.",
  companyName = "GENCHEM PH",
  socialLinks = [],
}: GlobalFooterProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className={styles.footer}>
      {/* Main Footer Content */}
      <div className={styles.footerContent}>
        <div className={styles.footerColumns}>
          {/* First Column: Logo, Description, Address */}
          <div className={styles.column}>
            {logo && (
              <img src={logo} alt={companyName} className={styles.footerLogo} style={{backgroundColor: "white"}} />
            )}
            <p className={styles.companyDescription}>{companyDescription}</p>
            <div className={styles.addressSection}>
              <p className={styles.addressLabel}>Address:</p>
              <p className={styles.addressText}>{companyAddress}</p>
            </div>
          </div>

          {/* Remaining Columns */}
          {columns.map((column, index) => (
            <div key={index} className={styles.column}>
              <h3 className={styles.columnTitle + ' ps-4'}>{column.title}</h3>
              <ul className={styles.linksList}>
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.href} className={styles.footerLink}>
                      <span className="pe-2">{link.emblem}</span> {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links Section (Optional) */}
        {socialLinks.length > 0 && (
          <div className={styles.socialSection}>
            <h3 className={styles.columnTitle}>Follow Us</h3>
            <div className={styles.socialLinks}>

              {socialLinks.map((social, index) => (
                <div
                  key={index}
                  className="d-flex flex-row align-items-center"
                >
                  <span>{social.emblem}</span>
                  <a
                    href={social.url}
                    aria-label={social.label}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </a>
                </div>
              ))}
              
            </div>

          </div>
        )}
      </div>

      {/* Copyright Banner */}
      <div className={styles.copyrightBanner}>
        <div className={styles.copyrightContent}>
          <p className={styles.copyrightText}>
            © {currentYear} {companyName}. {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}

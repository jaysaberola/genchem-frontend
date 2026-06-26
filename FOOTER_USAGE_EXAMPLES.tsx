/**
 * GlobalFooter Component Usage Examples
 * 
 * This file demonstrates how to use the GlobalFooter component 
 * with different configurations across your application.
 */

import GlobalFooter from '@/components/Layout/GlobalFooter';
import FacebookIcon from './components/icons/facebook';
import LinkedinIcon from './components/icons/linkedin';
import TwitterIcon from './components/icons/twitter';
import InstagramIcon from './components/icons/instagram';

// Example 1: Default Footer (recommended for most pages)
export function DefaultFooterExample() {
  return <GlobalFooter />;
}

// Example 2: Customized Footer with Your Company Info
export function CustomizedFooterExample() {
  const footerColumns = [
    {
      title: "About GENCHEM PH",
      links: [
        { label: "Our Story", href: "/about" },
        { label: "Mission & Vision", href: "/mission" },
        { label: "Team", href: "/team" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Products & Services",
      links: [
        { label: "PVC Pipes", href: "/products/pipes" },
        { label: "Fittings", href: "/products/fittings" },
        { label: "Solutions", href: "/products/solutions" },
        { label: "Bulk Orders", href: "/bulk" },
      ],
    },
    {
      title: "Support & Legal",
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Return Policy", href: "/returns" },
      ],
    },
  ];

  const socialLinks = [
    { icon: "f", url: "https://facebook.com/imperialpvc", label: "Facebook", emblem: <FacebookIcon /> },
    { icon: "𝕏", url: "https://twitter.com/imperialpvc", label: "Twitter", emblem: <TwitterIcon /> },
    { icon: "in", url: "https://linkedin.com/company/imperialpvc", label: "LinkedIn", emblem: <LinkedinIcon /> },
    { icon: "📷", url: "https://instagram.com/imperialpvc", label: "Instagram", emblem: <InstagramIcon /> },
  ];

  return (
    <GlobalFooter
      logo="/images/logo.png"
      companyDescription="GENCHEM PH is a leading manufacturer of high-quality PVC piping solutions. With over 20 years of excellence, we serve industries worldwide."
      companyAddress="456 Industrial Boulevard, Tech Park, Industrial City, IC 98765 | Phone: +1 (555) 123-4567 | Email: info@imperialpvc.com"
      columns={footerColumns}
      companyName="GENCHEM PH"
      copyrightText="All rights reserved. | Quality PVC Solutions Since 2010."
      socialLinks={socialLinks}
    />
  );
}

// Example 3: Minimal Footer
export function MinimalFooterExample() {
  return (
    <GlobalFooter
      companyName="GENCHEM PH"
      copyrightText="© All Rights Reserved"
    />
  );
}

/**
 * INTEGRATION GUIDE:
 * 
 * 1. The GlobalFooter is already integrated into the GuestLayout globally
 * 2. For custom pages, you can import and use it directly:
 * 
 *    import { GlobalFooter } from '@/components/Layout';
 * 
 * 3. 4-COLUMN LAYOUT:
 *    - Column 1: Logo, Company Description, Address (vertical arrangement)
 *    - Column 2: About Us
 *    - Column 3: Products & Services (customizable)
 *    - Column 4: Support & Legal (customizable)
 * 
 * 4. Props available:
 *    - logo: URL to company logo image
 *    - companyDescription: Brief description of your company
 *    - companyAddress: Full address with contact info
 *    - columns: Array of footer sections with titles and links
 *    - companyName: Your company name
 *    - copyrightText: Copyright information
 *    - socialLinks: Array of social media links
 * 
 * 5. The footer styling uses CSS modules (footer.module.css) with:
 *    - Red-orange gradient background (darkish tones)
 *    - Bright text for readability
 *    - Responsive: 4 cols → 2 cols (1024px) → 1 col (768px)
 *    - Hover effects on links
 *    - Full-width copyright banner at the bottom
 */

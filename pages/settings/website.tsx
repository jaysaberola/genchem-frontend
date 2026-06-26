import { useState, ChangeEvent } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import { useEffect } from "react";
import { websiteService } from "@/services/websiteService";
import { toast } from "@/lib/toast";
import TinyEditor from "@/components/UI/Editor";
import { notifyWebsiteSettingsUpdated, storeWebsiteSettings } from "@/lib/websiteSettings";
import { resolveCompanyLogoUrl, resolveFaviconUrl } from "@/lib/mediaAssets";
import FileManagerImagePicker from "@/components/UI/FileManagerImagePicker";
import BrandLogo from "@/components/UI/BrandLogo";

type TabKey = "website" | "contact" | "social" | "privacy";

function WebsiteSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("website");

  /* =======================
     Website tab state
  ======================= */
  const [companyName, setCompanyName] = useState("");
  const [websiteName, setWebsiteName] = useState("");
  const [copyright, setCopyright] = useState("");
  const [analytics, setAnalytics] = useState("");
  const [googleMap, setGoogleMap] = useState("");
  const [recaptcha, setRecaptcha] = useState("");

  const [logoPath, setLogoPath] = useState("");
  const [faviconPath, setFaviconPath] = useState("");

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  /* =======================
     Contact tab state
  ======================= */
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [fax, setFax] = useState("");
  const [telephone, setTelephone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [privacyTitle, setPrivacyTitle] = useState("");
  const [privacyPopup, setPrivacyPopup] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");

  type SocialRow = {
    name: string;
    media_account: string;
  };

  const [socials, setSocials] = useState<SocialRow[]>([
    { name: "", media_account: "" },
  ]);

  const handleLogoSelect = (url: string) => {
    setLogoPath(url);
    setLogoPreview(resolveCompanyLogoUrl(url) ?? url);
  };

  const handleFaviconSelect = (url: string) => {
    setFaviconPath(url);
    setFaviconPreview(resolveFaviconUrl(url) ?? url);
  };

  /* =======================
     Handlers
  ======================= */
  const handleFileName = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) => {
    if (e.target.files?.[0]) {
      setter(e.target.files[0].name);
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      const s = await websiteService.getSettings();

      setCompanyName(s.company_name);
      setWebsiteName(s.website_name);
      setCopyright(s.copyright);
      setAnalytics(s.google_analytics);
      setGoogleMap(s.google_map);
      setRecaptcha(s.google_recaptcha_sitekey);

      setAddress(s.company_address);
      setMobile(s.mobile_no);
      setFax(s.fax_no);
      setTelephone(s.tel_no);
      setContactEmail(s.email);

      setPrivacyTitle(s.data_privacy_title);
      setPrivacyPopup(s.data_privacy_popup_content);
      setPrivacyContent(s.data_privacy_content);

      if (s.company_logo) {
        setLogoPath(s.company_logo);
        setLogoPreview(resolveCompanyLogoUrl(s.company_logo) ?? null);
      }

      if (s.website_favicon) {
        setFaviconPath(s.website_favicon);
        setFaviconPreview(resolveFaviconUrl(s.website_favicon) ?? null);
      }

    };
    const loadSocials = async () => {
      try {
        const res = await websiteService.getSocials();
        if (res.data.length > 0) {
          setSocials(res.data);
        }
      } catch (err) {
        console.error("Failed to load social media accounts", err);
      }
    };

    loadSocials();
    loadSettings();
  }, []);

  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
      if (faviconPreview?.startsWith("blob:")) URL.revokeObjectURL(faviconPreview);
    };
  }, [logoPreview, faviconPreview]);

  const clearLogo = () => {
    setLogoPath("");
    setLogoPreview(null);
  };

  const clearFavicon = () => {
    setFaviconPath("");
    setFaviconPreview(null);
  };


  const saveWebsite = async () => {
    try {
      const fd = new FormData();

      fd.append("company_name", companyName);
      fd.append("website_name", websiteName);
      fd.append("copyright", copyright);
      fd.append("google_analytics", analytics);
      fd.append("google_map", googleMap);
      fd.append("google_recaptcha_sitekey", recaptcha);

      fd.append("company_logo", logoPath);
      fd.append("website_favicon", faviconPath);

      await websiteService.updateWebsite(fd);

      // Refresh cached settings so other UI (topbar, etc.) updates immediately.
      try {
        const s = await websiteService.getSettings();
        storeWebsiteSettings(s);
        notifyWebsiteSettingsUpdated();
      } catch {
        // ignore
      }

      toast.success("Website settings saved");
    } catch (err: any) {
      console.error("Failed to save website settings", err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to save website settings. Please try again."
      );
    }
  };

  const handleSocialChange = (
    index: number,
    field: keyof SocialRow,
    value: string
  ) => {
    const updated = [...socials];
    updated[index][field] = value;
    setSocials(updated);
  };

  const addSocialRow = () => {
    setSocials([...socials, { name: "", media_account: "" }]);
  };

  const removeSocialRow = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  const handleSaveSocials = async () => {
    try {
      await websiteService.updateSocials(
        socials.filter(
          (s) => s.name && s.media_account
        )
      );
      toast.success("Social media accounts saved successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save social media accounts");
    }
  };


  const handleSaveContact = async () => {
    try {
      await websiteService.updateContact({
        company_address: address,
        mobile_no: mobile,
        fax_no: fax,
        tel_no: telephone,
        email: contactEmail,
      });

      toast.success("Contact settings saved successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save contact settings");
    }
  };

  const handleSavePrivacy = async () => {
    try {
      await websiteService.updatePrivacy({
        data_privacy_title: privacyTitle,
        data_privacy_popup_content: privacyPopup,
        data_privacy_content: privacyContent,
      });

      toast.success("Data privacy settings saved successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save data privacy settings");
    }
  };




  return (
    <div className="container">
      <h3 className="mb-4">Website Settings</h3>

      <div className="card">
        {/* Tabs */}
        <div className="card-header bg-white border-0 pb-0">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "website" ? "active" : ""}`}
                onClick={() => setActiveTab("website")}
              >
                Website
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "contact" ? "active" : ""}`}
                onClick={() => setActiveTab("contact")}
              >
                Contact
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "social" ? "active" : ""}`}
                onClick={() => setActiveTab("social")}
              >
                Social Media
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "privacy" ? "active" : ""}`}
                onClick={() => setActiveTab("privacy")}
              >
                Data Privacy
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body">
          {/* =======================
             WEBSITE TAB
          ======================= */}
          {activeTab === "website" && (
            <div style={{ maxWidth: 600 }}>
              <div className="mb-3">
                <label className="form-label">Company Name *</label>
                <input
                  className="form-control"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Website Name *</label>
                <input
                  className="form-control"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Copyright Year *</label>
                <input
                  className="form-control"
                  value={copyright}
                  onChange={(e) => setCopyright(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Logo</label>

                <div className="mb-2">
                  <BrandLogo
                    src={logoPreview}
                    alt="Website Logo"
                    style={{
                      maxHeight: 100,
                      maxWidth: "100%",
                      border: "1px solid #e1e5ee",
                      padding: 6,
                      borderRadius: 4,
                      objectFit: "contain",
                    }}
                  />
                </div>

                <div className="input-group mb-2">
                  <input
                    className="form-control"
                    value={logoPath}
                    readOnly
                    placeholder="Select a logo from Files"
                  />
                </div>

                <div className="d-flex gap-2 flex-wrap">
                  <FileManagerImagePicker label="Choose from Files" onSelect={handleLogoSelect} />
                  {logoPath ? (
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={clearLogo}>
                      Remove Logo
                    </button>
                  ) : null}
                </div>

                <small className="text-muted d-block mt-2">
                  Pick the logo directly from Manage Files. PNG, JPG, or SVG recommended.
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label">Favicon</label>

                <div className="mb-2">
                  <BrandLogo
                    src={faviconPreview}
                    alt="Website Favicon"
                    style={{
                      height: 48,
                      width: 48,
                      border: "1px solid #e1e5ee",
                      padding: 6,
                      borderRadius: 4,
                      objectFit: "contain",
                    }}
                  />
                </div>

                <div className="input-group mb-2">
                  <input
                    className="form-control"
                    value={faviconPath}
                    readOnly
                    placeholder="Select a favicon from Files"
                  />
                </div>

                <div className="d-flex gap-2 flex-wrap">
                  <FileManagerImagePicker label="Choose from Files" onSelect={handleFaviconSelect} />
                  {faviconPath ? (
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={clearFavicon}>
                      Remove Icon
                    </button>
                  ) : null}
                </div>

                <small className="text-muted d-block mt-2">
                  Pick the favicon directly from Manage Files. ICO or PNG, 128×128 recommended.
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label">Google Analytics Code</label>
                <textarea
                  rows={3}
                  className="form-control"
                  value={analytics}
                  onChange={(e) => setAnalytics(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Google Map</label>
                <textarea
                  rows={4}
                  className="form-control"
                  value={googleMap}
                  onChange={(e) => setGoogleMap(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Google reCaptcha Site Key *</label>
                <textarea
                  rows={2}
                  className="form-control"
                  value={recaptcha}
                  onChange={(e) => setRecaptcha(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={saveWebsite}
              >
                Save Settings
              </button>

            </div>
          )}

          {/* =======================
             CONTACT TAB
          ======================= */}
          {activeTab === "contact" && (
            <div style={{ maxWidth: 600 }}>
              <div className="mb-3">
                <label className="form-label">Company Address *</label>
                <textarea
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Mobile Number *</label>
                <input
                  className="form-control"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Fax Number</label>
                <input
                  className="form-control"
                  value={fax}
                  onChange={(e) => setFax(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Telephone Number *</label>
                <input
                  className="form-control"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSaveContact}
              >
                Save Settings
              </button>
            </div>
          )}

          {/* =======================
             SOCIAL MEDIA TAB
          ======================= */}
          {activeTab === "social" && (
            <div style={{ maxWidth: 600 }}>
              <p className="text-muted mb-3">
                Add your social media links
              </p>

              {socials.map((social, index) => (
                <div className="d-flex gap-2 mb-2" key={index}>
                  <select
                    className="form-control"
                    value={social.name}
                    onChange={(e) =>
                      handleSocialChange(index, "name", e.target.value)
                    }
                  >
                    <option value="">Choose</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">Youtube</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="google">Google</option>
                  </select>

                  <input
                    className="form-control"
                    placeholder="URL"
                    value={social.media_account}
                    onChange={(e) =>
                      handleSocialChange(index, "media_account", e.target.value)
                    }
                  />

                  <button
                    className="btn btn-outline-danger"
                    onClick={() => removeSocialRow(index)}
                    disabled={socials.length === 1}
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                className="btn btn-outline-primary mb-3"
                onClick={addSocialRow}
              >
                + Add
              </button>

              <br />

              <button
                className="btn btn-primary"
                onClick={handleSaveSocials}
              >
                Save Settings
              </button>
            </div>
          )}

          {/* =======================
             DATA PRIVACY TAB
          ======================= */}
          {activeTab === "privacy" && (
            <div>
              <div className="mb-3">
                <label className="form-label">Page Title *</label>
                <input
                  className="form-control"
                  value={privacyTitle}
                  onChange={(e) => setPrivacyTitle(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Pop-up Content *</label>
                <textarea
                  rows={3}
                  className="form-control"
                  value={privacyPopup}
                  onChange={(e) => setPrivacyPopup(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Content *</label>
                <TinyEditor
                  value={privacyContent}
                  onChange={setPrivacyContent}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSavePrivacy}
              >
                Save Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

WebsiteSettingsPage.Layout = AdminLayout;
export default WebsiteSettingsPage;

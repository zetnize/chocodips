import { site } from "@/data/site";
import { InstagramIcon } from "@/components/ui/icons";
export default function SocialLinks() {
  return (
    <div className="social-links">
      <a
        className="icon-button"
        href={site.socials.instagram}
        aria-label="Instagram"
        target="_blank"
        rel="noopener noreferrer"
      >
        <InstagramIcon />
      </a>
    </div>
  );
}

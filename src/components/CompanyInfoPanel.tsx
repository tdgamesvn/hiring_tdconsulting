import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

// Social media icons as SVG components
const BehanceIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
    </svg>
);

const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385c5.737-.9 10.126-5.864 10.126-11.854z" />
    </svg>
);

const ArtStationIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24-3.251a2.38 2.38 0 0 0-.357-1.273l-8.1-14.051a2.424 2.424 0 0 0-2.164-1.333H8.989l6.982 12.1 2.027 3.505L21.02 18.6l3.168-5.484a2.381 2.381 0 0 0 .357-1.273v-.001zM7.633 16.836l4.821-8.347L8.66 2.493 1.024 15.565a2.46 2.46 0 0 0 .387 2.981l6.222-1.71z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.554v-11.452h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zm-15.11-13.019c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019h-3.564v-11.452h3.564v11.452zm15.106-20.452h-20.454c-.979 0-1.771.774-1.771 1.729v20.542c0 .956.792 1.729 1.771 1.729h20.451c.978 0 1.778-.773 1.778-1.729v-20.542c0-.955-.8-1.729-1.778-1.729z" />
    </svg>
);

interface SocialLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    color: string;
}

const SocialLink = ({ href, icon, label, color }: SocialLinkProps) => {
    if (!href) return null;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-3 rounded-xl bg-card/30 border border-primary/10 hover:border-primary/30 hover:bg-card/50 transition-all duration-300 group`}
            title={label}
        >
            <div className={`p-2 rounded-lg ${color} text-white group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                {label}
            </span>
        </a>
    );
};

export default function CompanyInfoPanel() {
    const { data: companyInfo, isLoading, error } = useCompanyInfo();

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-6 bg-primary/20 rounded w-3/4"></div>
                <div className="h-4 bg-muted/20 rounded w-full"></div>
                <div className="h-4 bg-muted/20 rounded w-5/6"></div>
                <div className="h-4 bg-muted/20 rounded w-4/6"></div>
            </div>
        );
    }

    if (error || !companyInfo) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Company Name */}
            <div>
                <h2 className="text-2xl font-bold text-primary mb-2">
                    {companyInfo.name}
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
            </div>

            {/* Introduction */}
            {companyInfo.introduce && (
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">
                        About Us
                    </h3>
                    <p className="text-foreground/80 leading-relaxed text-sm">
                        {companyInfo.introduce}
                    </p>
                </div>
            )}

            {/* Contact Info */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">
                    Contact
                </h3>

                {companyInfo.address && (
                    <div className="flex items-start gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/70">{companyInfo.address}</span>
                    </div>
                )}

                {companyInfo.phone && (
                    <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                        <a
                            href={`tel:${companyInfo.phone}`}
                            className="text-foreground/70 hover:text-primary transition-colors"
                        >
                            {companyInfo.phone}
                        </a>
                    </div>
                )}

                {companyInfo.email && (
                    <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                        <a
                            href={`mailto:${companyInfo.email}`}
                            className="text-foreground/70 hover:text-primary transition-colors"
                        >
                            {companyInfo.email}
                        </a>
                    </div>
                )}

                {companyInfo.website && (
                    <div className="flex items-center gap-3 text-sm">
                        <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                        <a
                            href={companyInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground/70 hover:text-primary transition-colors"
                        >
                            {companyInfo.website.replace(/^https?:\/\//, '')}
                        </a>
                    </div>
                )}
            </div>

            {/* Social Links */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">
                    Follow Us
                </h3>

                <div className="grid grid-cols-1 gap-2">
                    <SocialLink
                        href={companyInfo.behance}
                        icon={<BehanceIcon />}
                        label="Behance"
                        color="bg-[#1769ff]"
                    />
                    <SocialLink
                        href={companyInfo.artstation}
                        icon={<ArtStationIcon />}
                        label="ArtStation"
                        color="bg-[#13aff0]"
                    />
                    <SocialLink
                        href={companyInfo.facebook}
                        icon={<FacebookIcon />}
                        label="Facebook"
                        color="bg-[#1877f2]"
                    />
                    <SocialLink
                        href={companyInfo.linkedin}
                        icon={<LinkedInIcon />}
                        label="LinkedIn"
                        color="bg-[#0a66c2]"
                    />
                </div>
            </div>
        </div>
    );
}

import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

// Social media icons as SVG components
const ThreadsIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068V12c.007-3.507.865-6.358 2.503-8.4C5.834 1.548 8.603.346 12.162.32h.046c2.621.016 4.91.682 6.807 1.98a11.481 11.481 0 0 1 3.167 3.18l-2.032 1.4a8.919 8.919 0 0 0-2.466-2.5c-1.47-.998-3.253-1.508-5.3-1.52h-.034c-2.652.019-4.734.911-6.19 2.646-1.485 1.77-2.247 4.273-2.269 7.443v.037c.023 3.196.799 5.707 2.31 7.477 1.496 1.754 3.592 2.651 6.234 2.67h.007c2.138-.019 3.918-.572 5.293-1.65 1.285-1.006 2.012-2.349 2.16-3.992l-.003-.02c-.108-.735-.394-1.285-.849-1.633-.468-.359-1.123-.552-1.95-.573-.64 0-1.23.15-1.752.447-.52.296-.93.703-1.22 1.207-.14.247-.247.51-.318.786l-.027.12h-2.48l.035-.22c.128-.798.395-1.53.795-2.175a5.5 5.5 0 0 1 1.68-1.644c.677-.435 1.44-.762 2.269-.972a9.61 9.61 0 0 1 2.514-.316c1.408.007 2.672.307 3.758.894 1.093.591 1.981 1.473 2.637 2.62.658 1.152.993 2.508 1.008 4.03v.039c-.007 1.527-.341 2.89-.993 4.05-.647 1.153-1.531 2.041-2.624 2.638-1.088.593-2.358.898-3.778.907h-.077a8.2 8.2 0 0 1-2.462-.361 6.4 6.4 0 0 1-2.076-1.07c-.25.309-.527.593-.83.85a6.3 6.3 0 0 1-2.255 1.234A9.078 9.078 0 0 1 12.186 24z" />
    </svg>
);

const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385c5.737-.9 10.126-5.864 10.126-11.854z" />
    </svg>
);

const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
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
            className={`flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-primary/15 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md transition-all duration-300 group cursor-pointer`}
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
                        href={companyInfo.linkedin}
                        icon={<LinkedInIcon />}
                        label="LinkedIn"
                        color="bg-[#0a66c2]"
                    />
                    <SocialLink
                        href={companyInfo.facebook}
                        icon={<FacebookIcon />}
                        label="Facebook"
                        color="bg-[#1877f2]"
                    />
                    <SocialLink
                        href={companyInfo.threads}
                        icon={<ThreadsIcon />}
                        label="Threads"
                        color="bg-[#000000]"
                    />
                    <SocialLink
                        href={companyInfo.tiktok}
                        icon={<TikTokIcon />}
                        label="TikTok"
                        color="bg-[#010101]"
                    />
                </div>
            </div>
        </div>
    );
}

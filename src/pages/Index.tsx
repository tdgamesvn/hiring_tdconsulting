import { useState } from "react";
import { Helmet } from "react-helmet";
import ApplicationForm from "@/components/ApplicationForm";
import SuccessModal from "@/components/SuccessModal";
import Footer from "@/components/Footer";
import JobDescriptionPanel from "@/components/JobDescriptionPanel";
import CompanyInfoPanel from "@/components/CompanyInfoPanel";
import { Job } from "@/hooks/useJobs";
import tdconsultingLogo from "@/assets/tdconsulting-logo.png";

const Index = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleSuccess = () => {
    setShowSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitAnother = () => {
    setShowSuccess(false);
    window.location.reload();
  };

  const handleJobSelect = (job: Job | null) => {
    setSelectedJob(job);
  };

  return (
    <>
      <Helmet>
        <title>Join Our Team | TD CONSULTING - Premium Consulting Services</title>
        <meta
          name="description"
          content="Apply to join TD CONSULTING. We're looking for talented professionals to join our team."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="animated-background">
          <div className="cube"></div>
          <div className="cube"></div>
          <div className="cube"></div>
          <div className="cube"></div>
          <div className="cube"></div>
          <div className="cube"></div>
        </div>
        {/* Header */}
        <header className="relative z-10 pt-12 sm:pt-16 pb-8 sm:pb-12 px-5 text-center animate-fade-in-up">
          <img
            src={tdconsultingLogo}
            alt="TD CONSULTING Logo"
            className="w-[140px] sm:w-[180px] mx-auto mb-6 sm:mb-8 drop-shadow-[0_0_20px_hsl(336,92%,45%,0.5)]"
          />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-3 sm:mb-4">
            JOIN OUR TEAM
          </h1>
          <p className="text-base sm:text-lg text-foreground mb-2">
            We're looking for talented
          </p>
          <p className="text-sm text-muted-foreground">
            Fill out the form below to apply
          </p>
        </header>

        {/* Main Content - Form Absolutely Centered, Company Info on Left, JD Panel on Right */}
        <main className="relative z-10 px-5 sm:px-8 lg:px-12 pb-16">
          {/* Company Info Panel - Absolute positioned on left (Desktop only) */}
          <div
            className="hidden xl:block absolute top-0 left-0"
            style={{
              right: 'calc(50% + 432px)', // 400px (half of form) + 32px gap
              paddingLeft: '32px'
            }}
          >
            <div className="sticky top-32">
              <div className="bg-card/85 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 max-w-[320px] ml-auto">
                <CompanyInfoPanel />
              </div>
            </div>
          </div>

          {/* Form Container - Absolutely Centered */}
          <div className="max-w-[800px] mx-auto">
            <div className="bg-card/85 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-12 border border-primary/10">
              <ApplicationForm onSuccess={handleSuccess} onJobSelect={handleJobSelect} />
            </div>
          </div>

          {/* Job Description Panel - Absolute positioned on right (Desktop only) */}
          {/* Position: starts right after form (50% + 400px + gap), extends to right edge */}
          <div
            className="hidden xl:block absolute top-0 right-0"
            style={{
              left: 'calc(50% + 432px)', // 400px (half of form) + 32px gap
              paddingRight: '32px'
            }}
          >
            <div className="sticky top-32">
              <JobDescriptionPanel job={selectedJob} />
            </div>
          </div>

          {/* Mobile/Tablet View - Company Info Panel */}
          <div className="xl:hidden mt-6 max-w-[800px] mx-auto">
            <div className="bg-card/85 backdrop-blur-sm rounded-2xl p-6 border border-primary/10">
              <CompanyInfoPanel />
            </div>
          </div>

          {/* Job Description Panel - Below form on mobile/tablet */}
          <div className="xl:hidden mt-6 max-w-[800px] mx-auto">
            <JobDescriptionPanel job={selectedJob} />
          </div>
        </main>

        {/* Footer */}
        <Footer className="relative z-10" />

        {/* Success Modal */}
        {showSuccess && (
          <SuccessModal onSubmitAnother={handleSubmitAnother} />
        )}
      </div>
    </>
  );
};

export default Index;
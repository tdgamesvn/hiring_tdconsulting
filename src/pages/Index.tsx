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
        <header className="relative z-10 pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-8 md:pb-12 px-4 sm:px-6 md:px-8 text-center animate-fade-in-up">
          <img
            src={tdconsultingLogo}
            alt="TD CONSULTING Logo"
            className="w-[100px] sm:w-[140px] md:w-[180px] mx-auto mb-4 sm:mb-6 md:mb-8 drop-shadow-[0_0_20px_hsl(340,82%,52%,0.4)]"
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2 sm:mb-3 md:mb-4">
            JOIN OUR TEAM
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-foreground mb-1 sm:mb-2">
            We're looking for talented
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Fill out the form below to apply
          </p>
        </header>

        {/* Main Content - Form Absolutely Centered, Company Info on Left, JD Panel on Right */}
        <main className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 pb-12 sm:pb-16">
          {/* Company Info Panel - Absolute positioned on left (Desktop only) */}
          <div
            className="hidden 2xl:block absolute top-0 left-0"
            style={{
              right: 'calc(50% + 380px)',
              paddingLeft: '24px'
            }}
          >
            <div className="sticky top-24">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-primary/15 shadow-lg shadow-primary/5 max-w-[300px] ml-auto">
                <CompanyInfoPanel />
              </div>
            </div>
          </div>

          {/* Form Container - Responsive centered */}
          <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[720px] lg:max-w-[760px] mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-primary/15 shadow-xl shadow-primary/5">
              <ApplicationForm onSuccess={handleSuccess} onJobSelect={handleJobSelect} />
            </div>
          </div>

          {/* Job Description Panel - Absolute positioned on right (Desktop only) */}
          <div
            className="hidden 2xl:block absolute top-0 right-0"
            style={{
              left: 'calc(50% + 380px)',
              paddingRight: '24px'
            }}
          >
            <div className="sticky top-24">
              <JobDescriptionPanel job={selectedJob} />
            </div>
          </div>

          {/* Mobile/Tablet View - Company Info Panel */}
          <div className="2xl:hidden mt-4 sm:mt-6 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[720px] lg:max-w-[760px] mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/15 shadow-lg shadow-primary/5">
              <CompanyInfoPanel />
            </div>
          </div>

          {/* Job Description Panel - Below form on mobile/tablet */}
          <div className="2xl:hidden mt-4 sm:mt-6 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[720px] lg:max-w-[760px] mx-auto">
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
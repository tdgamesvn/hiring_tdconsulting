import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { PanelLeftOpen, PanelLeftClose, PanelRightOpen, PanelRightClose } from "lucide-react";
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

  // Sidebar states
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitAnother = () => {
    setShowSuccess(false);
    window.location.reload();
  };

  // Auto-show right sidebar when job is selected
  useEffect(() => {
    if (selectedJob) {
      setIsRightSidebarOpen(true);
    } else {
      setIsRightSidebarOpen(false);
    }
  }, [selectedJob]);

  // Handle job selection
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

        {/* Main Content - Flex Layout */}
        <main className="relative z-10 px-4 sm:px-6 md:px-8 pb-12 sm:pb-16 flex flex-col xl:flex-row justify-center items-start gap-6 transition-all duration-300">

          {/* Left Sidebar - Company Info */}
          <div
            className={`
              hidden xl:block transition-all duration-500 ease-in-out relative
              ${isLeftSidebarOpen ? 'w-[320px] opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-10 overflow-hidden'}
            `}
          >
            <div className="sticky top-24 pr-2">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-primary/15 shadow-lg shadow-primary/5">
                <CompanyInfoPanel />
              </div>
            </div>
          </div>

          {/* Center - Application Form */}
          <div className="w-full max-w-[800px] shrink-0 transition-all duration-300 relative">

            {/* Toggle Buttons - Desktop Only */}
            <div className="hidden xl:flex absolute top-6 -left-12 z-20">
              <button
                onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                className={`
                   p-2 rounded-full bg-white border border-primary/20 shadow-md text-primary hover:bg-primary hover:text-white transition-all duration-300
                   ${!isLeftSidebarOpen ? 'ml-8' : ''}
                 `}
                title={isLeftSidebarOpen ? "Hide Company Info" : "Show Company Info"}
              >
                {isLeftSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
              </button>
            </div>

            <div className="hidden xl:flex absolute top-6 -right-12 z-20">
              <button
                onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                className={`
                   p-2 rounded-full bg-white border border-primary/20 shadow-md text-primary hover:bg-primary hover:text-white transition-all duration-300
                   ${!isRightSidebarOpen ? 'mr-8' : ''}
                 `}
                title={isRightSidebarOpen ? "Hide Job Description" : "Show Job Description"}
              >
                {isRightSidebarOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
              </button>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-primary/15 shadow-xl shadow-primary/5">
              <ApplicationForm onSuccess={handleSuccess} onJobSelect={handleJobSelect} />
            </div>

            {/* Mobile View - Company Info (Below Form) */}
            <div className="xl:hidden mt-8">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-primary/15 shadow-lg shadow-primary/5">
                <CompanyInfoPanel />
              </div>
            </div>

            {/* Mobile View - Job Description (Below Form) */}
            <div className="xl:hidden mt-6">
              <JobDescriptionPanel job={selectedJob} />
            </div>

          </div>

          {/* Right Sidebar - Job Description */}
          <div
            className={`
               hidden xl:block transition-all duration-500 ease-in-out relative
               ${isRightSidebarOpen ? 'w-[760px] opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-10 overflow-hidden'}
             `}
          >
            <div className="sticky top-24 pl-2 min-w-[700px]">
              <JobDescriptionPanel job={selectedJob} />
            </div>
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
import { useState, useRef, useCallback, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Upload,
  X,
  CheckCircle,
  Loader2,
  ChevronDown,
  Briefcase,
  Clock,
  Plus,
  Trash2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useJobs, Job } from "@/hooks/useJobs";

// Fallback positions in case NocoDB is unavailable
const FALLBACK_POSITIONS = [
  "Headhunter",
  "Business Development",
  "HR Manager",
  "HR Executive",
  "Recruiter",
  "Accountant",
  "Software Developer",
  "Marketing Executive",
  "Graphic Designer",
  "Administrative",
  "Sales Executive",
  "Other"
];

const EXPERIENCE_LEVELS = [
  "Less than 1 year",
  "1-2 years",
  "3-5 years",
  "5-8 years",
  "8+ years"
];



const SALARY_TYPES = [
  "Gross",
  "Net",
  "Base + Commission"
];

const HOW_DID_YOU_HEAR = [
  "Job Board",
  "LinkedIn",
  "Facebook",
  "Friend/Referral",
  "Company Website",
  "Other"
];

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Remote",
  "Hybrid",
  "Freelancer",
  "Internship"
];

const HOURS_PER_WEEK = [
  "Less than 10 hours",
  "10-20 hours",
  "20-30 hours",
  "30-40 hours",
  "40+ hours"
];

// Schema for Full-time/Part-time form
const fullTimeFormSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  linkedinUrl: z.string().url("Please provide a valid URL").optional().or(z.literal("")),
  position: z.string().min(1, "Please select a position"),
  employmentType: z.string().min(1, "Please select employment type"),
  experience: z.string().min(1, "Please select your experience level"),
  howDidYouHear: z.string().optional(),
  availableStartDate: z.string().optional(),
  expectedSalary: z.string().optional(),
  salaryType: z.string().optional(),
  additionalMessage: z.string().max(1000).optional(),
});

// Schema for Freelancer form
const freelancerFormSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  portfolioUrl: z.string().url("Please provide your portfolio link"),
  position: z.string().min(1, "Please select a position"),
  hourlyRate: z.string().min(1, "Please enter your hourly rate"),
  hoursPerWeek: z.string().min(1, "Please select available hours per week"),
  additionalMessage: z.string().max(1000).optional(),
});

type FullTimeFormData = z.infer<typeof fullTimeFormSchema>;
type FreelancerFormData = z.infer<typeof freelancerFormSchema>;

// Portfolio link type
interface PortfolioLink {
  id: string;
  url: string;
}

type ApplicationType = "fulltime" | "freelancer";

interface ApplicationFormProps {
  onSuccess: () => void;
  onJobSelect?: (job: Job | null) => void;
}

export default function ApplicationForm({ onSuccess, onJobSelect }: ApplicationFormProps) {
  const [applicationType, setApplicationType] = useState<ApplicationType>("fulltime");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch jobs from NocoDB
  const { data: jobs, isLoading: isLoadingJobs } = useJobs();

  // Portfolio links state for both forms
  const [fullTimePortfolioLinks, setFullTimePortfolioLinks] = useState<PortfolioLink[]>([]);
  const [freelancerPortfolioLinks, setFreelancerPortfolioLinks] = useState<PortfolioLink[]>([]);

  // Full-time form
  const fullTimeForm = useForm<FullTimeFormData>({
    resolver: zodResolver(fullTimeFormSchema),
    defaultValues: {
    }
  });

  // Freelancer form
  const freelancerForm = useForm<FreelancerFormData>({
    resolver: zodResolver(freelancerFormSchema),
  });

  // Watch position changes to update job description
  const fullTimePosition = fullTimeForm.watch("position");
  const freelancerPosition = freelancerForm.watch("position");

  useEffect(() => {
    const currentPosition = applicationType === "fulltime" ? fullTimePosition : freelancerPosition;
    if (currentPosition && jobs) {
      const selectedJob = jobs.find(job => job.job_tittle === currentPosition);
      onJobSelect?.(selectedJob || null);
    } else {
      onJobSelect?.(null);
    }
  }, [fullTimePosition, freelancerPosition, applicationType, jobs, onJobSelect]);

  const [salaryDisplay, setSalaryDisplay] = useState("");
  const [rateDisplay, setRateDisplay] = useState("");

  const formatSalary = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");
    if (!numbers) return "";
    const formatted = Number(numbers).toLocaleString("vi-VN");
    return formatted + "đ";
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    if (rawValue) {
      setSalaryDisplay(formatSalary(rawValue));
      fullTimeForm.setValue("expectedSalary", rawValue);
    } else {
      setSalaryDisplay("");
      fullTimeForm.setValue("expectedSalary", "");
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    if (rawValue) {
      setRateDisplay(formatSalary(rawValue));
      freelancerForm.setValue("hourlyRate", rawValue);
    } else {
      setRateDisplay("");
      freelancerForm.setValue("hourlyRate", "");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive"
        });
        return;
      }
      if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF, DOC, or DOCX files only",
          variant: "destructive"
        });
        return;
      }
      setResumeFile(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive"
        });
        return;
      }
      if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF, DOC, or DOCX files only",
          variant: "destructive"
        });
        return;
      }
      setResumeFile(file);
    }
  }, []);



  // Portfolio link management for Full-time form
  const addFullTimePortfolioLink = () => {
    setFullTimePortfolioLinks(prev => [...prev, { id: crypto.randomUUID(), url: "" }]);
  };

  const updateFullTimePortfolioLink = (id: string, url: string) => {
    setFullTimePortfolioLinks(prev => prev.map(link => link.id === id ? { ...link, url } : link));
  };

  const removeFullTimePortfolioLink = (id: string) => {
    setFullTimePortfolioLinks(prev => prev.filter(link => link.id !== id));
  };

  // Portfolio link management for Freelancer form
  const addFreelancerPortfolioLink = () => {
    setFreelancerPortfolioLinks(prev => [...prev, { id: crypto.randomUUID(), url: "" }]);
  };

  const updateFreelancerPortfolioLink = (id: string, url: string) => {
    setFreelancerPortfolioLinks(prev => prev.map(link => link.id === id ? { ...link, url } : link));
  };

  const removeFreelancerPortfolioLink = (id: string) => {
    setFreelancerPortfolioLinks(prev => prev.filter(link => link.id !== id));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const onSubmitFullTime = async (data: FullTimeFormData) => {
    setIsSubmitting(true);

    try {
      let resumeBase64 = "";
      if (resumeFile) {
        resumeBase64 = await fileToBase64(resumeFile);
      }

      // Combine main portfolio URL with additional links
      const additionalLinks = fullTimePortfolioLinks
        .map(link => link.url)
        .filter(url => url.trim() !== "");

      const allPortfolioUrls = [data.linkedinUrl, ...additionalLinks].filter(url => url && url.trim() !== "");

      // Create summary text with Discord-friendly formatting
      const summaryParts = [
        `## 📋 NEW APPLICATION`,
        ``,
        `### 👤 Personal Information`,
        `**Full Name:** ${data.fullName}`,
        `**Email:** ${data.email}`,
        `**Phone:** ${data.phone}`,
        `**LinkedIn:** ${allPortfolioUrls.join(" | ")}`,
        ``,
        `### 💼 Job Information`,
        `**Position:** ${data.position}`,
        `**Employment Type:** ${data.employmentType}`,
        `**Experience:** ${data.experience}`,
        ``,
        `### 📝 Additional Information`,
        data.howDidYouHear ? `**How did you hear about TD CONSULTING:** ${data.howDidYouHear}` : null,
        data.availableStartDate ? `**Available Start Date:** ${data.availableStartDate}` : null,
        data.expectedSalary ? `**Expected Salary:** ${Number(data.expectedSalary).toLocaleString("en-US")} VND ${data.salaryType ? `(${data.salaryType})` : ""}` : null,
        data.additionalMessage ? `**Message:** ${data.additionalMessage}` : null,
        resumeFile ? `**Resume attached:** 📎 ${resumeFile.name}` : null,
        ``,
        `---`,
        `⏰ *Submitted at: ${new Date().toLocaleString("en-US")}*`
      ].filter(Boolean);

      const summary = summaryParts.join("\n");

      const payload = {
        ...data,
        applicationType: "fulltime",
        portfolioUrls: allPortfolioUrls,
        expectedSalary: data.expectedSalary ? Number(data.expectedSalary) : null,
        resumeFile: resumeBase64,
        submittedAt: new Date().toISOString(),
        summary
      };

      const response = await fetch(import.meta.env.VITE_WEBHOOK_URL || "https://n8n.tdconsulting.vn/webhook/tdgames-apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onSuccess();
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Unable to submit your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitFreelancer = async (data: FreelancerFormData) => {
    setIsSubmitting(true);

    try {
      // Combine main portfolio URL with additional links
      const additionalLinks = freelancerPortfolioLinks
        .map(link => link.url)
        .filter(url => url.trim() !== "");

      const allPortfolioUrls = [data.portfolioUrl, ...additionalLinks];

      // Create summary text with Discord-friendly formatting
      const summaryParts = [
        `## 📋 ĐƠN ỨNG TUYỂN MỚI (FREELANCER)`,
        ``,
        `### 👤 Thông tin cá nhân`,
        `**Họ và tên:** ${data.fullName}`,
        `**Email:** ${data.email}`,
        `**Số điện thoại:** ${data.phone}`,
        `**Portfolio:** ${allPortfolioUrls.join(" | ")}`,
        ``,
        `### 💼 Thông tin công việc`,
        `**Vị trí ứng tuyển:** ${data.position}`,
        `**Mức phí theo giờ:** ${data.hourlyRate ? Number(data.hourlyRate).toLocaleString("vi-VN") + "đ" : "Chưa xác định"}`,
        `**Số giờ làm việc/tuần:** ${data.hoursPerWeek}`,
        data.additionalMessage ? `\n### 📝 Lời nhắn\n${data.additionalMessage}` : null,
        ``,
        `---`,
        `⏰ *Gửi lúc: ${new Date().toLocaleString("vi-VN")}*`
      ].filter(Boolean);

      const summary = summaryParts.join("\n");

      const payload = {
        ...data,
        applicationType: "freelancer",
        portfolioUrls: allPortfolioUrls,
        hourlyRate: data.hourlyRate ? Number(data.hourlyRate) : null,
        submittedAt: new Date().toISOString(),
        summary
      };

      const response = await fetch(import.meta.env.VITE_WEBHOOK_URL || "https://n8n.tdconsulting.vn/webhook/tdgames-apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onSuccess();
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Unable to submit your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  // Progress calculation for full-time form
  const fullTimeProgress = () => {
    const completedFields = [
      fullTimeForm.watch("fullName"),
      fullTimeForm.watch("email"),
      fullTimeForm.watch("phone"),
      // fullTimeForm.watch("linkedinUrl"), // Optional now
      fullTimeForm.watch("position"),
      fullTimeForm.watch("employmentType"),
      fullTimeForm.watch("experience")
    ].filter(Boolean).length;
    return (completedFields / 6) * 100;
  };

  // Progress calculation for freelancer form
  const freelancerProgress = () => {
    const completedFields = [
      freelancerForm.watch("fullName"),
      freelancerForm.watch("email"),
      freelancerForm.watch("phone"),
      freelancerForm.watch("portfolioUrl"),
      freelancerForm.watch("position"),
      freelancerForm.watch("hourlyRate"),
      freelancerForm.watch("hoursPerWeek")
    ].filter(Boolean).length;
    return (completedFields / 7) * 100;
  };

  return (
    <div className="animate-fade-in-up">
      <FullTimeForm
        form={fullTimeForm}
        onSubmit={onSubmitFullTime}
        isSubmitting={isSubmitting}
        progress={fullTimeProgress()}
        salaryDisplay={salaryDisplay}
        handleSalaryChange={handleSalaryChange}
        resumeFile={resumeFile}
        setResumeFile={setResumeFile}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        isDragging={isDragging}
        today={today}
        portfolioLinks={fullTimePortfolioLinks}
        onAddPortfolioLink={addFullTimePortfolioLink}
        onUpdatePortfolioLink={updateFullTimePortfolioLink}
        onRemovePortfolioLink={removeFullTimePortfolioLink}
        positions={jobs?.map(j => j.job_tittle) || FALLBACK_POSITIONS}
        isLoadingPositions={isLoadingJobs}
      />
    </div>
  );
}

// Full-time Form Component
interface FullTimeFormProps {
  form: ReturnType<typeof useForm<FullTimeFormData>>;
  onSubmit: (data: FullTimeFormData) => Promise<void>;
  isSubmitting: boolean;
  progress: number;
  salaryDisplay: string;
  handleSalaryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  isDragging: boolean;
  today: string;
  portfolioLinks: PortfolioLink[];
  onAddPortfolioLink: () => void;
  onUpdatePortfolioLink: (id: string, url: string) => void;
  onRemovePortfolioLink: (id: string) => void;
  positions: string[];
  isLoadingPositions: boolean;
}

function FullTimeForm({
  form,
  onSubmit,
  isSubmitting,
  progress,
  salaryDisplay,
  handleSalaryChange,
  resumeFile,
  setResumeFile,
  fileInputRef,
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  isDragging,
  today,
  portfolioLinks,
  onAddPortfolioLink,
  onUpdatePortfolioLink,
  onRemovePortfolioLink,
  positions,
  isLoadingPositions
}: FullTimeFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = form;
  const additionalMessageValue = watch("additionalMessage") || "";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Personal Information */}
      <section className="mb-10">
        <h2 className="form-section-title">Personal Information</h2>

        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="form-label">
              Full Name <span className="text-primary">*</span>
            </label>
            <input
              {...register("fullName")}
              type="text"
              placeholder="Enter your full name"
              className={`form-input ${errors.fullName ? "form-input-error animate-shake" : ""}`}
            />
            {errors.fullName && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="form-label">
              Email <span className="text-primary">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="your.email@example.com"
              className={`form-input ${errors.email ? "form-input-error animate-shake" : ""}`}
            />
            {errors.email && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="form-label">
              Phone Number <span className="text-primary">*</span>
            </label>
            <input
              {...register("phone")}
              type="tel"
              placeholder="+84 123 456 789"
              className={`form-input ${errors.phone ? "form-input-error animate-shake" : ""}`}
            />
            {errors.phone && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* LinkedIn Profile */}
          <div>
            <label className="form-label">
              Profile URL
            </label>
            <input
              {...register("linkedinUrl")}
              type="url"
              placeholder="Please share so we can understand you better"
              className={`form-input ${errors.linkedinUrl ? "form-input-error animate-shake" : ""}`}
            />
            {errors.linkedinUrl && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.linkedinUrl.message}
              </p>
            )}

            {/* Additional Portfolio Links */}
            {portfolioLinks.map((link, index) => (
              <div key={link.id} className="flex gap-2 mt-3">
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => onUpdatePortfolioLink(link.id, e.target.value)}
                  placeholder={`Additional portfolio link ${index + 1}`}
                  className="form-input flex-1"
                />
                <button
                  type="button"
                  onClick={() => onRemovePortfolioLink(link.id)}
                  className="p-3 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Remove link"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            {/* Add More Link Button */}
            <button
              type="button"
              onClick={onAddPortfolioLink}
              className="mt-3 flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add more links
            </button>
          </div>
        </div>
      </section>

      {/* Professional Information */}
      <section className="mb-10">
        <h2 className="form-section-title">Professional Information</h2>

        <div className="space-y-6">
          {/* Position */}
          <div>
            <label className="form-label">
              Position Applying For <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select
                {...register("position")}
                className={`form-input appearance-none cursor-pointer ${errors.position ? "form-input-error animate-shake" : ""}`}
              >
                <option value="">Select a position</option>
                {isLoadingPositions ? (
                  <option disabled>Loading positions...</option>
                ) : (
                  positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))
                )}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
            {errors.position && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.position.message}
              </p>
            )}
          </div>

          {/* Employment Type */}
          <div>
            <label className="form-label">
              Employment Type <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select
                {...register("employmentType")}
                className={`form-input appearance-none cursor-pointer ${errors.employmentType ? "form-input-error animate-shake" : ""}`}
              >
                <option value="">Select employment type</option>
                {EMPLOYMENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
            {errors.employmentType && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.employmentType.message}
              </p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="form-label">
              Years of Experience <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select
                {...register("experience")}
                className={`form-input appearance-none cursor-pointer ${errors.experience ? "form-input-error animate-shake" : ""}`}
              >
                <option value="">Select experience level</option>
                {EXPERIENCE_LEVELS.map(exp => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
            {errors.experience && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.experience.message}
              </p>
            )}
          </div>


        </div>
      </section>

      {/* Additional Information */}
      <section className="mb-10">
        <h2 className="form-section-title">Additional Information</h2>

        <div className="space-y-6">
          {/* How did you hear */}
          <div>
            <label className="form-label">How did you hear about us?</label>
            <div className="relative">
              <select
                {...register("howDidYouHear")}
                className="form-input appearance-none cursor-pointer"
              >
                <option value="">Select an option</option>
                {HOW_DID_YOU_HEAR.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Available Start Date */}
          <div>
            <label className="form-label">
              Available Start Date
            </label>
            <input
              {...register("availableStartDate")}
              type="date"
              min={today}
              className={`form-input ${errors.availableStartDate ? "form-input-error animate-shake" : ""}`}
            />
            {errors.availableStartDate && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.availableStartDate.message}
              </p>
            )}
          </div>

          {/* Expected Salary */}
          <div>
            <label className="form-label">Expected Salary (VND/month)</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={salaryDisplay}
                onChange={handleSalaryChange}
                placeholder="Enter expected salary"
                className="form-input flex-1"
              />
              <select
                {...register("salaryType")}
                className="form-input w-auto min-w-[140px] appearance-none cursor-pointer"
              >
                <option value="">Salary Type</option>
                {SALARY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Message */}
          <div>
            <label className="form-label">What makes you a good fit for this job?</label>
            <textarea
              {...register("additionalMessage")}
              placeholder="Share your most notable achievement (e.g., number of successful deals, team size you've managed, or your proudest dev/design project)..."
              rows={6}
              maxLength={1000}
              className="form-input resize-none"
            />
            <p className={`char-counter ${additionalMessageValue.length > 900 ? "char-counter-warning" : ""}`}>
              {additionalMessageValue.length}/1000
            </p>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="form-label">Resume/CV Upload</label>
            <p className="text-muted-foreground text-sm mb-3">
              Accepted formats: PDF, DOC, DOCX (Max 10MB)
            </p>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${isDragging
                ? "border-primary bg-primary/10"
                : "border-primary/30 hover:border-primary/50"
                }`}
            >
              {resumeFile ? (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="w-6 h-6 text-success" />
                  <span className="text-foreground font-medium">{resumeFile.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResumeFile(null);
                    }}
                    className="p-1 rounded-full hover:bg-destructive/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-destructive" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-primary mx-auto mb-3" />
                  <p className="text-foreground font-medium">
                    Drag & drop your resume here
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    or click to browse
                  </p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-muted-foreground text-xs mt-2">
              You can also share a link to your CV in the Additional Message
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Notice */}
      <p className="text-muted-foreground text-xs text-center mb-8">
        By submitting this form, you agree to our Privacy Policy and consent to TD CONSULTING
        storing your information for recruitment purposes.
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full max-w-[300px] mx-auto block py-4 px-12 rounded-xl text-lg font-bold uppercase tracking-wide transition-all duration-300 ${isSubmitting
          ? "bg-muted text-muted-foreground cursor-not-allowed"
          : "bg-gradient-to-r from-primary to-[hsl(30,100%,50%)] text-primary-foreground shadow-[0_8px_24px_hsl(35,100%,50%,0.4)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_hsl(35,100%,50%,0.6)] active:translate-y-0 active:scale-[0.98]"
          }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </span>
        ) : (
          "Submit Application"
        )}
      </button>
    </form>
  );
}

// Freelancer Form Component
interface FreelancerFormProps {
  form: ReturnType<typeof useForm<FreelancerFormData>>;
  onSubmit: (data: FreelancerFormData) => Promise<void>;
  isSubmitting: boolean;
  progress: number;
  rateDisplay: string;
  handleRateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  portfolioLinks: PortfolioLink[];
  onAddPortfolioLink: () => void;
  onUpdatePortfolioLink: (id: string, url: string) => void;
  onRemovePortfolioLink: (id: string) => void;
  positions: string[];
  isLoadingPositions: boolean;
}

function FreelancerForm({
  form,
  onSubmit,
  isSubmitting,
  progress,
  rateDisplay,
  handleRateChange,
  portfolioLinks,
  onAddPortfolioLink,
  onUpdatePortfolioLink,
  onRemovePortfolioLink,
  positions,
  isLoadingPositions
}: FreelancerFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = form;
  const additionalMessageValue = watch("additionalMessage") || "";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Progress Bar */}
      <div className="sticky top-0 z-10 h-1 bg-primary/20 -mx-6 sm:-mx-8 lg:-mx-12 mb-8">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Personal Information */}
      <section className="mb-10">
        <h2 className="form-section-title">Personal Information</h2>

        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="form-label">
              Full Name <span className="text-primary">*</span>
            </label>
            <input
              {...register("fullName")}
              type="text"
              placeholder="Enter your full name"
              className={`form-input ${errors.fullName ? "form-input-error animate-shake" : ""}`}
            />
            {errors.fullName && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="form-label">
              Email <span className="text-primary">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="your.email@example.com"
              className={`form-input ${errors.email ? "form-input-error animate-shake" : ""}`}
            />
            {errors.email && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="form-label">
              Phone Number <span className="text-primary">*</span>
            </label>
            <input
              {...register("phone")}
              type="tel"
              placeholder="+84 123 456 789"
              className={`form-input ${errors.phone ? "form-input-error animate-shake" : ""}`}
            />
            {errors.phone && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Portfolio */}
          <div>
            <label className="form-label">
              Portfolio URL <span className="text-primary">*</span>
            </label>
            <input
              {...register("portfolioUrl")}
              type="url"
              placeholder="https://behance.net/yourname, ArtStation, or Google Drive link"
              className={`form-input ${errors.portfolioUrl ? "form-input-error animate-shake" : ""}`}
            />
            {errors.portfolioUrl && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.portfolioUrl.message}
              </p>
            )}

            {/* Additional Portfolio Links */}
            {portfolioLinks.map((link, index) => (
              <div key={link.id} className="flex gap-2 mt-3">
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => onUpdatePortfolioLink(link.id, e.target.value)}
                  placeholder={`Additional portfolio link ${index + 1}`}
                  className="form-input flex-1"
                />
                <button
                  type="button"
                  onClick={() => onRemovePortfolioLink(link.id)}
                  className="p-3 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Remove link"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            {/* Add More Link Button */}
            <button
              type="button"
              onClick={onAddPortfolioLink}
              className="mt-3 flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add more links
            </button>
          </div>
        </div>
      </section>

      {/* Freelance Information */}
      <section className="mb-10">
        <h2 className="form-section-title">Freelance Information</h2>

        <div className="space-y-6">
          {/* Position */}
          <div>
            <label className="form-label">
              Position/Skill <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select
                {...register("position")}
                className={`form-input appearance-none cursor-pointer ${errors.position ? "form-input-error animate-shake" : ""}`}
              >
                <option value="">Select your specialty</option>
                {isLoadingPositions ? (
                  <option disabled>Loading positions...</option>
                ) : (
                  positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))
                )}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
            {errors.position && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.position.message}
              </p>
            )}
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="form-label">
              Hourly Rate (VNĐ/hour) <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={rateDisplay}
              onChange={handleRateChange}
              placeholder="Enter your hourly rate"
              className={`form-input ${errors.hourlyRate ? "form-input-error animate-shake" : ""}`}
            />
            {errors.hourlyRate && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.hourlyRate.message}
              </p>
            )}
          </div>

          {/* Hours per Week */}
          <div>
            <label className="form-label">
              Available Hours per Week <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select
                {...register("hoursPerWeek")}
                className={`form-input appearance-none cursor-pointer ${errors.hoursPerWeek ? "form-input-error animate-shake" : ""}`}
              >
                <option value="">Select available hours</option>
                {HOURS_PER_WEEK.map(hours => (
                  <option key={hours} value={hours}>{hours}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
            {errors.hoursPerWeek && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.hoursPerWeek.message}
              </p>
            )}
          </div>

          {/* Additional Message */}
          <div>
            <label className="form-label">What makes you a good fit for this job?</label>
            <textarea
              {...register("additionalMessage")}
              placeholder="Tell us about your experience, availability, and why you'd like to work with TD CONSULTING..."
              rows={6}
              maxLength={1000}
              className="form-input resize-none"
            />
            <p className={`char-counter ${additionalMessageValue.length > 900 ? "char-counter-warning" : ""}`}>
              {additionalMessageValue.length}/1000
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Notice */}
      <p className="text-muted-foreground text-xs text-center mb-8">
        By submitting this form, you agree to our Privacy Policy and consent to TD CONSULTING
        storing your information for recruitment purposes.
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full max-w-[300px] mx-auto block py-4 px-12 rounded-xl text-lg font-bold uppercase tracking-wide transition-all duration-300 ${isSubmitting
          ? "bg-muted text-muted-foreground cursor-not-allowed"
          : "bg-gradient-to-r from-primary to-[hsl(30,100%,50%)] text-primary-foreground shadow-[0_8px_24px_hsl(35,100%,50%,0.4)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_hsl(35,100%,50%,0.6)] active:translate-y-0 active:scale-[0.98]"
          }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </span>
        ) : (
          "Submit Application"
        )}
      </button>
    </form>
  );
}

import { Job } from "@/hooks/useJobs";
import { Briefcase, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface JobDescriptionPanelProps {
    job: Job | null;
}

export default function JobDescriptionPanel({ job }: JobDescriptionPanelProps) {
    if (!job) {
        return (
            <div className="bg-card/85 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-primary/10 h-full flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                    Select a Position
                </h3>
                <p className="text-muted-foreground text-sm max-w-[250px]">
                    Choose a position from the dropdown to view the job description and requirements.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card/85 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-primary/10 h-auto animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Job Description</p>
                    <h3 className="text-lg font-bold text-primary">{job.job_tittle}</h3>
                </div>
            </div>

            {/* Markdown Content with Custom Component Styling */}
            <div className="jd-markdown-content">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => (
                            <h1 className="text-2xl font-bold text-primary mt-0 mb-4 pb-2 border-b border-primary/20">
                                {children}
                            </h1>
                        ),
                        h2: ({ children }) => (
                            <h2 className="text-lg font-bold text-primary mt-6 mb-3 flex items-center gap-2">
                                <span className="w-1 h-5 bg-primary rounded-full"></span>
                                {children}
                            </h2>
                        ),
                        h3: ({ children }) => (
                            <h3 className="text-base font-semibold text-primary/90 mt-4 mb-2">
                                {children}
                            </h3>
                        ),
                        p: ({ children }) => (
                            <p className="text-foreground/90 leading-relaxed mb-3">
                                {children}
                            </p>
                        ),
                        strong: ({ children }) => (
                            <strong className="text-primary font-semibold">{children}</strong>
                        ),
                        em: ({ children }) => (
                            <em className="text-foreground/70 italic">{children}</em>
                        ),
                        ul: ({ children }) => (
                            <ul className="list-none ml-0 my-3 space-y-2">
                                {children}
                            </ul>
                        ),
                        ol: ({ children }) => (
                            <ol className="list-decimal list-outside ml-5 my-3 space-y-2">
                                {children}
                            </ol>
                        ),
                        li: ({ children }) => (
                            <li className="text-foreground/90 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary before:font-bold">
                                {children}
                            </li>
                        ),
                        a: ({ href, children }) => (
                            <a
                                href={href}
                                className="text-primary underline hover:text-primary/80"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {children}
                            </a>
                        ),
                    }}
                >
                    {job.description || ""}
                </ReactMarkdown>
            </div>
        </div>
    );
}

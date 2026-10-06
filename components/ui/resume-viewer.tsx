"use client";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/portfolio-data";
export function ResumeViewer({ compact = false }: { compact?: boolean }) {
  return <Dialog><DialogTrigger asChild><Button variant="outline" className={compact ? "nav-resume" : "action-button secondary-action"}><FileText aria-hidden="true" />{compact ? "Resume" : "View resume"}</Button></DialogTrigger>
    <DialogContent className="resume-dialog"><DialogHeader><DialogTitle>Byron Aldas · Resume</DialogTitle><DialogDescription>Read the PDF below, or open it in a new tab.</DialogDescription></DialogHeader>
    <div className="resume-actions"><Button asChild variant="outline"><a href={profile.resume} target="_blank" rel="noopener noreferrer"><ExternalLink aria-hidden="true" />Open PDF</a></Button><Button asChild><a href={profile.resume} download="Byron_Aldas_Resume.pdf"><Download aria-hidden="true" />Download</a></Button></div>
    <iframe className="resume-frame" src={profile.resume} title="Byron Aldas resume PDF" tabIndex={-1} /><p className="text-sm text-muted-foreground">For full PDF controls, or if the preview is unavailable, use Open PDF or Download.</p>
    </DialogContent></Dialog>;
}

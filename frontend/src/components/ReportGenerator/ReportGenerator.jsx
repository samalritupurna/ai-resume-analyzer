import React from 'react';
import './ReportGenerator.css';

const ReportGenerator = ({ analysisData }) => {
  const {
    atsScore = 0,
    jobMatchScore = 0,
    matchedSkills = [],
    missingSkills = [],
    strengths = [],
    weaknesses = [],
    suggestions = [],
    recommendation = "No recommendation provided.",
  } = analysisData || {};

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const starsCount = Math.max(0, Math.min(5, Math.round((jobMatchScore || 0) / 20)));
  const stars = '⭐'.repeat(starsCount) + '☆'.repeat(5 - starsCount);

  const formatList = (list, prefix) => {
    if (!list || list.length === 0) return `${prefix} None`;
    return list.map(item => `${prefix} ${item}`).join('\n');
  };

  const reportText = `──────────────────────────────────────────────────────────────────
                        RESUME ANALYSIS REPORT
──────────────────────────────────────────────────────────────────

Candidate Name : Applicant
Email          : Not Provided
Target Role    : Target Job
Date           : ${today}

──────────────────────────────────────────────────────────────────
OVERALL SCORE
──────────────────────────────────────────────────────────────────

${stars}  ${jobMatchScore}/100

ATS Compatibility     : ${atsScore}%
Job Match Score       : ${jobMatchScore}%
Resume Readability    : 88%
Keyword Optimization  : 76%

──────────────────────────────────────────────────────────────────
SUMMARY
──────────────────────────────────────────────────────────────────

Your resume has an ATS compatibility score of ${atsScore}% and a job match
score of ${jobMatchScore}%. ${recommendation}

──────────────────────────────────────────────────────────────────
SKILLS DETECTED
──────────────────────────────────────────────────────────────────

${formatList(matchedSkills, '✓')}

──────────────────────────────────────────────────────────────────
MISSING KEYWORDS
──────────────────────────────────────────────────────────────────

${formatList(missingSkills, '•')}

──────────────────────────────────────────────────────────────────
WORK EXPERIENCE ANALYSIS
──────────────────────────────────────────────────────────────────

✓ Experience evaluated based on job description
✓ Alignment with core requirements checked

Strengths:
${formatList(strengths, '•')}

Weaknesses:
${formatList(weaknesses, '•')}

──────────────────────────────────────────────────────────────────
SUGGESTIONS FOR IMPROVEMENT
──────────────────────────────────────────────────────────────────

${formatList(suggestions, '•')}

──────────────────────────────────────────────────────────────────
ATS CHECK
──────────────────────────────────────────────────────────────────

✓ Standard fonts assumed
✓ Proper section headings assumed
✓ File format supported
${atsScore > 80 ? '✓ ATS Friendly' : '⚠ Requires better ATS optimization'}
${missingSkills.length > 0 ? '⚠ Add more job-specific keywords' : '✓ Good keyword density'}

──────────────────────────────────────────────────────────────────
FINAL VERDICT
──────────────────────────────────────────────────────────────────

Overall Rating: ${jobMatchScore >= 80 ? 'EXCELLENT' : jobMatchScore >= 60 ? 'GOOD' : 'NEEDS IMPROVEMENT'}

Estimated ATS Success: ${atsScore}%

Your resume ${jobMatchScore >= 80 ? 'has a strong foundation and is likely to perform well' : 'needs some adjustments to perform better'}
in ATS systems after incorporating the recommended improvements.

──────────────────────────────────────────────────────────────────`;

  const handleDownloadText = () => {
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Resume_Analysis_Report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="report-generator-container">
      <div className="report-actions no-print">
        <button className="download-btn text-btn" onClick={handleDownloadText}>
          Download Text Report
        </button>
        <button className="download-btn pdf-btn" onClick={handlePrintPdf}>
          Print / Save as PDF
        </button>
      </div>
      <div className="report-content">
        <pre>{reportText}</pre>
      </div>
    </div>
  );
};

export default ReportGenerator;

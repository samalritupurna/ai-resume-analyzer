import React from 'react';
import { Check, X } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import './Skills.css';

const Skills = ({ matched, missing }) => {
  // Combine skills for the radar chart
  // Cap at 8-10 skills total so the chart doesn't look too cluttered
  const allSkills = [...matched.map(s => ({ subject: s, match: 100 })), ...missing.map(s => ({ subject: s, match: 20 }))].slice(0, 10);

  return (
    <div className="skills-main-wrapper">
      {allSkills.length > 2 && (
        <div className="radar-chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={allSkills}>
              <PolarGrid stroke="rgba(255,255,255,0.2)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Skill Match" dataKey="match" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#10b981' }}
                formatter={(value) => [value === 100 ? 'Matched' : 'Missing', 'Status']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="skills-container">
        <div className="skills-section matched">
          <h3 className="skills-title">Matched Skills</h3>
          <div className="skills-list">
            {matched.map((skill, index) => (
              <span key={index} className="skill-pill matched-pill">
                <Check size={14} className="skill-icon" /> {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="skills-section missing">
          <h3 className="skills-title">Missing Skills</h3>
          <div className="skills-list">
            {missing.map((skill, index) => (
              <span key={index} className="skill-pill missing-pill">
                <X size={14} className="skill-icon" /> {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;

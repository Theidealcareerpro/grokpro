'use client';
  import { CLData } from '@/lib/types';

  interface CLPreviewProps {
    data: CLData;
  }

  export default function CLPreview({ data }: CLPreviewProps) {
    return (
      <div className="p-8 bg-white dark:bg-zinc-800 text-black dark:text-white">
        <p className="text-lg font-bold">{data.name || 'Your Full Name'}</p>
        <p className="text-sm">{data.address || 'Your Address or City, State'}</p>
        <p className="text-sm">{data.email || 'Your Email'}</p>
        <p className="text-sm mt-4">{data.date || new Date().toLocaleDateString('en-GB')}</p>
        <p className="text-sm mt-4">{data.hiringManagerName || 'Hiring Manager'}</p>
        <p className="text-sm">{data.companyName || 'Company Name'}</p>
        <p className="text-sm">{data.companyAddress || 'Company Address'}</p>
        <p className="text-sm">{data.cityStateZip || 'City, State, ZIP'}</p>
        <p className="text-sm mt-4">Re: Application for {data.jobTitle || 'Job Title'} Position</p>
        <p className="text-sm mt-4">Dear {data.hiringManagerName || 'Hiring Manager'},</p>
        <p className="text-sm mt-4 text-justify">{data.intro || 'Your intro paragraph here'}</p>
        {data.bodyParagraphs.map((paragraph, i) => (
          <p key={i} className="text-sm mt-4 text-justify">{paragraph || 'Your body paragraph here'}</p>
        ))}
        <p className="text-sm mt-4 text-justify">{data.excitement || 'Your excitement paragraph here'}</p>
        <p className="text-sm mt-4 text-justify">{data.thankYou || 'Your thank you paragraph here'}</p>
        <p className="text-sm mt-4">Sincerely,</p>
        <p className="text-sm mt-4">&nbsp;</p> {/* Line space */}
        <p className="text-sm">{data.name || 'Your Full Name'}</p>
        <p className="text-sm">{data.email || 'Your Email'}</p>
      </div>
    );
  }
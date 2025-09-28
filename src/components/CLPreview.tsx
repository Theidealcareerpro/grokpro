'use client';
import { CLData } from '@/lib/types';

interface CLPreviewProps {
  data: CLData;
}

export default function CLPreview({ data }: CLPreviewProps) {
  return (
    <div className="bg-white dark:bg-zinc-800 text-black dark:text-white">
      <div className="
        mx-auto p-4 sm:p-6 lg:p-8 
        max-w-[min(100%,68ch)]
        text-[var(--font-body)] leading-relaxed
      ">
        <p className="font-bold text-[clamp(20px,5.5vw,28px)]">
          {data.name || 'Your Full Name'}
        </p>

        <p className="mt-1">{data.address || 'Your Address or City, State'}</p>
        <p className="">{data.email || 'Your Email'}</p>

        <p className="mt-4">{data.date || new Date().toLocaleDateString('en-GB')}</p>
        <p className="mt-4">{data.hiringManagerName || 'Hiring Manager'}</p>
        <p className="">{data.companyName || 'Company Name'}</p>
        <p className="">{data.companyAddress || 'Company Address'}</p>
        <p className="">{data.cityStateZip || 'City, State, ZIP'}</p>

        <p className="mt-4">
          Re: Application for {data.jobTitle || 'Job Title'} Position
        </p>

        <p className="mt-4">
          Dear {data.hiringManagerName || 'Hiring Manager'},
        </p>

        <p className="mt-4 text-justify">
          {data.intro || 'Your intro paragraph here'}
        </p>

        {data.bodyParagraphs.map((paragraph, i) => (
          <p key={i} className="mt-4 text-justify">
            {paragraph || 'Your body paragraph here'}
          </p>
        ))}

        <p className="mt-4 text-justify">
          {data.excitement || 'Your excitement paragraph here'}
        </p>

        <p className="mt-4 text-justify">
          {data.thankYou || 'Your thank you paragraph here'}
        </p>

        <p className="mt-4">Sincerely,</p>
        <p className="mt-4">&nbsp;</p>

        <p className="">{data.name || 'Your Full Name'}</p>
        <p className="">{data.email || 'Your Email'}</p>
      </div>
    </div>
  );
}

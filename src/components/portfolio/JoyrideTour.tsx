'use client';
import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';

const steps = [
  {
    target: '.header-section',
    content: 'Start by filling out your personal details here.',
    disableBeacon: true,
  },
  {
    target: '.template-select',
    content: 'Choose a template to customize your portfolio style.',
  },
  {
    target: '.contact-section',
    content: 'Add your contact info and social links here.',
  },
  {
    target: '.skills-section',
    content: 'List your skills with the option to reorder them.',
  },
  {
    target: '.projects-section',
    content: 'Add and reorder your projects with details and links.',
  },
  {
    target: '.certifications-section',
    content: 'Include your certifications and reorder them.',
  },
  {
    target: '.media-section',
    content: 'Add media items like videos or articles and reorder them.',
  },
];

export default function JoyrideTour() {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    setRunTour(true);
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#2dd4bf',
          textColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    />
  );
}
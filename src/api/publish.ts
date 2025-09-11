import { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from '@octokit/rest';
import simpleGit from 'simple-git';
import * as fs from 'fs/promises';
import { supabase } from '../lib/supabase';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log('API /publish: Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('API /publish: Received request with body:', req.body);

  const { portfolioData } = req.body as { portfolioData: {
    fullName?: string;
    photoDataUrl?: string;
    about?: string;
    skills?: string[];
    projects?: { name?: string; description?: string; link?: string }[];
    certifications?: string[];
    media?: { title?: string; type?: string; link?: string }[];
    email?: string;
    phone?: string;
    linkedin?: string;
    socials?: { label?: string; url?: string }[];
    cvFileDataUrl?: string;
    cvFileName?: string;
  } };

  if (!portfolioData) {
    console.log('API /publish: Missing portfolioData');
    return res.status(400).json({ error: 'Portfolio data is required' });
  }

  const githubPat = process.env.GITHUB_PAT;
  if (!githubPat) {
    console.log('API /publish: Missing GitHub PAT');
    return res.status(500).json({ error: 'Missing GitHub PAT' });
  }

  const octokit = new Octokit({ auth: githubPat });
  const orgName = 'your-org'; // Replace with your GitHub organization name
  const uniqueId = Date.now().toString();
  const repoName = `portfolio-${uniqueId}`;

  try {
    console.log('API /publish: Creating repo:', repoName);
    await octokit.repos.createInOrg({
      org: orgName,
      name: repoName,
      private: false,
      homepage: `https://${orgName}.github.io/${repoName}/`,
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${portfolioData.fullName || 'Portfolio'} Portfolio</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .portfolio-content { max-width: 800px; margin: 0 auto; }
          h1 { font-size: 2em; }
          h2 { font-size: 1.5em; margin-top: 20px; }
          p, ul { line-height: 1.6; }
          img { max-width: 100%; height: auto; }
          a { color: #007bff; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="portfolio-content">
          <h1>${portfolioData.fullName || 'Your Name'}</h1>
          ${portfolioData.photoDataUrl ? `<img src="${portfolioData.photoDataUrl}" alt="Headshot" style="width: 150px; border-radius: 50%;">` : ''}
          ${portfolioData.about ? `<h2>About</h2><p>${portfolioData.about}</p>` : ''}
          ${portfolioData.skills && portfolioData.skills.filter(s => s).length > 0 ? `<h2>Skills</h2><ul>${portfolioData.skills.map(s => s ? `<li>${s}</li>` : '').join('')}</ul>` : ''}
          ${portfolioData.projects && portfolioData.projects.filter(p => p.name || p.description).length > 0 ? `<h2>Projects</h2>${portfolioData.projects.map(p => `<div><h3>${p.name || 'Project'}</h3><p>${p.description}</p>${p.link ? `<a href="${p.link}" target="_blank">Visit</a>` : ''}</div>`).join('')}` : ''}
          ${portfolioData.certifications && portfolioData.certifications.filter(c => c).length > 0 ? `<h2>Certifications</h2><ul>${portfolioData.certifications.map(c => c ? `<li>${c}</li>` : '').join('')}</ul>` : ''}
          ${portfolioData.media && portfolioData.media.filter(m => m.title || m.link).length > 0 ? `<h2>Media</h2>${portfolioData.media.map(m => `<div><h3>${m.title || 'Media'}</h3><p>${m.type}</p>${m.link ? `<a href="${m.link}" target="_blank">View</a>` : ''}</div>`).join('')}` : ''}
          <h2>Contact</h2>
          <p>${portfolioData.email ? `Email: <a href="mailto:${portfolioData.email}">${portfolioData.email}</a>` : ''}</p>
          <p>${portfolioData.phone ? `Phone: ${portfolioData.phone}` : ''}</p>
          <p>${portfolioData.linkedin ? `LinkedIn: <a href="${portfolioData.linkedin}" target="_blank">LinkedIn</a>` : ''}</p>
          ${portfolioData.socials && portfolioData.socials.filter(s => s.label && s.url).length > 0 ? `<h3>Social Links</h3>${portfolioData.socials.map(s => s.label && s.url ? `<a href="${s.url}" target="_blank">${s.label}</a><br>` : '').join('')}` : ''}
          ${portfolioData.cvFileDataUrl ? `<a href="${portfolioData.cvFileDataUrl}" download="${portfolioData.cvFileName || 'cv.pdf'}">Download CV</a>` : ''}
        </div>
      </body>
      </html>
    `;

    console.log('API /publish: Generating HTML content');

    // Set up Git repo
    const tempDir = `/tmp/${repoName}`;
    await fs.mkdir(tempDir, { recursive: true });
    const git = simpleGit(tempDir);
    await git.init();
    await git.addConfig('user.name', 'Portfolio Builder');
    await git.addConfig('user.email', 'portfolio@builder.com');

    // Write files
    await fs.writeFile(`${tempDir}/index.html`, htmlContent);
    await fs.writeFile(`${tempDir}/.gitignore`, 'node_modules\n');
    await fs.writeFile(`${tempDir}/404.html`, '<h1>404 - Not Found</h1>');

    // Commit and push
    await git.add('.');
    await git.commit('Initial portfolio commit');
    await git.addRemote('origin', `https://x-access-token:${githubPat}@github.com/${orgName}/${repoName}.git`);
    await git.push('origin', 'main');

    console.log('API /publish: Pushed to GitHub');

    // Enable GitHub Pages
    await octokit.repos.update({
      owner: orgName,
      repo: repoName,
      homepage: `https://${orgName}.github.io/${repoName}/`,
      pages: {
        build_type: 'project',
        branch: 'main',
        path: '/',
      },
    });

    console.log('API /publish: GitHub Pages enabled');

    // Store fingerprint and repo info in Supabase
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const { error } = await supabase.from('portfolios').insert({
      fingerprint: result.visitorId,
      expiry: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21-day expiry
      donation_status: { amount: 0, extendedDays: 0 },
      github_repo: `${orgName}/${repoName}`,
    });
    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save to database', details: error.message });
    }

    console.log('API /publish: Inserted to Supabase');

    return res.status(200).json({ message: 'Portfolio published successfully', url: `https://${orgName}.github.io/${repoName}/` });
  } catch (error) {
    console.error('Publish error:', error);
    return res.status(500).json({ error: 'Failed to publish portfolio' });
  }
}
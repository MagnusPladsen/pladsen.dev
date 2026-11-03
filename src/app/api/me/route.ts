import contactInfo from '@/lib/contactInfo';
import { CV_URL, isCvAvailable } from '@/lib/cv';
import { DEFAULT_CONTENT, FEATURED_APPS } from '@/lib/site-content';

export function GET(): Response {
  const { developer, featured } = DEFAULT_CONTENT;
  return Response.json({
    name: developer.name,
    role: developer.role,
    location: developer.location,
    work: contactInfo.work,
    tagline: developer.tagline,
    about: developer.about,
    email: contactInfo.email,
    website: contactInfo.website,
    cv: isCvAvailable() ? CV_URL : null,
    socials: contactInfo.socials.map((social) => ({ name: social.application, url: social.link })),
    featuredApps: FEATURED_APPS.map((app, index) => ({ name: featured[index].name, desc: featured[index].desc, url: app.url, repo: app.repo })),
  });
}

import { AllPortfolioData, BlogPost, BlogPostFull } from '@/types/api';
import { ModelContextTool } from '@/types/webmcp';
import { recordAgentToolCall } from './tracking';

export interface WebMcpContextData {
  portfolioData?: AllPortfolioData | null;
  posts?: BlogPost[];
}

export function createWebMcpTools(context: WebMcpContextData): ModelContextTool[] {
  const { portfolioData, posts = [] } = context;
  const about = portfolioData?.about;
  const skills = portfolioData?.skills || [];
  const projects = portfolioData?.projects || [];
  const certificates = portfolioData?.certificates || { shown: [], certs: {} };

  const wrapExecution = async <TInput, TOutput>(
    name: string,
    params: TInput,
    fn: (input: TInput) => Promise<TOutput> | TOutput
  ): Promise<TOutput> => {
    const start = Date.now();
    try {
      const result = await fn(params);
      recordAgentToolCall(name, params, 'success', Date.now() - start);
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      recordAgentToolCall(name, params, 'error', Date.now() - start, msg);
      throw err;
    }
  };

  const getProfileTool: ModelContextTool = {
    name: 'get_profile',
    description: 'Retrieve Archit\'s bio, headline, links, background, and general interests.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    execute: async (params) => {
      return wrapExecution('get_profile', params, () => {
        if (!about) {
          return { error: 'Profile data currently unavailable' };
        }
        return {
          name: `${about.firstname} ${about.lastname}`.trim() || about.username,
          username: about.username,
          title: about.title,
          bio: about.bio,
          background: about.background,
          interests: about.interests,
          links: about.links,
        };
      });
    },
  };

  const getResumeTool: ModelContextTool<{ format?: string }> = {
    name: 'get_resume',
    description: 'Retrieve Archit\'s official resume link, download resource, and quick credentials summary.',
    inputSchema: {
      type: 'object',
      properties: {
        format: {
          type: 'string',
          description: 'Format preference: "url" or "summary"',
          enum: ['url', 'summary'],
        },
      },
      additionalProperties: false,
    },
    execute: async (params) => {
      return wrapExecution('get_resume', params, ({ format = 'url' }) => {
        const resumeUrl = about?.links?.resume || 'https://0xarchit.is-a.dev';
        return {
          fileName: 'archit_resume.pdf',
          resumeUrl,
          title: about?.title || 'Full Stack Engineer & Security Enthusiast',
          directDownload: resumeUrl,
          formatRequested: format,
          summary: about?.bio || 'Full stack developer profile and credentials.',
        };
      });
    },
  };

  const getSkillsTool: ModelContextTool<{ category?: string; query?: string }> = {
    name: 'get_skills',
    description: 'List or filter technical skills across categories like Frontend, Backend, DevOps, DB, and AI/ML.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Optional category name (e.g. "Frontend Development", "Backend Development", "DevOps & Cloud")',
        },
        query: {
          type: 'string',
          description: 'Optional keyword to search across skills (e.g. "React", "Rust", "Docker", "Python")',
        },
      },
      additionalProperties: false,
    },
    execute: async (params) => {
      return wrapExecution('get_skills', params, ({ category, query }) => {
        let filtered = skills;

        if (category) {
          const lowerCat = category.toLowerCase();
          filtered = filtered.filter((c) => c.name.toLowerCase().includes(lowerCat));
        }

        if (query) {
          const lowerQ = query.toLowerCase();
          filtered = filtered
            .map((c) => ({
              ...c,
              skills: c.skills.filter((s) => s.toLowerCase().includes(lowerQ)),
            }))
            .filter((c) => c.skills.length > 0);
        }

        return {
          count: filtered.reduce((acc, c) => acc + c.skills.length, 0),
          categories: filtered,
        };
      });
    },
  };

  const searchProjectsTool: ModelContextTool<{ query?: string; tech?: string }> = {
    name: 'search_projects',
    description: 'Search portfolio projects by keywords, features, or specific technology stack.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search keyword matching project title or description.',
        },
        tech: {
          type: 'string',
          description: 'Filter projects built with a specific technology (e.g. "Next.js", "Rust", "Tailwind").',
        },
      },
      additionalProperties: false,
    },
    execute: async (params) => {
      return wrapExecution('search_projects', params, ({ query, tech }) => {
        let results = projects;

        if (tech) {
          const lowerTech = tech.toLowerCase();
          results = results.filter((p) => p.tech.some((t) => t.toLowerCase().includes(lowerTech)));
        }

        if (query) {
          const lowerQ = query.toLowerCase();
          results = results.filter(
            (p) =>
              p.title.toLowerCase().includes(lowerQ) ||
              p.desc.toLowerCase().includes(lowerQ) ||
              p.role.toLowerCase().includes(lowerQ)
          );
        }

        return {
          count: results.length,
          projects: results.map((p) => ({
            id: p.id,
            title: p.title,
            role: p.role,
            tech: p.tech,
            desc: p.desc,
            links: p.links,
          })),
        };
      });
    },
  };

  const getCertificatesTool: ModelContextTool<{ query?: string }> = {
    name: 'get_certificates',
    description: 'List certifications, credentials, and courses with direct high-resolution certificate images.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Optional filter keyword (e.g. "AWS", "Google", "Security", "AI")',
        },
      },
      additionalProperties: false,
    },
    execute: async (params) => {
      return wrapExecution('get_certificates', params, ({ query }) => {
        const allCerts = certificates.certs || {};
        let shownList = certificates.shown || [];
        let remainingList = Object.keys(allCerts).filter((t) => !shownList.includes(t));

        if (query) {
          const lowerQ = query.toLowerCase();
          shownList = shownList.filter((t) => t.toLowerCase().includes(lowerQ));
          remainingList = remainingList.filter((t) => t.toLowerCase().includes(lowerQ));
        }

        return {
          credlyUrl: 'https://www.credly.com/users/0xarchit',
          featured: shownList.map((title) => ({
            title,
            imageUrl: allCerts[title],
          })),
          moreCertifications: remainingList.map((title) => ({
            title,
            imageUrl: allCerts[title],
          })),
        };
      });
    },
  };

  const searchBlogPostsTool: ModelContextTool<{ tag?: string; limit?: number }> = {
    name: 'search_blog_posts',
    description: 'Retrieve published blog posts with metadata, dates, excerpts, and tags.',
    inputSchema: {
      type: 'object',
      properties: {
        tag: {
          type: 'string',
          description: 'Optional tag to filter posts (e.g. "nextjs", "web", "security")',
        },
        limit: {
          type: 'string',
          description: 'Maximum number of posts to return (default 10)',
        },
      },
      additionalProperties: false,
    },
    execute: async (params) => {
      return wrapExecution('search_blog_posts', params, ({ tag, limit }) => {
        let list = posts;
        if (tag) {
          const lowerTag = tag.toLowerCase();
          list = list.filter((p) => p.tags.some((t) => t.toLowerCase().includes(lowerTag)));
        }
        const parsedLimit = limit ? parseInt(String(limit), 10) : 10;
        const capped = list.slice(0, Number.isFinite(parsedLimit) ? parsedLimit : 10);

        return {
          count: capped.length,
          posts: capped.map((p) => ({
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            date: p.date,
            tags: p.tags,
            coverImage: p.coverImage,
            url: `/blog/${p.slug}`,
          })),
        };
      });
    },
  };

  const getBlogPostTool: ModelContextTool<{ slug: string }> = {
    name: 'get_blog_post',
    description: 'Fetch the full markdown article body of a blog post using its slug.',
    inputSchema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'The unique slug identifier of the post.',
        },
      },
      required: ['slug'],
      additionalProperties: false,
    },
    execute: async (params) => {
      return wrapExecution('get_blog_post', params, async ({ slug }) => {
        if (!slug) {
          return { error: 'Slug parameter is required.' };
        }
        try {
          // Fetch single post via internal query or sanity direct query
          const res = await fetch(`/api/blog/${encodeURIComponent(slug)}`, {
            headers: { Accept: 'application/json' },
          });
          if (res.ok) {
            const data: BlogPostFull = await res.json();
            return {
              title: data.title,
              slug: data.slug,
              date: data.date,
              tags: data.tags,
              body: data.body,
            };
          }
        } catch {
          // Fallback
        }

        const match = posts.find((p) => p.slug === slug);
        if (match) {
          return {
            title: match.title,
            slug: match.slug,
            date: match.date,
            tags: match.tags,
            excerpt: match.excerpt,
            note: 'Full body can be viewed on /blog/' + slug,
          };
        }

        return { error: `Blog post "${slug}" not found.` };
      });
    },
  };

  const scrollToSectionTool: ModelContextTool<{ sectionId: string }> = {
    name: 'scroll_to_section',
    description: 'Smoothly scroll the visitor viewport to a section ("about", "skills", "projects", "blog", "certificates", "contact").',
    inputSchema: {
      type: 'object',
      properties: {
        sectionId: {
          type: 'string',
          description: 'The ID of the section to scroll to.',
          enum: ['about', 'skills', 'projects', 'blog', 'certificates', 'contact'],
        },
      },
      required: ['sectionId'],
      additionalProperties: false,
    },
    execute: async (params) => {
      return wrapExecution('scroll_to_section', params, ({ sectionId }) => {
        if (typeof document === 'undefined') {
          return { status: 'server-side' };
        }
        const target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return { success: true, scrolledTo: sectionId };
        }
        return { success: false, error: `Section "#${sectionId}" not found in current view.` };
      });
    },
  };

  const navigateToTool: ModelContextTool<{ path: string }> = {
    name: 'navigate_to',
    description: 'Navigate the browser to a given route on the portfolio.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The path to navigate to (e.g. "/", "/blog", "/about", "/contact-us").',
        },
      },
      required: ['path'],
      additionalProperties: false,
    },
    execute: async (params) => {
      return wrapExecution('navigate_to', params, ({ path }) => {
        if (typeof window === 'undefined') {
          return { status: 'server-side' };
        }
        if (path && (path.startsWith('/') || path.startsWith('#'))) {
          window.location.href = path;
          return { success: true, navigatedTo: path };
        }
        return { success: false, error: 'Only local relative paths allowed.' };
      });
    },
  };

  return [
    getProfileTool,
    getResumeTool,
    getSkillsTool,
    searchProjectsTool,
    getCertificatesTool,
    searchBlogPostsTool,
    getBlogPostTool,
    scrollToSectionTool,
    navigateToTool,
  ];
}
